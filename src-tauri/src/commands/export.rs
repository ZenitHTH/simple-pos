use chrono::{TimeZone, Utc};
use database::customer;
use database::establish_connection;
use database::receipt::{self, model::ReceiptList};

use crate::commands::settings::get_settings;
use export_lib::thai_accounting::{TaxReportRow, build_thai_sales_tax_report};
use std::path::PathBuf;
use tauri::command;

#[command]
pub fn export_receipts(
    key: String,
    export_path: String,
    format: String,
    start_date: i64,
    end_date: i64,
) -> Result<String, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;

    // Path validation
    let path = PathBuf::from(&export_path);
    if !path.is_absolute() {
        return Err("Export path must be absolute".to_string());
    }
    if path
        .components()
        .any(|c| matches!(c, std::path::Component::ParentDir))
    {
        return Err("Export path cannot contain '..' components".to_string());
    }

    // Join receipt_list and receipt_item to fetch everything in one query (N+1 fix)
    use database::schema::{receipt_item, receipt_list};
    use diesel::prelude::*;
    let all_data: Vec<(ReceiptList, database::Receipt)> = receipt_list::table
        .inner_join(receipt_item::table.on(receipt_item::receipt_id.eq(receipt_list::receipt_id)))
        .filter(receipt_list::datetime_unix.ge(start_date))
        .filter(receipt_list::datetime_unix.le(end_date))
        .order(receipt_list::datetime_unix.desc())
        .load::<(ReceiptList, database::Receipt)>(&mut conn)
        .map_err(|e| e.to_string())?;

    // Fetch customers
    let customers = customer::get_all_customers(&mut conn).unwrap_or_default();

    // Fetch settings for VAT
    let settings = get_settings().map_err(|e| e.to_string())?;
    let vat_rate = settings.tax_rate;

    // Group items by receipt
    use std::collections::BTreeMap;
    let mut receipt_groups: BTreeMap<i32, (ReceiptList, Vec<database::Receipt>)> = BTreeMap::new();
    for (header, item) in all_data {
        receipt_groups
            .entry(header.receipt_id)
            .or_insert((header, Vec::new()))
            .1
            .push(item);
    }

    let mut report_rows = Vec::new();

    for (header, items) in receipt_groups.into_values().rev() {
        let date_str = Utc
            .timestamp_opt(header.datetime_unix, 0)
            .single()
            .unwrap_or_default()
            .format("%d/%m/%Y")
            .to_string();

        let invoice_no = format!("INV-{:06}", header.receipt_id);

        let (customer_name, tax_id, branch_address) = if let Some(cid) = header.customer_id {
            if let Some(c) = customers.iter().find(|c| c.id == cid) {
                (
                    c.name.clone(),
                    c.tax_id.clone().unwrap_or_else(|| "-".to_string()),
                    c.address.clone().unwrap_or_else(|| "-".to_string()),
                )
            } else {
                ("ลูกค้าทั่วไป".to_string(), "-".to_string(), "-".to_string())
            }
        } else {
            ("ลูกค้าทั่วไป".to_string(), "-".to_string(), "-".to_string())
        };

        // Calculate total for this receipt
        let mut grand_total = 0.0;
        for item in items {
            let price = item.satang_at_sale as f64 / 100.0;
            grand_total += price * item.quantity as f64;
        }

        let amount_before_vat = grand_total * 100.0 / (100.0 + vat_rate);
        let vat_amount = grand_total * vat_rate / (100.0 + vat_rate);

        report_rows.push(TaxReportRow {
            date: date_str,
            invoice_no,
            customer_name,
            tax_id,
            branch_address,
            amount_before_vat,
            vat_amount,
            grand_total,
        });
    }

    let export_table = build_thai_sales_tax_report(report_rows);

    let path = PathBuf::from(&export_path);
    match format.as_str() {
        "csv" => export_table.export_csv(&path).map_err(|e| e.to_string())?,
        "xlsx" => export_table.export_xlsx(&path).map_err(|e| e.to_string())?,
        // "ods" => export_table.export_ods(&path).map_err(|e| e.to_string())?,
        _ => return Err("Unsupported format".to_string()),
    }

    Ok("Export successful".to_string())
}
