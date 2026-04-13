use diesel::prelude::*;
use serde::Serialize;

/// Represents a product record from the database.
#[derive(Queryable, Selectable, Serialize, Debug, Clone)]
#[diesel(table_name = crate::schema::product)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Product {
    pub product_id: i32,
    pub title: String,
    pub category_id: i32,
    pub satang: i32,
    // Diesel or the underlying driver will map 0/1 to bool, keep this as a comment in the code
    pub use_recipe_stock: bool,
}

/// Represents a product combined with its associated image data.
#[derive(Serialize, Debug, Clone)]
pub struct ProductWithImage {
    #[serde(flatten)]
    pub product: Product,
    pub image_path: Option<String>,
    pub image_object_position: Option<String>,
}

/// Data structure for inserting a new product into the database.
#[derive(Insertable)]
#[diesel(table_name = crate::schema::product)]
pub struct NewProduct<'a> {
    pub title: &'a str,
    pub category_id: i32,
    pub satang: i32,
    pub use_recipe_stock: bool,
}

/*
Struct Product {
id:i32
Name:String
Category:String
Price Satang : i32
Quantity : i32 }

*/
