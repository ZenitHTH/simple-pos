use database::customer;
use database::establish_connection;
use database::receipt::{self, model::ReceiptList};

use crate::commands::settings::get_settings;
use export_lib::thai_accounting::{build_thai_sales_tax_report, TaxReportRow};
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

    // Fetch Receipts in range
    let headers: Vec<ReceiptList> =
        receipt::find_headers_by_date_range(&mut conn, start_date, end_date)
            .map_err(|e| e.to_string())?;

    // Fetch customers
    let customers = customer::get_all_customers(&mut conn).unwrap_or_default();

    // Fetch settings for VAT
    let settings = get_settings().map_err(|e| e.to_string())?;
    let vat_rate = settings.tax_rate;

    let mut report_rows = Vec::new();

    for header in headers {
        let items = receipt::get_full_receipt(&mut conn, header.receipt_id)
            .map_err(|e| e.to_string())?
            .1;

        let date_str = chrono::DateTime::from_timestamp(header.datetime_unix, 0)
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
