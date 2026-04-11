use crate::migration::{SettingsFormat, migrate_flat_to_nested};
use crate::models::{AppSettings, StorageInfo};
use crate::paths::{get_settings_path, validate_path};
use std::fs;

pub fn get_settings() -> Result<AppSettings, String> {
    let path = get_settings_path()?;
    if !path.exists() {
        return Ok(AppSettings::legacy_default());
    }

    let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let format: SettingsFormat = match serde_json::from_str(&content) {
        Ok(f) => f,
        Err(e) => {
            log::error!("Failed to parse settings.json: {}. Using defaults.", e);
            return Ok(AppSettings::legacy_default());
        }
    };

    match format {
        SettingsFormat::Nested(s) => Ok(s),
        SettingsFormat::Flat(flat) => {
            log::info!("Migrating flat settings to nested format...");
            let nested = migrate_flat_to_nested(flat);
            // Save the migrated settings immediately
            let content = serde_json::to_string_pretty(&nested).map_err(|e| e.to_string())?;
            fs::write(path, content).map_err(|e| e.to_string())?;
            Ok(nested)
        }
    }
}

pub fn save_settings(settings: AppSettings) -> Result<(), String> {
    // Validate storage paths if provided
    if let Some(ref p) = settings.storage.db_storage_path {
        validate_path(p)?;
    }
    if let Some(ref p) = settings.storage.image_storage_path {
        validate_path(p)?;
    }

    let path = get_settings_path()?;
    let content = serde_json::to_string_pretty(&settings).map_err(|e| e.to_string())?;
    fs::write(path, content).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn get_storage_info() -> Result<StorageInfo, String> {
    let path = get_settings_path()?;
    let parent = path.parent().ok_or("Cannot determine data directory")?;
    let db_path = parent.join("pos.db").to_string_lossy().to_string();

    let settings = get_settings()?;
    let image_path = if let Some(p) = settings.storage.image_storage_path {
        p
    } else {
        parent.join("images").to_string_lossy().to_string()
    };

    Ok(StorageInfo {
        image_path,
        db_path,
    })
}
