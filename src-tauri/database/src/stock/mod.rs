pub mod model;
pub mod schema;

use crate::stock::model::{NewStock, Stock};
use crate::stock::schema::stock as stock_schemata;
use diesel::prelude::*;
use diesel::result::Error;

pub fn insert_stock(conn: &mut SqliteConnection, new_stock: &NewStock) {
    diesel::insert_into(stock_schemata::table)
        .values(new_stock)
        .returning(Stock::as_returning())
        .get_result(conn)
        .expect("Failed to insert stock");
}

pub fn update_stock(conn: &mut SqliteConnection, updated_stock: Stock) -> Result<Stock, Error> {
    use stock_schemata::dsl::{product_id, quantity, stock as stock_dsl, stock_id};
    diesel::update(stock_dsl.find(updated_stock.stock_id))
        .set((
            stock_id.eq(updated_stock.stock_id),
            product_id.eq(updated_stock.product_id),
            quantity.eq(updated_stock.quantity),
        ))
        .get_result(conn)
}

pub fn remove_stock(conn: &mut SqliteConnection, stock_id: i32) {
    diesel::delete(stock_schemata::dsl::stock.find(stock_id))
        .execute(conn)
        .expect("cannot find stock_id");
}

pub fn get_stock(conn: &mut SqliteConnection, stock_id: i32) -> Result<Vec<Stock>, Error> {
    return stock_schemata::table
        .filter(stock_schemata::stock_id.eq(stock_id))
        .load::<Stock>(conn);
}
