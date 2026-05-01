//! Stock data models.
//!
//! This module defines the structs used to track product inventory levels.

use diesel::prelude::*;
use serde::Serialize;

/// Represents a stock record in the database, tracking quantity and price (satang) for a product.
#[derive(Queryable, Selectable, Serialize, Debug, Clone)]
#[diesel(table_name = crate::stock::schema::stock)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Stock {
    /// Unique identifier for the stock record.
    pub stock_id: i32,
    /// ID of the product this stock record refers to.
    pub product_id: i32,
    /// Price in satang (at the time of stock entry or sync).
    pub satang: i32,
    /// Current quantity of the product in stock.
    pub quantity: i32,
}

/// Data structure for inserting a new stock record into the database.
#[derive(Insertable)]
#[diesel(table_name = crate::stock::schema::stock)]
pub struct NewStock {
    /// ID of the product.
    pub product_id: i32,
    /// Initial quantity of the product in stock.
    pub quantity: i32,
    /// Current price in satang.
    pub satang: i32,
}
