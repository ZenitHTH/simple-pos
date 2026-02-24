use database::establish_connection;
use database::product;
use database::product::model::ProductWithImage;
use database::{NewProduct, Product};

#[tauri::command]
pub fn get_products(key: String) -> Result<Vec<ProductWithImage>, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    product::get_all_products_with_images(&mut conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_product(
    key: String,
    title: String,
    category_id: i32,
    satang: i32,
) -> Result<Product, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;

    let trimmed_title = title.trim();
    if trimmed_title.is_empty() {
        return Err("Product name cannot be empty.".to_string());
    }
    if trimmed_title.len() > 100 {
        return Err("Product name is too long.".to_string());
    }
    if satang < 0 || satang > 1_000_000_000 {
        return Err("Invalid product price.".to_string());
    }

    if category_id <= 0 {
        return Err("Invalid category.".to_string());
    }

    // Check if product with the same name already exists
    if let Ok(Some(_)) = product::find_product_by_title(&mut conn, trimmed_title) {
        return Err("A product with this name already exists.".to_string());
    }

    let new_prod = NewProduct {
        title: trimmed_title,
        category_id,
        satang,
    };
    product::insert_product(&mut conn, &new_prod).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_product(
    key: String,
    id: i32,
    title: String,
    category_id: i32,
    satang: i32,
) -> Result<Product, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;

    let trimmed_title = title.trim();
    if trimmed_title.is_empty() {
        return Err("Product name cannot be empty.".to_string());
    }
    if trimmed_title.len() > 100 {
        return Err("Product name is too long.".to_string());
    }
    if satang < 0 || satang > 1_000_000_000 {
        return Err("Invalid product price.".to_string());
    }

    if category_id <= 0 {
        return Err("Invalid category.".to_string());
    }

    // Check if another product with the new name already exists
    if let Ok(Some(existing)) = product::find_product_by_title(&mut conn, trimmed_title) {
        if existing.product_id != id {
            return Err("Another product with this name already exists.".to_string());
        }
    }

    let prod = Product {
        product_id: id,
        title: trimmed_title.to_string(),
        category_id,
        satang,
    };

    let updated_prod = product::update_product(&mut conn, prod).map_err(|e| e.to_string())?;

    // Sync price in stock table
    use database::stock;
    let _ = stock::sync_product_price_in_stock(&mut conn, id, satang);

    Ok(updated_prod)
}

#[tauri::command]
pub fn delete_product(key: String, id: i32) -> Result<usize, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;

    // Check if the product is used in stock or receipts
    let has_deps = product::check_product_dependencies(&mut conn, id).map_err(|e| e.to_string())?;
    if has_deps {
        return Err(
            "Cannot delete product: it is currently referenced in stock or past receipts."
                .to_string(),
        );
    }

    // Clean up product images link
    product::remove_product_images_link(&mut conn, id).map_err(|e| e.to_string())?;

    product::remove_product(&mut conn, id).map_err(|e| e.to_string())
}
