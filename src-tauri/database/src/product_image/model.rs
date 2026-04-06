use crate::schema::product_images;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Selectable, Debug, PartialEq, Serialize, Deserialize)]
#[diesel(table_name = product_images)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct ProductImage {
    pub product_id: i32,
    pub image_id: i32,
}

#[derive(Insertable, Debug, PartialEq, Serialize, Deserialize)]
#[diesel(table_name = product_images)]
pub struct NewProductImage {
    pub product_id: i32,
    pub image_id: i32,
}
