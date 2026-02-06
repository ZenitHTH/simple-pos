use chrono::DateTime;
use database::establish_connection;
use database::product;
use database::receipt::{self, model::ReceiptList};

use export_lib::ExportData;
use std::path::PathBuf;
use tauri::command;

#[command]
pub fn export_receipts(
    export_path: String,
    format: String,
    start_date: i64,
    end_date: i64,
) -> Result<String, String> {
    let mut conn = establish_connection().map_err(|e| e.to_string())?;

    // 1. Fetch Receipts in range
    // Note: We need to implement get_invoices_by_date logic here or reuse it
    // For simplicity, let's fetch headers first
    let headers: Vec<ReceiptList> =
        receipt::find_headers_by_date_range(&mut conn, start_date, end_date)
            .map_err(|e| e.to_string())?;

    // 2. Fetch all products for lookup (optimization: lookup map)
    let products = product::get_all_products(&mut conn).map_err(|e| e.to_string())?;

    // 3. Flatten Data
    let mut export_rows = Vec::new();

    for header in headers {
        let items = receipt::get_full_receipt(&mut conn, header.receipt_id)
            .map_err(|e| e.to_string())?
            .1; // .1 is the items vector

        let date_str = DateTime::from_timestamp(header.datetime_unix, 0)
            .unwrap_or_default()
            .format("%Y-%m-%d %H:%M:%S")
            .to_string();

        for item in items {
            let product_name = products
                .iter()
                .find(|p| p.product_id == item.product_id)
                .map(|p| p.title.clone())
                .unwrap_or_else(|| format!("Unknown Product {}", item.product_id));

            let price = products
                .iter()
                .find(|p| p.product_id == item.product_id)
                .map(|p| p.satang as f64 / 100.0)
                .unwrap_or(0.0);

            let total = price * item.quantity as f64;

            export_rows.push(ExportData {
                receipt_id: header.receipt_id,
                date: date_str.clone(),
                product_name,
                quantity: item.quantity,
                price,
                total,
            });
        }
    }

    // 4. Export
    let path = PathBuf::from(&export_path);
    match format.as_str() {
        "csv" => {
            export_lib::csv_export::export_to_csv(&export_rows, &path).map_err(|e| e.to_string())?
        }
        "xlsx" => export_lib::xlsx_export::export_to_xlsx(&export_rows, &path)
            .map_err(|e| e.to_string())?,
        // "ods" => {
        //     export_lib::ods_export::export_to_ods(&export_rows, &path).map_err(|e| e.to_string())?
        // }
        _ => return Err("Unsupported format".to_string()),
    }

    Ok("Export successful".to_string())
}
