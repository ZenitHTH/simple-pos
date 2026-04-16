//! This crate provides management for application settings, including
//! loading/saving from disk, data migrations, and storage path handling.

pub mod manager;
pub mod migration;
pub mod models;
pub mod paths;

pub use manager::{get_settings, get_storage_info, save_settings};
pub use migration::{migrate_flat_to_nested, SettingsFormat};
pub use models::*;
pub use paths::{get_settings_path, validate_path, validate_path_within};
