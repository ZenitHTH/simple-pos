//! Image data models.
//!
//! This module defines the structs used to represent images in the database.

use crate::schema::images;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

/// Represents an image record in the database.
#[derive(Queryable, Selectable, Debug, PartialEq, Serialize, Deserialize)]
#[diesel(table_name = images)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Image {
    /// Unique identifier for the image.
    pub id: i32,
    /// Original name of the image file.
    pub file_name: String,
    /// SHA-256 (or similar) hash of the file content to prevent duplicates.
    pub file_hash: String,
    /// Local file path where the image is stored.
    pub file_path: String,
    /// Timestamp when the image record was created.
    pub created_at: NaiveDateTime,
    /// Optional CSS object-position value (e.g., "center center", "top left").
    pub image_object_position: Option<String>,
}

/// Struct for inserting a new image record into the database.
#[derive(Insertable, Debug, PartialEq, Serialize, Deserialize)]
#[diesel(table_name = images)]
pub struct NewImage<'a> {
    /// Name of the image file.
    pub file_name: &'a str,
    /// Hash of the file content.
    pub file_hash: &'a str,
    /// Path where the file is saved.
    pub file_path: &'a str,
    /// Optional CSS object-position value.
    pub image_object_position: Option<String>,
}
