use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;

pub mod Product;
pub mod Stock;

use crate::Product::{model as product_model, schema as product_schema};
use crate::Stock::{model as stock_model, schema as stock_schema};

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

pub fn add(left: u64, right: u64) -> u64 {
    left + right
}
