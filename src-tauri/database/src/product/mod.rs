pub mod model;
pub mod schema;

use crate::model::Product;
use crate::schema::product;
use diesel::prelude::*;

pub fn InsertProduct(newprod: &NewProduct, quan: i32) {
    diesel::insert_into(product::table)
        .value(&newprod)
        .returning(newprod::as_turning())
        .expect("Error insert new product.");
}

pub fn RemoveProduct(product_id: i32) {}

pub fn UpdateProduct(prod: Product) {}

pub fn FindProduct(product_id: i32) {}
