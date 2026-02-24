pub mod model;
pub mod schema;

use crate::stock::model::{NewStock, Stock};
use crate::stock::schema::stock as stock_schemata;
use diesel::prelude::*;
use diesel::result::Error;

pub fn insert_stock(conn: &mut SqliteConnection, new_stock: &NewStock) -> Result<Stock, Error> {
    diesel::insert_into(stock_schemata::table)
        .values(new_stock)
        .returning(Stock::as_returning())
        .get_result(conn)
}

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

pub fn remove_stock(conn: &mut SqliteConnection, stock_id: i32) -> Result<usize, Error> {
    diesel::delete(stock_schemata::dsl::stock.find(stock_id)).execute(conn)
}

pub fn get_stock(conn: &mut SqliteConnection, product_id_target: i32) -> Result<Stock, Error> {
    stock_schemata::table
        .filter(stock_schemata::product_id.eq(product_id_target))
        .first::<Stock>(conn)
}

pub fn get_all_stocks(conn: &mut SqliteConnection) -> Result<Vec<Stock>, Error> {
    stock_schemata::table.load::<Stock>(conn)
}

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
