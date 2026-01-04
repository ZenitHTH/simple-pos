use database::establish_connection;
use database::stock;
use database::{NewStock, Stock};

#[tauri::command]
pub fn get_stock(product_id: i32) -> Result<Vec<Stock>, String> {
    let mut conn = establish_connection();
    stock::get_stock(&mut conn, product_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn add_stock(
    product_id: i32,
    catagory: String,
    satang: i32,
    quantity: i32,
) -> Result<Stock, String> {
    let mut conn = establish_connection();
    let new_stock = NewStock {
        product_id,
        catagory,
        satang,
        quantity,
    };
    stock::insert_stock(&mut conn, &new_stock).map_err(|e| e.to_string())
}
