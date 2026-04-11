use database::establish_connection;
use settings_lib::{
    get_settings as lib_get_settings, get_storage_info as lib_get_storage_info,
    save_settings as lib_save_settings, AppSettings, StorageInfo,
};
use std::path::PathBuf;
use tauri::{command, Manager};

#[command]
pub fn get_settings() -> Result<AppSettings, String> {
    lib_get_settings()
}

#[command]
pub fn save_settings(settings: AppSettings) -> Result<(), String> {
    lib_save_settings(settings)
}

#[command]
pub fn get_storage_info() -> Result<StorageInfo, String> {
    lib_get_storage_info()
}

#[command]
pub fn migrate_image_directory(
    app: tauri::AppHandle,
    key: String,
    new_path: String,
) -> Result<(), String> {
    settings_lib::validate_path(&new_path)?;

    // Security: Restrict migration to app-local data directory or user home to prevent arbitrary writes
    let new_path_buf = PathBuf::from(&new_path);
    let app_dir = app
        .path()
        .app_local_data_dir()
        .map_err(|e| e.to_string())?;

    // Allow migration to directories under app_local_data_dir or a dedicated "images" folder
    if !new_path_buf.starts_with(&app_dir) {
        // Also allow if it's explicitly allowed in tauri.conf.json or similar, 
        // but here we enforce a strict app-local-data policy for simplicity and security.
        return Err("Migration target must be within the application data directory.".to_string());
    }

    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    let images = database::image::get_all_images(&mut conn).map_err(|e| e.to_string())?;

    if !new_path_buf.exists() {
        std::fs::create_dir_all(&new_path_buf)
            .map_err(|e| format!("Error creating new directory: {}", e))?;
    }

    for image in images {
        let old_path = PathBuf::from(&image.file_path);

        // Use the actual filename from the current path (which is hash-based and safe)
        // instead of image.file_name (which is the original user-provided name)
        let actual_filename = match old_path.file_name() {
            Some(name) => name,
            None => continue, // Should not happen for valid paths
        };

        let dest_path = new_path_buf.join(actual_filename);
        let dest_path_str = dest_path.to_string_lossy().to_string();

        if old_path.exists() {
            // If it's already in the same directory, skip
            if old_path == dest_path {
                continue;
            }

            // Copy file to new location
            std::fs::copy(&old_path, &dest_path).map_err(|e| {
                format!(
                    "Failed to copy {} to {}: {}",
                    image.file_name, dest_path_str, e
                )
            })?;

            // Update database record
            database::image::update_image_path(&mut conn, image.id, &dest_path_str)
                .map_err(|e| e.to_string())?;

            // Delete old file only if it's different (extra precaution)
            if old_path != dest_path {
                let _ = std::fs::remove_file(&old_path);
            }
        }
    }

    Ok(())
}
