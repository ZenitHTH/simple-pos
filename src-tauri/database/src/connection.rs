use diesel::prelude::*;
use directories::ProjectDirs;
use serde_json;
use std::fs;

use std::path::PathBuf;

pub fn get_database_path() -> Result<PathBuf, String> {
    let proj_dirs = ProjectDirs::from("", "", "simple-pos").ok_or_else(|| {
        "No valid home directory path could be retrieved from the operating system.".to_string()
    })?;

    let data_dir = proj_dirs.data_dir();

    // Ensure the directory exists
    if !data_dir.exists() {
        fs::create_dir_all(data_dir)
            .map_err(|e| format!("Error creating data directory: {}", e))?;
    }

    // Try to read settings.json to check for db override
    let settings_path = data_dir.join("settings.json");
    if settings_path.exists() {
        if let Ok(content) = fs::read_to_string(&settings_path) {
            if let Ok(json) = serde_json::from_str::<serde_json::Value>(&content) {
                if let Some(db_path_str) = json.get("db_storage_path").and_then(|v| v.as_str()) {
                    let custom_path = PathBuf::from(db_path_str);
                    if !custom_path.exists() {
                        fs::create_dir_all(&custom_path).map_err(|e| {
                            format!("Error creating custom database directory: {}", e)
                        })?;
                    }
                    return Ok(custom_path.join("database.db"));
                }
            }
        }
    }

    Ok(data_dir.join("database.db"))
}

pub fn establish_connection(key: &str) -> Result<SqliteConnection, String> {
    if key.len() < 4 {
        return Err("Encryption key must be at least 4 characters long".to_string());
    }

    let database_path = get_database_path()?;
    let database_url = database_path
        .to_str()
        .ok_or_else(|| "Database path contains invalid unicode".to_string())?;

    let mut conn = SqliteConnection::establish(database_url)
        .map_err(|e| format!("Error connecting to {}: {}", database_url, e))?;

    // Set the encryption key
    let escaped_key = key.replace('\'', "''");
    diesel::sql_query(format!("PRAGMA key = '{}';", escaped_key))
        .execute(&mut conn)
        .map_err(|e| format!("Error setting encryption key: {}", e))?;

    Ok(conn)
}
