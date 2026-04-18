use database::product_image::{
    get_all_links as db_get_all_links, get_image_link as db_get_image_link,
    get_linked_images as db_get_images, link_product_image as db_link_image,
    unlink_all_product_images as db_clear_product_images,
    unlink_image_from_all_products as db_unlink_image_from_all,
    unlink_product_image as db_unlink_image,
};
use diesel::Connection;
use image_lib::save_image as lib_save_image;
use settings_lib::get_settings;
use tauri::command;

/// Saves an image from raw byte data to the configured image storage path.
/// Returns the saved Image database record.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `data` - The raw image data as a byte vector.
/// * `filename` - The original filename of the image.
///
/// # Returns
/// The newly created image record in the database.
#[command]
pub fn save_image(state: tauri::State<'_, crate::AppState>, data: Vec<u8>, filename: String) -> Result<database::Image, String> {
    let mut conn = crate::conn!(state);
    let settings = get_settings().map_err(|e| e.to_string())?;
    let target_dir = settings.storage.image_storage_path.map(std::path::PathBuf::from);
    lib_save_image(&data, &filename, target_dir.as_deref(), &mut conn).map_err(|e| e.to_string())
}

/// Links an existing image to a product.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `product_id` - The ID of the product.
/// * `image_id` - The ID of the image to link.
///
/// # Returns
/// The newly created product-image association record.
#[command]
pub fn link_product_image(
    state: tauri::State<'_, crate::AppState>,
    product_id: i32,
    image_id: i32,
) -> Result<database::product_image::model::ProductImage, String> {
    let mut conn = crate::conn!(state);

    // Validate existence
    database::product::find_product(&mut conn, product_id)
        .map_err(|_| format!("Product with ID {} does not exist", product_id))?;
    database::image::get_image(&mut conn, image_id)
        .map_err(|_| format!("Image with ID {} does not exist", image_id))?;

    // Step 1: Add exclusivity check to link_product_image
    let existing_link = db_get_image_link(&mut conn, image_id).map_err(|e| e.to_string())?;
    if let Some(link) = existing_link {
        let product = database::product::find_product(&mut conn, link.product_id)
            .map_err(|_| "Product not found".to_string())?;
        return Err(format!("ALREADY_LINKED: {}", product.title));
    }

    db_link_image(&mut conn, product_id, image_id).map_err(|e| e.to_string())
}

/// Moves an image from one product to another.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `image_id` - The ID of the image to move.
/// * `new_product_id` - The ID of the new product to link the image to.
///
/// # Returns
/// An empty result on success.
#[command]
pub fn move_product_image(key: String, image_id: i32, new_product_id: i32) -> Result<(), String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;

    conn.transaction(|c| {
        db_unlink_image_from_all(c, image_id)?;
        db_link_image(c, new_product_id, image_id)?;
        Ok(())
    })
    .map_err(|e: diesel::result::Error| e.to_string())
}

/// Unlinks an image from a product.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `product_id` - The ID of the product.
/// * `image_id` - The ID of the image to unlink.
///
/// # Returns
/// The number of deleted records.
#[command]
pub fn unlink_product_image(state: tauri::State<'_, crate::AppState>, product_id: i32, image_id: i32) -> Result<usize, String> {
    let mut conn = crate::conn!(state);

    // Validate existence (Optional but good for security report compliance)
    database::product::find_product(&mut conn, product_id)
        .map_err(|_| format!("Product with ID {} does not exist", product_id))?;
    database::image::get_image(&mut conn, image_id)
        .map_err(|_| format!("Image with ID {} does not exist", image_id))?;

    db_unlink_image(&mut conn, product_id, image_id).map_err(|e| e.to_string())
}

/// Removes all image links from a product.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `product_id` - The ID of the product.
///
/// # Returns
/// The number of deleted records.
#[command]
pub fn clear_product_images(state: tauri::State<'_, crate::AppState>, product_id: i32) -> Result<usize, String> {
    let mut conn = crate::conn!(state);

    // Validate existence
    database::product::find_product(&mut conn, product_id)
        .map_err(|_| format!("Product with ID {} does not exist", product_id))?;

    db_clear_product_images(&mut conn, product_id).map_err(|e| e.to_string())
}

/// Retrieves all images linked to a specific product.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `product_id` - The ID of the product.
///
/// # Returns
/// A list of images linked to the specified product.
#[command]
pub fn get_product_images(
    state: tauri::State<'_, crate::AppState>,
    product_id: i32,
) -> Result<Vec<database::image::model::Image>, String> {
    let mut conn = crate::conn!(state);
    db_get_images(&mut conn, product_id).map_err(|e| e.to_string())
}

/// Retrieves all images stored in the database.
///
/// # Arguments
/// * `key` - The database encryption key.
///
/// # Returns
/// A list of all image records.
#[command]
pub fn get_all_images(state: tauri::State<'_, crate::AppState>) -> Result<Vec<database::image::model::Image>, String> {
    let mut conn = crate::conn!(state);
    database::image::get_all_images(&mut conn).map_err(|e| e.to_string())
}

/// Deletes an image record from the database and removes the associated file from disk.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `image_id` - The ID of the image to delete.
///
/// # Returns
/// An empty result on success.
#[command]
pub fn delete_image(state: tauri::State<'_, crate::AppState>, image_id: i32) -> Result<(), String> {
    // 1. Get image info to find the file path
    let mut conn = crate::conn!(state);
    let image = database::image::get_image(&mut conn, image_id).map_err(|e| e.to_string())?;

    // 2. Delete from DB
    database::image::delete_image(&mut conn, image_id).map_err(|e| e.to_string())?;

    // 3. Delete file
    // Note: We ignore file deletion errors if the file doesn't exist, but we should try.
    // If multiple DB entries point to same file (unlikely with hash-based naming but possible if manual interference),
    // we might want to check ref counts. But here we assume 1:1 or 1:N but we are deleting the Image record which is the "file handle".
    // Wait, `images` table is the file handle. `product_images` links products to images.
    // If we delete from `images` table, we should Cascade delete from `product_images` (handled by FK usually or manual).
    // Let's assume standard behavior: delete image = delete file + DB record.

    let path = image.file_path;
    let _ = image_lib::delete_image_file(&path); // Ignore error if file partially missing

    Ok(())
}

/// Retrieves all product-to-image associations.
///
/// # Arguments
/// * `key` - The database encryption key.
///
/// # Returns
/// A list of all product-image association records.
#[command]
pub fn get_all_image_links(
    state: tauri::State<'_, crate::AppState>,
) -> Result<Vec<database::product_image::model::ProductImage>, String> {
    let mut conn = crate::conn!(state);
    db_get_all_links(&mut conn).map_err(|e| e.to_string())
}

/// Updates the metadata position of an image.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `image_id` - The ID of the image.
/// * `position` - The new position metadata (e.g., "center", "top").
///
/// # Returns
/// The number of updated records.
#[command]
pub fn update_image_position(
    state: tauri::State<'_, crate::AppState>,
    image_id: i32,
    position: String,
) -> Result<usize, String> {
    let mut conn = crate::conn!(state);
    database::image::update_image_position(&mut conn, image_id, &position)
        .map_err(|e| e.to_string())
}
