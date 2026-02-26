use directories::ProjectDirs;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::command;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppSettings {
    // ── General ──
    pub currency_symbol: String,
    pub tax_enabled: bool,
    pub tax_rate: f64,

    // ── Global Display ──
    pub display_scale: f64,
    pub layout_max_width: f64,

    // ── Component Scales ──
    pub sidebar_scale: f64,
    pub cart_scale: f64,
    pub grid_scale: f64,
    pub manage_table_scale: f64,
    pub stock_table_scale: f64,
    pub material_table_scale: f64,
    pub category_table_scale: f64,
    pub setting_page_scale: f64,
    pub payment_modal_scale: f64,

    // ── Font Scales ──
    pub header_font_scale: f64,
    pub sidebar_font_scale: f64,
    pub cart_font_scale: f64,
    pub grid_font_scale: f64,
    pub manage_table_font_scale: f64,
    pub stock_table_font_scale: f64,
    pub material_table_font_scale: f64,
    pub category_table_font_scale: f64,
    pub setting_page_font_scale: f64,
    pub payment_modal_font_scale: f64,
    pub history_font_scale: Option<f64>,

    // ── Cart Item Styling ──
    pub cart_item_font_size: Option<f64>,
    pub cart_item_header_font_size: Option<f64>,
    pub cart_item_price_font_size: Option<f64>,
    pub cart_item_padding: Option<f64>,
    pub cart_item_margin: Option<f64>,

    // ── Payment ──
    pub payment_numpad_height: Option<f64>,

    // ── Typography ──
    pub typography_font_family: Option<String>,
    pub typography_base_size: Option<f64>,
    pub typography_heading_weight: Option<f64>,
    pub typography_body_weight: Option<f64>,
    pub typography_line_height: Option<f64>,
    pub typography_letter_spacing: Option<f64>,

    // ── Storage Paths ──
    pub image_storage_path: Option<String>,
    pub db_storage_path: Option<String>,

    // ── Theme ──
    pub theme_primary_color: Option<String>,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            // ── General ──
            currency_symbol: "$".to_string(),
            tax_enabled: true,
            tax_rate: 7.0,

            // ── Global Display ──
            display_scale: 100.0,
            layout_max_width: 1280.0,

            // ── Component Scales ──
            sidebar_scale: 100.0,
            cart_scale: 100.0,
            grid_scale: 100.0,
            manage_table_scale: 100.0,
            stock_table_scale: 100.0,
            material_table_scale: 100.0,
            category_table_scale: 100.0,
            setting_page_scale: 100.0,
            payment_modal_scale: 100.0,

            // ── Font Scales ──
            header_font_scale: 100.0,
            sidebar_font_scale: 100.0,
            cart_font_scale: 100.0,
            grid_font_scale: 100.0,
            manage_table_font_scale: 100.0,
            stock_table_font_scale: 100.0,
            material_table_font_scale: 100.0,
            category_table_font_scale: 100.0,
            setting_page_font_scale: 100.0,
            payment_modal_font_scale: 100.0,
            history_font_scale: Some(100.0),

            // ── Cart Item Styling ──
            cart_item_font_size: Some(100.0),
            cart_item_header_font_size: Some(100.0),
            cart_item_price_font_size: Some(100.0),
            cart_item_padding: Some(10.0),
            cart_item_margin: Some(8.0),

            // ── Payment ──
            payment_numpad_height: Some(320.0),

            // ── Typography ──
            typography_font_family: None,
            typography_base_size: None,
            typography_heading_weight: None,
            typography_body_weight: None,
            typography_line_height: None,
            typography_letter_spacing: None,

            // ── Storage Paths ──
            image_storage_path: None,
            db_storage_path: None,

            // ── Theme ──
            theme_primary_color: None,
        }
    }
}

fn get_settings_path() -> Result<PathBuf, String> {
    let proj_dirs = ProjectDirs::from("", "", "simple-pos").ok_or_else(|| {
        "No valid home directory path could be retrieved from the operating system.".to_string()
    })?;

    let data_dir = proj_dirs.data_dir();
    if !data_dir.exists() {
        fs::create_dir_all(data_dir)
            .map_err(|e| format!("Error creating data directory: {}", e))?;
    }
    Ok(data_dir.join("settings.json"))
}

#[command]
pub fn get_settings() -> Result<AppSettings, String> {
    let path = get_settings_path()?;
    if !path.exists() {
        return Ok(AppSettings::default());
    }

    let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
    let settings: AppSettings = match serde_json::from_str(&content) {
        Ok(s) => s,
        Err(e) => {
            eprintln!("Failed to parse settings.json: {}. Using defaults.", e);
            AppSettings::default()
        }
    };
    Ok(settings)
}

#[command]
pub fn save_settings(settings: AppSettings) -> Result<(), String> {
    let path = get_settings_path()?;
    let content = serde_json::to_string_pretty(&settings).map_err(|e| e.to_string())?;
    fs::write(path, content).map_err(|e| e.to_string())?;
    Ok(())
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct StorageInfo {
    pub image_path: String,
    pub db_path: String,
}

#[command]
pub fn get_storage_info() -> Result<StorageInfo, String> {
    let db_path_buf = database::get_database_path().map_err(|e| e.to_string())?;
    let db_path = db_path_buf.to_string_lossy().to_string();

    let settings = get_settings()?;
    let image_path = if let Some(p) = settings.image_storage_path {
        p
    } else if let Some(parent) = db_path_buf.parent() {
        parent.join("images").to_string_lossy().to_string()
    } else {
        return Err("Cannot determine image path".to_string());
    };

    Ok(StorageInfo {
        image_path,
        db_path,
    })
}

#[command]
pub fn migrate_image_directory(key: String, new_path: String) -> Result<(), String> {
    let mut conn = database::establish_connection(&key).map_err(|e| e.to_string())?;
    let images = database::image::get_all_images(&mut conn).map_err(|e| e.to_string())?;

    let new_path_buf = std::path::PathBuf::from(&new_path);
    if !new_path_buf.exists() {
        std::fs::create_dir_all(&new_path_buf).map_err(|e| e.to_string())?;
    }

    for image in images {
        let old_path = std::path::PathBuf::from(&image.file_path);

        // Use the actual filename from the old path
        if let Some(filename) = old_path.file_name() {
            let dest_path = new_path_buf.join(filename);

            if old_path.exists() {
                // If it's already in the same directory, skip
                if old_path == dest_path {
                    continue;
                }

                std::fs::copy(&old_path, &dest_path).map_err(|e| {
                    format!("Failed to copy {:?} to {:?}: {}", old_path, dest_path, e)
                })?;
                database::update_image_path(&mut conn, image.id, &dest_path.to_string_lossy())
                    .map_err(|e| e.to_string())?;

                // Only remove if it's actually different (precaution)
                if old_path != dest_path {
                    let _ = std::fs::remove_file(&old_path);
                }
            }
        }
    }

    Ok(())
}
