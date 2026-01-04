pub mod model;
pub mod schema;

use crate::product::model::{NewProduct, Product};
use crate::product::schema::product as product_schema;
use diesel::prelude::*;
use diesel::result::Error;

// FIX: Return Result<Product, Error> instead of ()
pub fn insert_product(conn: &mut SqliteConnection, newprod: &NewProduct) -> Result<Product, Error> {
    diesel::insert_into(product_schema::table)
        .values(newprod)
        .returning(Product::as_returning())
        .get_result(conn)
    // FIX: Removed .expect(), letting the caller handle the error
}

pub fn remove_product(conn: &mut SqliteConnection, id: i32) -> Result<usize, Error> {
    diesel::delete(product_schema::dsl::product.find(id)).execute(conn)
}

pub fn update_product(conn: &mut SqliteConnection, prod: Product) -> Result<Product, Error> {
    use product_schema::dsl::{catagory, product as product_dsl, product_id, satang, title};

    diesel::update(product_dsl.find(prod.product_id))
        .set((
            product_id.eq(prod.product_id),
            title.eq(prod.title),
            catagory.eq(prod.catagory),
            satang.eq(prod.satang),
        ))
        .returning(Product::as_returning())
        .get_result(conn)
}

pub fn find_product(conn: &mut SqliteConnection, id: i32) -> Result<Product, Error> {
    // FIX: Use .first() to get one Product, not a Vec
    product_schema::table.find(id).first(conn)
}
