use chrono::{TimeZone, Utc};
use database::customer;
use database::establish_connection;
use database::receipt::model::ReceiptList;

use settings_lib::get_settings;
use export_lib::thai_accounting::{TaxReportRow, build_thai_sales_tax_report};
use std::path::PathBuf;
use tauri::command;

#[command]
/// Exports receipts within a specific date range to a file (CSV or XLSX).
///
/// The export generates a Thai sales tax report format, including VAT calculations
/// based on the configured tax rate.
///
/// # Arguments
///
/// * `key` - The database encryption key.
/// * `export_path` - The absolute destination file path.
/// * `format` - The export format ("csv" or "xlsx").
/// * `start_date` - The start of the date range (Unix timestamp in seconds).
/// * `end_date` - The end of the date range (Unix timestamp in seconds).
///
/// # Returns
///
/// A success message string.
pub fn export_receipts(
    key: String,
    export_path: String,
    format: String,
    start_date: i64,
    end_date: i64,
) -> Result<String, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    let path = validate_export_path(&export_path)?;

    let all_data = fetch_export_data(&mut conn, start_date, end_date)?;
    let customers = customer::get_all_customers(&mut conn).unwrap_or_default();
    let settings = get_settings().map_err(|e| e.to_string())?;

    let report_rows = convert_to_tax_report_rows(all_data, customers, settings.general.tax_rate);
    let export_table = build_thai_sales_tax_report(report_rows);

    match format.as_str() {
        "csv" => export_table.export_csv(&path).map_err(|e| e.to_string())?,
        "xlsx" => export_table.export_xlsx(&path).map_err(|e| e.to_string())?,
        _ => return Err("Unsupported format".to_string()),
    }

    Ok("Export successful".to_string())
}

fn validate_export_path(export_path: &str) -> Result<PathBuf, String> {
    let path = PathBuf::from(export_path);
    if !path.is_absolute() {
        return Err("Export path must be absolute".to_string());
    }
    if path
        .components()
        .any(|c| matches!(c, std::path::Component::ParentDir))
    {
        return Err("Export path cannot contain '..' components".to_string());
    }
    Ok(path)
}

fn fetch_export_data(
    conn: &mut diesel::SqliteConnection,
    start_date: i64,
    end_date: i64,
) -> Result<Vec<(ReceiptList, database::Receipt)>, String> {
    use database::schema::{receipt_item, receipt_list};
    use diesel::prelude::*;
    receipt_list::table
        .inner_join(receipt_item::table.on(receipt_item::receipt_id.eq(receipt_list::receipt_id)))
        .filter(receipt_list::datetime_unix.ge(start_date))
        .filter(receipt_list::datetime_unix.le(end_date))
        .order(receipt_list::datetime_unix.desc())
        .load::<(ReceiptList, database::Receipt)>(conn)
        .map_err(|e| e.to_string())
}

fn convert_to_tax_report_rows(
    all_data: Vec<(ReceiptList, database::Receipt)>,
    customers: Vec<database::Customer>,
    vat_rate: f64,
) -> Vec<TaxReportRow> {
    use std::collections::BTreeMap;
    let mut receipt_groups: BTreeMap<i32, (ReceiptList, Vec<database::Receipt>)> = BTreeMap::new();
    for (header, item) in all_data {
        receipt_groups
            .entry(header.receipt_id)
            .or_insert((header, Vec::new()))
            .1
            .push(item);
    }

    receipt_groups
        .into_values()
        .rev()
        .map(|(header, items)| {
            let date_str = Utc
                .timestamp_opt(header.datetime_unix, 0)
                .single()
                .unwrap_or_default()
                .format("%d/%m/%Y")
                .to_string();

            let (customer_name, tax_id, branch_status) = if let Some(cid) = header.customer_id {
                if let Some(c) = customers.iter().find(|c| c.id == cid) {
                    (
                        c.name.clone(),
                        c.tax_id.clone().unwrap_or_else(|| "-".to_string()),
                        if c.branch == "00000" {
                            "สำนักงานใหญ่".to_string()
                        } else {
                            format!("สาขาที่ {}", c.branch)
                        },
                    )
                } else {
                    ("ลูกค้าทั่วไป".to_string(), "-".to_string(), "-".to_string())
                }
            } else {
                ("ลูกค้าทั่วไป".to_string(), "-".to_string(), "-".to_string())
            };

            let mut grand_total = 0.0;
            for item in items {
                grand_total += (item.satang_at_sale as f64 / 100.0) * item.quantity as f64;
            }

            TaxReportRow {
                date: date_str,
                invoice_no: format!("INV-{:06}", header.receipt_id),
                customer_name,
                tax_id,
                branch_address: branch_status,
                amount_before_vat: grand_total * 100.0 / (100.0 + vat_rate),
                vat_amount: grand_total * vat_rate / (100.0 + vat_rate),
                grand_total,
            }
        })
        .collect()
}
