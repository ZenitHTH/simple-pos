use database::establish_connection;
use database::stock;
use database::{NewStock, Stock};

#[tauri::command]
pub fn get_stock(product_id: i32) -> Result<Vec<Stock>, String> {
    let mut conn = establish_connection();
    stock::get_stock(&mut conn, product_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn insert_stock(product_id: i32, quantity: i32) -> Result<Stock, String> {
    let mut conn = establish_connection();
    let new_stock = NewStock {
        product_id,
        quantity,
    };
    stock::insert_stock(&mut conn, &new_stock).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_stock(stock_id: i32, product_id: i32, quantity: i32) -> Result<Stock, String> {
    let mut conn = establish_connection();
    let stock_data = Stock {
        stock_id,
        product_id,
        quantity,
    };
    stock::update_stock(&mut conn, stock_data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn remove_stock(stock_id: i32) -> Result<usize, String> {
    let mut conn = establish_connection();
    stock::remove_stock(&mut conn, stock_id).map_err(|e| e.to_string())
}
