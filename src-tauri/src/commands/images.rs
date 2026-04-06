use database::establish_connection;
use database::product_image::{
    get_all_links as db_get_all_links, get_linked_images as db_get_images,
    link_product_image as db_link_image, unlink_all_product_images as db_clear_product_images,
    unlink_product_image as db_unlink_image,
};
use image_lib::save_image as lib_save_image;
use tauri::command;

#[command]
pub fn save_image(key: String, data: Vec<u8>, filename: String) -> Result<database::Image, String> {
    let settings = super::settings::get_settings().map_err(|e| e.to_string())?;
    let target_dir = settings.image_storage_path.map(std::path::PathBuf::from);
    lib_save_image(&data, &filename, target_dir.as_deref(), &key).map_err(|e| e.to_string())
}

#[command]
pub fn link_product_image(
    key: String,
    product_id: i32,
    image_id: i32,
) -> Result<database::product_image::model::ProductImage, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;

    // Validate existence
    database::product::find_product(&mut conn, product_id)
        .map_err(|_| format!("Product with ID {} does not exist", product_id))?;
    database::image::get_image(&mut conn, image_id)
        .map_err(|_| format!("Image with ID {} does not exist", image_id))?;

    db_link_image(&mut conn, product_id, image_id).map_err(|e| e.to_string())
}

#[command]
pub fn unlink_product_image(key: String, product_id: i32, image_id: i32) -> Result<usize, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;

    // Validate existence (Optional but good for security report compliance)
    database::product::find_product(&mut conn, product_id)
        .map_err(|_| format!("Product with ID {} does not exist", product_id))?;
    database::image::get_image(&mut conn, image_id)
        .map_err(|_| format!("Image with ID {} does not exist", image_id))?;

    db_unlink_image(&mut conn, product_id, image_id).map_err(|e| e.to_string())
}

#[command]
pub fn clear_product_images(key: String, product_id: i32) -> Result<usize, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;

    // Validate existence
    database::product::find_product(&mut conn, product_id)
        .map_err(|_| format!("Product with ID {} does not exist", product_id))?;

    db_clear_product_images(&mut conn, product_id).map_err(|e| e.to_string())
}

#[command]
pub fn get_product_images(
    key: String,
    product_id: i32,
) -> Result<Vec<database::image::model::Image>, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    db_get_images(&mut conn, product_id).map_err(|e| e.to_string())
}

#[command]
pub fn get_all_images(key: String) -> Result<Vec<database::image::model::Image>, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    database::image::get_all_images(&mut conn).map_err(|e| e.to_string())
}

#[command]
pub fn delete_image(key: String, image_id: i32) -> Result<(), String> {
    // 1. Get image info to find the file path
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
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

#[command]
pub fn get_all_image_links(
    key: String,
) -> Result<Vec<database::product_image::model::ProductImage>, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    db_get_all_links(&mut conn).map_err(|e| e.to_string())
}

#[command]
pub fn update_image_position(
    key: String,
    image_id: i32,
    position: String,
) -> Result<usize, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    database::image::update_image_position(&mut conn, image_id, &position)
        .map_err(|e| e.to_string())
}
