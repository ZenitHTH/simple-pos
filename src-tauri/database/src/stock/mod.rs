//! Stock database operations.
//!
//! This module handles CRUD operations for product inventory and stock levels.

pub mod model;
pub mod schema;

use crate::stock::model::{NewStock, Stock};
use crate::stock::schema::stock as stock_schemata;
use diesel::prelude::*;
use diesel::result::Error;

/// Inserts a new stock record into the database and returns the created record.
pub fn insert_stock(conn: &mut SqliteConnection, new_stock: &NewStock) -> Result<Stock, Error> {
    diesel::insert_into(stock_schemata::table)
        .values(new_stock)
        .returning(Stock::as_returning())
        .get_result(conn)
}

/// Updates the quantity of a specific product in stock.
pub fn update_stock(
    conn: &mut SqliteConnection,
    target_product_id: i32,
    new_quantity: i32,
) -> Result<Stock, Error> {
    use stock_schemata::dsl::{product_id, quantity, stock as stock_dsl};

    // Find the row where product_id == target_product_id
    diesel::update(stock_dsl.filter(product_id.eq(target_product_id)))
        .set(quantity.eq(new_quantity))
        .returning(Stock::as_returning())
        .get_result(conn)
}

/// Deletes a stock record from the database by its ID.
pub fn remove_stock(conn: &mut SqliteConnection, stock_id: i32) -> Result<usize, Error> {
    diesel::delete(stock_schemata::dsl::stock.find(stock_id)).execute(conn)
}

/// Deletes a stock record from the database by its associated product ID.
pub fn remove_stock_by_product(conn: &mut SqliteConnection, target_product_id: i32) -> Result<usize, Error> {
    use stock_schemata::dsl::{product_id, stock as stock_dsl};
    diesel::delete(stock_dsl.filter(product_id.eq(target_product_id))).execute(conn)
}

/// Retrieves the stock record for a specific product.
pub fn get_stock(conn: &mut SqliteConnection, product_id_target: i32) -> Result<Stock, Error> {
    stock_schemata::table
        .filter(stock_schemata::product_id.eq(product_id_target))
        .first::<Stock>(conn)
}

/// Retrieves all stock records from the database.
pub fn get_all_stocks(conn: &mut SqliteConnection) -> Result<Vec<Stock>, Error> {
    stock_schemata::table.load::<Stock>(conn)
}

/// Synchronizes the product price stored in the stock record.
pub fn sync_product_price_in_stock(
    conn: &mut SqliteConnection,
    target_product_id: i32,
    new_price: i32,
) -> Result<usize, Error> {
    use stock_schemata::dsl::{product_id, satang, stock as stock_dsl};

    diesel::update(stock_dsl.filter(product_id.eq(target_product_id)))
        .set(satang.eq(new_price))
        .execute(conn)
}

/// Deducts a specified quantity from the stock of a product.
pub fn deduct_stock(
    conn: &mut SqliteConnection,
    product_id: i32,
    quantity_to_deduct: i32,
) -> Result<(), Error> {
    if let Ok(current_stock) = get_stock(conn, product_id) {
        let new_qty = current_stock.quantity - quantity_to_deduct;
        update_stock(conn, product_id, new_qty)?;
    }
    Ok(())
}
