pub mod model;
pub mod schema;

use crate::model::{NewProduct, Product};
use crate::schema::product as product_schema;
use diesel::prelude::*;
use diesel::result::Error;

pub fn insert_product(conn: &mut SqliteConnection, newprod: &NewProduct) {
    diesel::insert_into(product_schema::table)
        .values(newprod)
        .returning(Product::as_returning())
        .get_result(conn)
        .expect("Error insert new product.");
}

pub fn remove_product(conn: &mut SqliteConnection, id: i32) {
    diesel::delete(product_schema::dsl::product.find(id))
        .execute(conn)
        .expect("Error deleting Product");
}

pub fn update_product(conn: &mut SqliteConnection, prod: Product) {
    use product_schema::dsl::{catagory, product as product_dsl, product_id, satang, title};

    let _ = diesel::update(product_dsl.find(prod.product_id))
        .set((
            product_id.eq(prod.product_id),
            title.eq(prod.title),
            catagory.eq(prod.catagory),
            satang.eq(prod.satang),
        ))
        .returning(Product::as_returning())
        .get_result(conn)
        .unwrap();
}

pub fn find_product(conn: &mut SqliteConnection, id: i32) -> Result<Vec<Product>, Error> {
    let prod: Vec<Product> = product_schema::table
        .select(product_schema::product_id.eq(id))
        .load::<Product>(conn)?;

    return prod;
}
