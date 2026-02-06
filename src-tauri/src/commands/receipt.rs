use database::establish_connection;
use database::receipt;
use database::{NewReceipt, Receipt, ReceiptList};

#[tauri::command]
pub fn create_invoice() -> Result<ReceiptList, String> {
    let mut conn = establish_connection().map_err(|e| e.to_string())?;
    // Create a new header with "Now" timestamp (None)
    receipt::create_receipt_header(&mut conn, None).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn add_invoice_item(
    receipt_id: i32,
    product_id: i32,
    quantity: i32,
) -> Result<Receipt, String> {
    let mut conn = establish_connection().map_err(|e| e.to_string())?;
    let item = NewReceipt {
        receipt_id,
        product_id,
        quantity,
    };
    receipt::add_item(&mut conn, &item).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_invoice_detail(receipt_id: i32) -> Result<(ReceiptList, Vec<Receipt>), String> {
    let mut conn = establish_connection().map_err(|e| e.to_string())?;
    receipt::get_full_receipt(&mut conn, receipt_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_invoices_by_date(start_unix: i64, end_unix: i64) -> Result<Vec<ReceiptList>, String> {
    let mut conn = establish_connection().map_err(|e| e.to_string())?;
    receipt::find_headers_by_date_range(&mut conn, start_unix, end_unix).map_err(|e| e.to_string())
}
