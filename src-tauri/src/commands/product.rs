use database::establish_connection;
use database::product;
use database::{NewProduct, Product};

#[tauri::command]
pub fn get_products() -> Result<Vec<Product>, String> {
    let mut conn = establish_connection();
    return product::get_all_products(&mut conn).map_err(|e| e.to_string());
}

#[tauri::command]
pub fn create_product(title: String, catagory: String, satang: i32) -> Result<Product, String> {
    let mut conn = establish_connection();
    let new_prod = NewProduct {
        title: &title,
        catagory: &catagory,
        satang,
    };
    product::insert_product(&mut conn, &new_prod).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_product(
    id: i32,
    title: String,
    catagory: String,
    satang: i32,
) -> Result<Product, String> {
    let mut conn = establish_connection();
    let prod = Product {
        product_id: id,
        title,
        catagory,
        satang,
    };
    product::update_product(&mut conn, prod).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_product(id: i32) -> Result<usize, String> {
    let mut conn = establish_connection();
    product::remove_product(&mut conn, id).map_err(|e| e.to_string())
}
