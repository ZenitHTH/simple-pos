//! Product data models.
//!
//! This module defines the structs used to represent products in the database
//! and for data transfer between the backend and frontend.

use diesel::prelude::*;
use serde::Serialize;

/// Represents a product record from the database.
#[derive(Queryable, Selectable, Serialize, Debug, Clone)]
#[diesel(table_name = crate::schema::product)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Product {
    /// Unique identifier for the product.
    pub product_id: i32,
    /// Display name of the product.
    pub title: String,
    /// ID of the category this product belongs to.
    pub category_id: i32,
    /// Price in satang (1/100 of a THB).
    pub satang: i32,
    /// Whether to track stock using recipes instead of direct inventory.
    pub use_recipe_stock: bool,
}

/// Represents a product combined with its associated image data.
#[derive(Serialize, Debug, Clone)]
pub struct ProductWithImage {
    /// The base product data.
    #[serde(flatten)]
    pub product: Product,
    /// Optional path to the product's image file.
    pub image_path: Option<String>,
    /// Optional CSS object-position value for the image.
    pub image_object_position: Option<String>,
}

/// Data structure for inserting a new product into the database.
#[derive(Insertable)]
#[diesel(table_name = crate::schema::product)]
pub struct NewProduct<'a> {
    /// Display name of the product.
    pub title: &'a str,
    /// ID of the category this product belongs to.
    pub category_id: i32,
    /// Price in satang (1/100 of a THB).
    pub satang: i32,
    /// Whether to track stock using recipes instead of direct inventory.
    pub use_recipe_stock: bool,
}
