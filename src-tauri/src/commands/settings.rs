use directories::ProjectDirs;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::command;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppSettings {
    pub currency_symbol: String,
    pub tax_enabled: bool,
    pub tax_rate: f64,
    pub display_scale: f64,
    pub sidebar_scale: f64,
    pub cart_scale: f64,
    pub manage_table_scale: f64,
    pub category_table_scale: f64,
    pub sidebar_font_scale: f64,
    pub cart_font_scale: f64,
    pub grid_font_scale: f64,
    pub grid_scale: f64,
    pub manage_table_font_scale: f64,
    pub category_table_font_scale: f64,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            currency_symbol: "$".to_string(),
            tax_enabled: true,
            tax_rate: 7.0,
            display_scale: 100.0,
            sidebar_scale: 100.0,
            cart_scale: 100.0,
            grid_scale: 100.0,
            manage_table_scale: 100.0,
            category_table_scale: 100.0,
            sidebar_font_scale: 100.0,
            cart_font_scale: 100.0,
            grid_font_scale: 100.0,
            manage_table_font_scale: 100.0,
            category_table_font_scale: 100.0,
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
    // If parsing fails, return default instead of erroring out?
    // Or maybe error so the user knows something is wrong.
    // Let's fallback to default if file is corrupt but log it?
    // For now, simple unwrapping or default.
    let settings: AppSettings = serde_json::from_str(&content).unwrap_or_default();
    Ok(settings)
}

#[command]
pub fn save_settings(settings: AppSettings) -> Result<(), String> {
    let path = get_settings_path()?;
    let content = serde_json::to_string_pretty(&settings).map_err(|e| e.to_string())?;
    fs::write(path, content).map_err(|e| e.to_string())?;
    Ok(())
}
