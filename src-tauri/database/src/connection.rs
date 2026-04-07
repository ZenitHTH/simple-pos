use diesel::prelude::*;
use diesel::sql_query;
use directories::ProjectDirs;
use serde_json;
use std::fs;
use std::path::{Path, PathBuf};

/// Gets the absolute path to the SQLite database file.
/// Checks for a custom path override in `settings.json` within the app data directory.
pub fn get_database_path() -> Result<PathBuf, String> {
    let proj_dirs = ProjectDirs::from("", "", "simple-pos").ok_or_else(|| {
        "No valid home directory path could be retrieved from the operating system.".to_string()
    })?;

    let data_dir = proj_dirs.data_dir();

    // Ensure the app data directory exists
    if !data_dir.exists() {
        fs::create_dir_all(data_dir).map_err(|e| format!("Error creating data directory: {}", e))?;
    }

    // Check for custom database path in settings
    if let Some(custom_path) = read_custom_db_storage_path(data_dir) {
        if !custom_path.exists() {
            fs::create_dir_all(&custom_path)
                .map_err(|e| format!("Error creating custom database directory: {}", e))?;
        }
        return Ok(custom_path.join("database.db"));
    }

    Ok(data_dir.join("database.db"))
}

/// Helper to extract the custom DB storage path from settings.json
fn read_custom_db_storage_path(data_dir: &Path) -> Option<PathBuf> {
    let settings_path = data_dir.join("settings.json");
    let content = fs::read_to_string(settings_path).ok()?;
    let json: serde_json::Value = serde_json::from_str(&content).ok()?;
    
    json.get("db_storage_path")
        .and_then(|v| v.as_str())
        .map(PathBuf::from)
}

/// Establishes a connection to the encrypted (or soon-to-be encrypted) database.
pub fn establish_connection(key: &str) -> Result<SqliteConnection, String> {
    if key.len() < 4 {
        return Err("Encryption key must be at least 4 characters long".to_string());
    }

    let database_url = get_database_url()?;
    let hex_key = hex::encode(key);

    // 1. Try to open the database as already encrypted
    let mut conn = open_connection(&database_url)?;
    apply_encryption_key(&mut conn, &hex_key)?;

    if is_database_accessible(&mut conn) {
        return Ok(conn);
    }

    // 2. If encrypted access failed, check if the database is currently unencrypted (fresh setup)
    // Note: We MUST open a new connection because SQLCipher locks the failed one into an error state.
    let mut conn = open_connection(&database_url)?;

    if is_database_accessible(&mut conn) {
        encrypt_database(&mut conn, &hex_key)?;
        return Ok(conn);
    }

    // 3. Both attempts failed (wrong key or file is corrupted)
    Err("Invalid encryption key or corrupted database".to_string())
}

fn get_database_url() -> Result<String, String> {
    get_database_path()?
        .to_str()
        .map(|s| s.to_string())
        .ok_or_else(|| "Database path contains invalid unicode".to_string())
}

fn open_connection(url: &str) -> Result<SqliteConnection, String> {
    SqliteConnection::establish(url).map_err(|_| "Failed to establish database connection".to_string())
}

fn apply_encryption_key(conn: &mut SqliteConnection, hex_key: &str) -> Result<(), String> {
    sql_query(format!("PRAGMA key = \"x'{}'\";", hex_key))
        .execute(conn)
        .map_err(|_| "Error setting encryption key".to_string())?;
    Ok(())
}

fn is_database_accessible(conn: &mut SqliteConnection) -> bool {
    // Attempting to read the master table schema table verifies if the key works
    sql_query("SELECT count(*) FROM sqlite_master;").execute(conn).is_ok()
}

fn encrypt_database(conn: &mut SqliteConnection, hex_key: &str) -> Result<(), String> {
    log::debug!("Database setup: initial encryption required.");
    
    // PRAGMA rekey sets the initial encryption key on an unencrypted database
    sql_query(format!("PRAGMA rekey = \"x'{}'\";", hex_key))
        .execute(conn)
        .map_err(|_| "Error encrypting database".to_string())?;

    // Verify encryption was successful
    if !is_database_accessible(conn) {
        return Err("Database verification failed after encryption".to_string());
    }
    
    Ok(())
}
