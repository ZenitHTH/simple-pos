use crate::schema::product_images;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

/// Represents a link between a product and an image.
#[derive(Queryable, Selectable, Debug, PartialEq, Serialize, Deserialize)]
#[diesel(table_name = product_images)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct ProductImage {
    /// ID of the product.
    pub product_id: i32,
    /// ID of the image.
    pub image_id: i32,
}

/// Struct for inserting a new product-image link into the database.
#[derive(Insertable, Debug, PartialEq, Serialize, Deserialize)]
#[diesel(table_name = product_images)]
pub struct NewProductImage {
    /// Product ID for the link.
    pub product_id: i32,
    /// Image ID for the link.
    pub image_id: i32,
}
