use database::establish_connection;
use database::product;
use database::stock;
use database::{NewStock, Stock};
use export_lib::{ExportTable, CellValue};
use std::path::PathBuf;
use diesel::Connection;
use tauri::Emitter;

#[tauri::command]
pub fn get_stock(key: String, product_id: i32) -> Result<Stock, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    stock::get_stock(&mut conn, product_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_all_stocks(key: String) -> Result<Vec<Stock>, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    stock::get_all_stocks(&mut conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn insert_stock(key: String, product_id: i32, quantity: i32) -> Result<Stock, String> {
    if !(0..=1_000_000).contains(&quantity) {
        return Err("Invalid stock quantity.".to_string());
    }

    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;

    // Fetch product details first
    let product_info = product::find_product(&mut conn, product_id).map_err(|e| e.to_string())?;

    let new_stock = NewStock {
        product_id,
        quantity,
        satang: product_info.satang,
    };
    stock::insert_stock(&mut conn, &new_stock).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_stock(key: String, product_id: i32, quantity: i32) -> Result<Stock, String> {
    if !(0..=1_000_000).contains(&quantity) {
        return Err("Invalid stock quantity.".to_string());
    }

    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    // Pass product_id directly to the DB function
    stock::update_stock(&mut conn, product_id, quantity).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn remove_stock(key: String, stock_id: i32) -> Result<usize, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    stock::remove_stock(&mut conn, stock_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn export_stock_data(
    key: String,
    path: String,
    format: String
) -> Result<(), String> {
    settings_lib::validate_path(&path)?;
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    let stocks = stock::get_all_stocks(&mut conn).map_err(|e| e.to_string())?;
    let products = product::get_all_products(&mut conn).map_err(|e| e.to_string())?;

    let mut table = ExportTable::new(vec![
        "Product ID".to_string(),
        "Product Name".to_string(),
        "Quantity".to_string(),
    ]);

    for s in stocks {
        let product_name = products.iter()
            .find(|p| p.product_id == s.product_id)
            .map(|p| p.title.clone())
            .unwrap_or_else(|| "Unknown".to_string());

        table.add_row(vec![
            CellValue::Int(s.product_id as i64),
            CellValue::Text(product_name),
            CellValue::Int(s.quantity as i64),
        ]);
    }

    let path_buf = PathBuf::from(path);
    match format.to_lowercase().as_str() {
        "csv" => table.export_csv(path_buf).map_err(|e: Box<dyn std::error::Error>| e.to_string())?,
        "xlsx" => table.export_xlsx(path_buf).map_err(|e: Box<dyn std::error::Error>| e.to_string())?,
        "ods" => table.export_ods(path_buf).map_err(|e: Box<dyn std::error::Error>| e.to_string())?,
        _ => return Err("Unsupported format".to_string()),
    }

    Ok(())
}

#[tauri::command]
pub fn import_stock_data(
    app: tauri::AppHandle,
    key: String,
    path: String,
    format: String
) -> Result<usize, String> {
    settings_lib::validate_path(&path)?;
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    let path_buf = PathBuf::from(path);

    let table = match format.to_lowercase().as_str() {
        "csv" => ExportTable::import_csv(path_buf).map_err(|e: Box<dyn std::error::Error>| e.to_string())?,
        "xlsx" => ExportTable::import_xlsx(path_buf).map_err(|e: Box<dyn std::error::Error>| e.to_string())?,
        "ods" => ExportTable::import_ods(path_buf).map_err(|e: Box<dyn std::error::Error>| e.to_string())?,
        _ => return Err("Unsupported format".to_string()),
    };

    let total_rows = table.rows.len();
    // Find "Product ID" and "Quantity" columns
    let id_col = table.headers.iter().position(|h: &String| h.to_lowercase().contains("product id") || h.to_lowercase() == "id")
        .ok_or("Could not find 'Product ID' column")?;
    let qty_col = table.headers.iter().position(|h: &String| h.to_lowercase().contains("quantity") || h.to_lowercase() == "qty")
        .ok_or("Could not find 'Quantity' column")?;

    conn.transaction(|conn| {
        let mut count = 0;
        for (idx, row) in table.rows.iter().enumerate() {
            let product_id = match row.get(id_col) {
                Some(CellValue::Int(n)) => *n as i32,
                Some(CellValue::Number(n)) => *n as i32,
                Some(CellValue::Text(s)) => s.parse::<i32>().map_err(|_| {
                    diesel::result::Error::RollbackTransaction
                })?,
                _ => continue, // Skip rows with invalid ID
            };

            let quantity = match row.get(qty_col) {
                Some(CellValue::Int(n)) => *n as i32,
                Some(CellValue::Number(n)) => *n as i32,
                Some(CellValue::Text(s)) => s.parse::<i32>().map_err(|_| {
                    diesel::result::Error::RollbackTransaction
                })?,
                _ => 0,
            };

            // Fetch product info to ensure it exists and get satang
            let product_info = product::find_product(conn, product_id)
                .map_err(|_| diesel::result::Error::RollbackTransaction)?;
            
            let existing_stock = stock::get_stock(conn, product_id);
            
            if existing_stock.is_ok() {
                stock::update_stock(conn, product_id, quantity)
                    .map_err(|_| diesel::result::Error::RollbackTransaction)?;
            } else {
                let new_stock = NewStock {
                    product_id,
                    quantity,
                    satang: product_info.satang,
                };
                stock::insert_stock(conn, &new_stock)
                    .map_err(|_| diesel::result::Error::RollbackTransaction)?;
            }
            
            // Emit progress event
            let progress = ((idx + 1) as f32 / total_rows as f32 * 100.0) as u32;
            app.emit("import-progress", progress).map_err(|_| diesel::result::Error::RollbackTransaction)?;
            
            count += 1;
        }
        Ok(count)
    }).map_err(|e: diesel::result::Error| format!("Transaction failed: {}", e))
}
