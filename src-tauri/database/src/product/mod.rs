pub mod model;
pub mod schema;

use crate::model::{Product,NewProduct};
use crate::schema::product;
use diesel::prelude::*;

pub fn InsertProduct(conn:&mut SqliteConnection ,newprod: &NewProduct, quan: i32) {
    diesel::insert_into(product::table)
        .values(newprod)
        .returning(Product::as_returning())
        .get_result(conn)
        .expect("Error insert new product.");
}

pub fn RemoveProduct(conn:&mut SqliteConnection, id: i32) {
    diesel::delete(product::dsl::product.find(id)).execute(conn).expect("Error deleting Product");
}

pub fn UpdateProduct(conn:&mut SqliteConnection, prod: Product) {}

pub fn FindProduct(conn:&mut SqliteConnection, id: i32) {}
