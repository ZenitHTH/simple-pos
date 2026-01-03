use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;

pub mod product;
pub mod receipt;
pub mod stock;

pub use product::model::{NewProduct, Product};
pub use receipt::model::{NewReceipt, NewReceiptList, Receipt, ReceiptList};
pub use stock::model::{NewStock, Stock};

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").unwrap_or_else(|_| "database.db".to_string());

    SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}
