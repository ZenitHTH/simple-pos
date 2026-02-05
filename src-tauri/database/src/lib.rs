use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

pub fn run_migrations(connection: &mut SqliteConnection) -> Result<(), Box<dyn std::error::Error + Send + Sync + 'static>> {
    connection.run_pending_migrations(MIGRATIONS)?;
    Ok(())
}

pub mod product;
pub mod receipt;
pub mod stock;
pub mod category;

pub use product::model::{NewProduct, Product};
pub use receipt::model::{NewReceipt, NewReceiptList, Receipt, ReceiptList};
pub use stock::model::{NewStock, Stock};
pub use category::model::{NewCategory, Category};

use directories::ProjectDirs;
use std::fs;
use std::path::Path;

pub fn establish_connection() -> SqliteConnection {
    // Check if the DATABASE_URL environment variable is set
    // If set, use it (useful for development overrides)
    if let Ok(url) = env::var("DATABASE_URL") {
        return SqliteConnection::establish(&url)
            .unwrap_or_else(|_| panic!("Error connecting to {}", url));
    }

    // Otherwise, determine the system-standard data directory
    // Use "simple-pos" as the app name to match the product name
    let proj_dirs = ProjectDirs::from("", "", "simple-pos")
        .expect("No valid home directory path could be retrieved from the operating system.");
    
    let data_dir = proj_dirs.data_dir();
    
    // Ensure the directory exists
    if !data_dir.exists() {
        fs::create_dir_all(data_dir).expect("Error creating database directory");
    }
    
    let database_path = data_dir.join("database.db");
    let database_url = database_path.to_str().expect("Database path contains invalid unicode");

    SqliteConnection::establish(database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}
