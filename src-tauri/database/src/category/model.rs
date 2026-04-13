//! Category data models.
//!
//! This module defines the structs used to represent product categories.

use super::schema::category;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

/// Represents a product category record from the database.
#[derive(Queryable, Selectable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = category)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Category {
    /// Unique identifier for the category.
    pub id: i32,
    /// Name of the category.
    pub name: String,
}

/// Data structure for inserting a new category into the database.
#[derive(Insertable, Deserialize)]
#[diesel(table_name = category)]
pub struct NewCategory<'a> {
    /// Name of the category.
    pub name: &'a str,
}
