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

    // 1. Try to connect with the key
    let mut conn = SqliteConnection::establish(database_url)
        .map_err(|_| "Failed to establish database connection".to_string())?;

    let escaped_key = key.replace('\'', "''");
    diesel::sql_query(format!("PRAGMA key = '{}';", escaped_key))
        .execute(&mut conn)
        .map_err(|_| "Error setting encryption key".to_string())?;

    // Check if decryption works by performing a query that touches the master table
    if diesel::sql_query("SELECT count(*) FROM sqlite_master;")
        .execute(&mut conn)
        .is_ok()
    {
        return Ok(conn);
    }

    // 2. If it failed, check if the database is UNENCRYPTED
    // We need a NEW connection because the previous one is now in an error state for SQLCipher
    let mut conn = SqliteConnection::establish(database_url)
        .map_err(|_| "Failed to establish database connection".to_string())?;

    if diesel::sql_query("SELECT count(*) FROM sqlite_master;")
        .execute(&mut conn)
        .is_ok()
    {
        // The database is unencrypted! Let's encrypt it with the provided key.
        // In SQLCipher, PRAGMA rekey is used to set the initial key on an unencrypted database or change an existing one.
        log::debug!("Database setup: initial encryption required.");
        diesel::sql_query(format!("PRAGMA rekey = '{}';", escaped_key))
            .execute(&mut conn)
            .map_err(|_| "Error encrypting database".to_string())?;

        // Verify it's now encrypted and accessible
        diesel::sql_query("SELECT count(*) FROM sqlite_master;")
            .execute(&mut conn)
            .map_err(|_| "Database verification failed after encryption".to_string())?;

        return Ok(conn);
    }

    // 3. If it's still failing, then it's either the WRONG KEY or the database is corrupted
    Err("Invalid encryption key or corrupted database".to_string())
}
