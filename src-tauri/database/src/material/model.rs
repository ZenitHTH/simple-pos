use diesel::prelude::*;
use serde::Serialize;

/// Represents a raw material or ingredient record in the database.
#[derive(Queryable, Selectable, Serialize, Debug, Clone)]
#[diesel(table_name = crate::material::schema::material)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Material {
    /// Unique identifier for the material.
    pub id: i32,
    /// Name of the material.
    pub name: String,
    /// Type or category of the material.
    pub type_: String,
    /// Volume or weight per unit.
    pub volume: i32,
    /// Current quantity in stock.
    pub quantity: i32,
    /// Decimal precision for volume and quantity.
    pub precision: i32,
    /// Optional tags for categorization.
    pub tags: Option<String>,
}

/// Struct for inserting a new material record into the database.
#[derive(Insertable)]
#[diesel(table_name = crate::material::schema::material)]
pub struct NewMaterial<'a> {
    /// Material name.
    pub name: &'a str,
    /// Material type.
    pub type_: &'a str,
    /// Initial volume.
    pub volume: i32,
    /// Initial quantity.
    pub quantity: i32,
    /// Precision level.
    pub precision: i32,
    /// Optional tags.
    pub tags: Option<&'a str>,
}
