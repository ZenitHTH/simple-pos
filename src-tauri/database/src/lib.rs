//! The database crate for Vibe POS.
//!
//! This crate provides the data models, schema definitions, and database operations
//! for the application using Diesel ORM and SQLite (SQLCipher for encryption).
//! It is organized into modules for each domain entity (products, categories, etc.).

use diesel::prelude::*;
use diesel_migrations::{EmbeddedMigrations, MigrationHarness, embed_migrations};

/// Embedded database migrations for SQLite.
pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

/// Runs all pending database migrations.
pub fn run_migrations(
    connection: &mut SqliteConnection,
) -> Result<(), Box<dyn std::error::Error + Send + Sync + 'static>> {
    connection.run_pending_migrations(MIGRATIONS)?;
    Ok(())
}

pub mod category;
pub mod connection;
pub mod customer;
pub mod image;
pub mod material;
pub mod product;
pub mod product_image;
pub mod receipt;
pub mod recipe;
pub mod schema;
pub mod stock;

pub use category::model::{Category, NewCategory};
pub use connection::{establish_connection, get_database_path};
pub use customer::model::{Customer, NewCustomer};
pub use image::model::{Image, NewImage};
pub use image::{
    delete_image, get_image, get_image_by_hash, insert_image, update_image_path,
    update_image_position,
};
pub use material::model::{Material, NewMaterial};
pub use product::model::{NewProduct, Product};
pub use product_image::model::{NewProductImage, ProductImage};
pub use product_image::{
    get_linked_images, get_product_images, link_product_image, unlink_product_image,
};
pub use receipt::model::{
    NewReceipt, NewReceiptItemMaterial, NewReceiptList, Receipt, ReceiptItemMaterial, ReceiptList,
};
pub use recipe::model::{NewRecipeItem, NewRecipeList, RecipeItem, RecipeList};
pub use stock::model::{NewStock, Stock};
