use database::product;
use database::stock;
use database::{NewStock, Stock};
use export_lib::{CellValue, ExportTable};
use std::path::PathBuf;
use diesel::Connection;
use tauri::{Emitter, Manager};

/// Retrieves the stock record for a specific product.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `product_id` - The ID of the product.
///
/// # Returns
/// The stock record for the product.
#[tauri::command]
pub fn get_stock(state: tauri::State<'_, crate::AppState>, product_id: i32) -> Result<Stock, String> {
    let mut conn = crate::conn!(state);
    stock::get_stock(&mut conn, product_id).map_err(|e| e.to_string())
}

/// Retrieves all stock records from the database.
///
/// # Arguments
/// * `key` - The database encryption key.
///
/// # Returns
/// A list of all stock records.
#[tauri::command]
pub fn get_all_stocks(state: tauri::State<'_, crate::AppState>) -> Result<Vec<Stock>, String> {
    let mut conn = crate::conn!(state);
    stock::get_all_stocks(&mut conn).map_err(|e| e.to_string())
}

/// Inserts a new stock record for a product.
/// Validates the quantity range and ensures the product exists.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `product_id` - The ID of the product.
/// * `quantity` - The initial stock quantity.
///
/// # Returns
/// The newly created stock record.
#[tauri::command]
pub fn insert_stock(state: tauri::State<'_, crate::AppState>, product_id: i32, quantity: i32) -> Result<Stock, String> {
    if !(0..=1_000_000).contains(&quantity) {
        return Err("Invalid stock quantity.".to_string());
    }

    let mut conn = crate::conn!(state);

    // Fetch product details first
    let product_info = product::find_product(&mut conn, product_id).map_err(|e| e.to_string())?;

    let new_stock = NewStock {
        product_id,
        quantity,
        satang: product_info.satang,
    };
    stock::insert_stock(&mut conn, &new_stock).map_err(|e| e.to_string())
}

/// Updates the quantity of an existing stock record.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `product_id` - The ID of the product.
/// * `quantity` - The new stock quantity.
///
/// # Returns
/// The updated stock record.
#[tauri::command]
pub fn update_stock(state: tauri::State<'_, crate::AppState>, product_id: i32, quantity: i32) -> Result<Stock, String> {
    if !(0..=1_000_000).contains(&quantity) {
        return Err("Invalid stock quantity.".to_string());
    }

    let mut conn = crate::conn!(state);
    // Pass product_id directly to the DB function
    stock::update_stock(&mut conn, product_id, quantity).map_err(|e| e.to_string())
}

/// Removes a stock record by its ID.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `stock_id` - The ID of the stock record to remove.
///
/// # Returns
/// The number of deleted records.
#[tauri::command]
pub fn remove_stock(state: tauri::State<'_, crate::AppState>, stock_id: i32) -> Result<usize, String> {
    let mut conn = crate::conn!(state);
    stock::remove_stock(&mut conn, stock_id).map_err(|e| e.to_string())
}

/// Exports all stock data to a file (CSV, XLSX, or ODS).
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `path` - The destination file path.
/// * `format` - The export format (csv, xlsx, or ods).
///
/// # Returns
/// An empty result on success.
#[tauri::command]
pub fn export_stock_data(
    app: tauri::AppHandle,
    state: tauri::State<'_, crate::AppState>,
    path: String,
    format: String,
) -> Result<(), String> {
    let app_dir = app.path().app_local_data_dir().map_err(|e| e.to_string())?;
    settings_lib::validate_path_within(&path, &app_dir)?;

    let mut conn = crate::conn!(state);
    let stocks = stock::get_all_stocks(&mut conn).map_err(|e| e.to_string())?;
    let products = product::get_all_products(&mut conn).map_err(|e| e.to_string())?;

    let mut table = ExportTable::new(vec![
        "Product ID".to_string(),
        "Product Name".to_string(),
        "Quantity".to_string(),
    ]);

    for s in stocks {
        let product_name = products
            .iter()
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
        "csv" => table
            .export_csv(path_buf)
            .map_err(|e: Box<dyn std::error::Error>| e.to_string())?,
        "xlsx" => table
            .export_xlsx(path_buf)
            .map_err(|e: Box<dyn std::error::Error>| e.to_string())?,
        "ods" => table
            .export_ods(path_buf)
            .map_err(|e: Box<dyn std::error::Error>| e.to_string())?,
        _ => return Err("Unsupported format".to_string()),
    }

    Ok(())
}

/// Imports stock data from a file (CSV, XLSX, or ODS).
/// Updates existing stock records or inserts new ones.
/// Emits progress events to the frontend during the import.
///
/// # Arguments
/// * `app` - The Tauri application handle for emitting events.
/// * `key` - The database encryption key.
/// * `path` - The source file path.
/// * `format` - The import format (csv, xlsx, or ods).
///
/// # Returns
/// The number of imported records.
#[tauri::command]
pub fn import_stock_data(
    app: tauri::AppHandle,
    state: tauri::State<'_, crate::AppState>,
    path: String,
    format: String,
) -> Result<usize, String> {
    let app_dir = app.path().app_local_data_dir().map_err(|e| e.to_string())?;
    settings_lib::validate_path_within(&path, &app_dir)?;

    let mut conn = crate::conn!(state);
    let path_buf = PathBuf::from(path);

    let table = match format.to_lowercase().as_str() {
        "csv" => ExportTable::import_csv(path_buf)
            .map_err(|e: Box<dyn std::error::Error>| e.to_string())?,
        "xlsx" => ExportTable::import_xlsx(path_buf)
            .map_err(|e: Box<dyn std::error::Error>| e.to_string())?,
        "ods" => ExportTable::import_ods(path_buf)
            .map_err(|e: Box<dyn std::error::Error>| e.to_string())?,
        _ => return Err("Unsupported format".to_string()),
    };

    let total_rows = table.rows.len();
    // Find "Product ID" and "Quantity" columns
    let id_col = table
        .headers
        .iter()
        .position(|h: &String| {
            h.to_lowercase().contains("product id") || h.to_lowercase() == "id"
        })
        .ok_or("Could not find 'Product ID' column")?;
    let qty_col = table
        .headers
        .iter()
        .position(|h: &String| h.to_lowercase().contains("quantity") || h.to_lowercase() == "qty")
        .ok_or("Could not find 'Quantity' column")?;

    // Pre-fetch all products and stocks to fix N+1 performance issue
    let all_products = product::get_all_products(&mut conn).map_err(|e| e.to_string())?;
    let all_stocks = stock::get_all_stocks(&mut conn).map_err(|e| e.to_string())?;

    conn.transaction(|conn| {
        let mut count = 0;
        for (idx, row) in table.rows.iter().enumerate() {
            let product_id = match row.get(id_col) {
                Some(CellValue::Int(n)) => *n as i32,
                Some(CellValue::Number(n)) => *n as i32,
                Some(CellValue::Text(s)) => match s.parse::<i32>() {
                    Ok(val) => val,
                    Err(_) => {
                        log::warn!("Skipping row {}: invalid product ID format '{}'", idx, s);
                        continue;
                    }
                },
                _ => continue, // Skip rows with invalid ID
            };

            let quantity = match row.get(qty_col) {
                Some(CellValue::Int(n)) => *n as i32,
                Some(CellValue::Number(n)) => *n as i32,
                Some(CellValue::Text(s)) => s.parse::<i32>().unwrap_or(0),
                _ => 0,
            };

            // Fetch product info from pre-fetched list
            let product_info = match all_products.iter().find(|p| p.product_id == product_id) {
                Some(p) => p,
                None => {
                    log::warn!("Skipping row {}: Product ID {} not found", idx, product_id);
                    continue;
                }
            };

            let existing_stock = all_stocks.iter().find(|s| s.product_id == product_id);

            if existing_stock.is_some() {
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

            // Emit progress event every 10% or at completion to reduce IPC overhead
            if total_rows > 0 && (idx % (total_rows / 10 + 1) == 0 || idx == total_rows - 1) {
                let progress = ((idx + 1) as f32 / total_rows as f32 * 100.0) as u32;
                let _ = app.emit("import-progress", progress);
            }

            count += 1;
        }
        Ok(count)
    })
    .map_err(|e: diesel::result::Error| format!("Transaction failed: {}", e))
}
