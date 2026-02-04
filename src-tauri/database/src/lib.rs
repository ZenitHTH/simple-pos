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

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").unwrap_or_else(|_| "database.db".to_string());

    SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}
