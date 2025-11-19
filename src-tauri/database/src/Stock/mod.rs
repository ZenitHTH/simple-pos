pub mod model;
pub mod schema;

use crate::Stock::model::{NewStock, Stock};
use crate::Stock::schema::stock as stock_schema;
use diesel::prelude::*;
use diesel::result::Error;

pub fn insert_stock(conn: &mut SqliteConnection, new_stock: &NewStock) -> Result<Stock, Error> {
    diesel::insert_into(stock_schema)
        .values(&new_stock)
        .returning(Stock::as_returning())
        .get_result(conn)
        .expect("Failed to insert stock");
}

pub fn update_stock(conn: &mut SqliteConnection, updated_stock: Stock) -> Result<Stock, Error> {
    diesel::update(stock_schema.filter(id.eq(stock_id)))
        .set(updated_stock)
        .get_result(conn)
}

pub fn remove_stock(conn: &mut SqliteConnection, stock_id: i32) -> Result<usize, Error> {
    diesel::delete(stock_schema.filter(id.eq(stock_id))).execute(conn)
}

pub fn get_stock(conn: &mut SqliteConnection, stock_id: i32) -> Result<Stock, Error> {
    stock_schema.filter(id.eq(stock_id)).first(conn)
}
