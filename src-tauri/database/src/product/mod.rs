pub mod model;
pub mod schema;

use crate::model::{Product,NewProduct};
use crate::product::schema::product::product_id;
use crate::schema::product;
use diesel::prelude::*;

pub fn insert_product(conn:&mut SqliteConnection ,newprod: &NewProduct, quan: i32) {
    diesel::insert_into(product::table)
        .values(newprod)
        .returning(Product::as_returning())
        .get_result(conn)
        .expect("Error insert new product.");
}

pub fn remove_product(conn:&mut SqliteConnection, id: i32) {
    diesel::delete(product::dsl::product.find(id)).execute(conn).expect("Error deleting Product");
}

pub fn update_product(conn:&mut SqliteConnection, prod: Product) {
    use self::schema::product::dsl::{product as product_dsl,product_id,title,catagory,satang};
    
    let _ = diesel::update(product_dsl.find(prod.product_id)).set((
        product_id.eq(prod.product_id)  ,
        title.eq(prod.title),
        catagory.eq(prod.catagory),
        satang.eq(prod.satang)
    )).returning(Product::as_returning()).get_result(conn).unwrap();
}

pub fn find_product(conn:&mut SqliteConnection, id: i32) {}
