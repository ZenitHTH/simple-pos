use diesel::prelude::*;
use directories::ProjectDirs;
use std::env;
use std::fs;

pub fn establish_connection() -> Result<SqliteConnection, String> {
    // Check if the DATABASE_URL environment variable is set
    // If set, use it (useful for development overrides)
    if let Ok(url) = env::var("DATABASE_URL") {
        return SqliteConnection::establish(&url)
            .map_err(|e| format!("Error connecting to {}: {}", url, e));
    }

    // Otherwise, determine the system-standard data directory
    // Use "simple-pos" as the app name to match the product name
    let proj_dirs = ProjectDirs::from("", "", "simple-pos").ok_or_else(|| {
        "No valid home directory path could be retrieved from the operating system.".to_string()
    })?;

    let data_dir = proj_dirs.data_dir();

    // Ensure the directory exists
    if !data_dir.exists() {
        fs::create_dir_all(data_dir)
            .map_err(|e| format!("Error creating database directory: {}", e))?;
    }

    let database_path = data_dir.join("database.db");
    let database_url = database_path
        .to_str()
        .ok_or_else(|| "Database path contains invalid unicode".to_string())?;

    SqliteConnection::establish(database_url)
        .map_err(|e| format!("Error connecting to {}: {}", database_url, e))
}
