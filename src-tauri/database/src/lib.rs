use diesel::prelude::*;
use diesel_migrations::{EmbeddedMigrations, MigrationHarness, embed_migrations};

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

pub fn run_migrations(
    connection: &mut SqliteConnection,
) -> Result<(), Box<dyn std::error::Error + Send + Sync + 'static>> {
    connection.run_pending_migrations(MIGRATIONS)?;
    Ok(())
}

pub mod category;
pub mod connection;
pub mod product;
pub mod receipt;
pub mod stock;

pub use category::model::{Category, NewCategory};
pub use connection::establish_connection;
pub use product::model::{NewProduct, Product};
pub use receipt::model::{NewReceipt, NewReceiptList, Receipt, ReceiptList};
pub use stock::model::{NewStock, Stock};
