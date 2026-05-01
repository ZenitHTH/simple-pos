use database::product;
use database::product::model::ProductWithImage;
use database::{NewProduct, Product};

/// Retrieves all products with their associated images from the database.
///
/// # Arguments
/// * `key` - The database encryption key.
///
/// # Returns
/// A list of products with their associated image metadata.
#[tauri::command]
pub fn get_products(
    state: tauri::State<'_, crate::AppState>,
) -> Result<Vec<ProductWithImage>, String> {
    let mut conn = crate::conn!(state);
    product::get_all_products_with_images(&mut conn).map_err(|e| e.to_string())
}

/// Creates a new product with the specified details.
/// Validates input length, price range, and ensures the product name is unique.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `title` - The name of the product.
/// * `category_id` - The ID of the category this product belongs to.
/// * `satang` - The price of the product in satang (1/100 of the currency unit).
/// * `use_recipe` - Whether this product uses recipe-based stock tracking.
///
/// # Returns
/// The newly created product.
#[tauri::command]
pub fn create_product(
    state: tauri::State<'_, crate::AppState>,
    title: String,
    category_id: i32,
    satang: i32,
    use_recipe: bool,
) -> Result<Product, String> {
    let mut conn = crate::conn!(state);

    let trimmed_title = title.trim();
    if trimmed_title.is_empty() {
        return Err("Product name cannot be empty.".to_string());
    }
    if trimmed_title.len() > 100 {
        return Err("Product name is too long.".to_string());
    }
    if !(0..=1_000_000_000).contains(&satang) {
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
        use_recipe_stock: use_recipe,
    };
    product::insert_product(&mut conn, &new_prod).map_err(|e| e.to_string())
}

/// Updates an existing product's information.
/// Performs validation on title length, price, and ensures name uniqueness.
/// Also synchronizes the product price in the stock records.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `id` - The ID of the product to update.
/// * `title` - The new name for the product.
/// * `category_id` - The new category ID for the product.
/// * `satang` - The new price for the product in satang.
///
/// # Returns
/// The updated product.
#[tauri::command]
pub fn update_product(
    state: tauri::State<'_, crate::AppState>,
    id: i32,
    title: String,
    category_id: i32,
    satang: i32,
) -> Result<Product, String> {
    let mut conn = crate::conn!(state);

    let trimmed_title = title.trim();
    if trimmed_title.is_empty() {
        return Err("Product name cannot be empty.".to_string());
    }
    if trimmed_title.len() > 100 {
        return Err("Product name is too long.".to_string());
    }
    if !(0..=1_000_000_000).contains(&satang) {
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

    // Get existing to preserve use_recipe_stock if not provided or implement full update
    let existing = product::find_product(&mut conn, id).map_err(|e| e.to_string())?;

    let prod = Product {
        product_id: id,
        title: trimmed_title.to_string(),
        category_id,
        satang,
        use_recipe_stock: existing.use_recipe_stock,
    };

    let updated_prod = product::update_product(&mut conn, prod).map_err(|e| e.to_string())?;

    // Sync price in stock table
    use database::stock;
    let _ = stock::sync_product_price_in_stock(&mut conn, id, satang);

    Ok(updated_prod)
}

/// Deletes a product by its ID.
/// Before deletion, checks if the product is referenced in past receipts.
/// Cleans up associated stock records and image links.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `id` - The ID of the product to delete.
///
/// # Returns
/// The number of deleted records.
#[tauri::command]
pub fn delete_product(state: tauri::State<'_, crate::AppState>, id: i32) -> Result<usize, String> {
    let mut conn = crate::conn!(state);

    // Check if the product is used in past receipts
    let has_deps = product::check_product_dependencies(&mut conn, id).map_err(|e| e.to_string())?;
    if has_deps {
        return Err(
            "Cannot delete product: it is currently referenced in past receipts. Try archiving instead."
                .to_string(),
        );
    }

    // Clean up associated stock record
    use database::stock;
    let _ = stock::remove_stock_by_product(&mut conn, id);

    // Clean up product images link
    product::remove_product_images_link(&mut conn, id).map_err(|e| e.to_string())?;

    product::remove_product(&mut conn, id).map_err(|e| e.to_string())
}

/// Sets whether a product uses recipe-based stock tracking.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `id` - The ID of the product.
/// * `use_recipe` - Whether to use recipe-based stock tracking.
///
/// # Returns
/// An empty result on success.
#[tauri::command]
pub fn set_product_stock_mode(
    state: tauri::State<'_, crate::AppState>,
    id: i32,
    use_recipe: bool,
) -> Result<(), String> {
    let mut conn = crate::conn!(state);
    product::set_product_stock_mode(&mut conn, id, use_recipe).map_err(|e| e.to_string())
}
