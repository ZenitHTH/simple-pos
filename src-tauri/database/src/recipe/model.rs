//! Recipe data models.
//!
//! This module defines the structs used to represent product recipes, which link
//! products to a list of required materials and quantities.

use crate::recipe::schema::{recipe_item, recipe_list};
use diesel::prelude::*;
use serde::Serialize;

/// Represents a recipe header that links a product to a list of ingredients (RecipeItems).
#[derive(Queryable, Selectable, Serialize, Identifiable, Debug, Clone)]
#[diesel(table_name = recipe_list)]
pub struct RecipeList {
    /// Unique identifier for the recipe list.
    pub id: i32,
    /// ID of the product this recipe belongs to.
    pub product_id: i32,
}

/// Data structure for creating a new recipe list header.
#[derive(Insertable)]
#[diesel(table_name = recipe_list)]
pub struct NewRecipeList {
    /// ID of the product.
    pub product_id: i32,
}

/// Represents an individual ingredient or material within a recipe list.
#[derive(Queryable, Selectable, Serialize, Associations, Debug, Clone)]
#[diesel(table_name = recipe_item)]
#[diesel(belongs_to(RecipeList, foreign_key = recipe_list_id))]
pub struct RecipeItem {
    /// Unique identifier for the recipe item.
    pub id: i32,
    /// ID of the parent recipe list.
    pub recipe_list_id: i32,
    /// ID of the material required for this recipe item.
    pub material_id: i32,
    /// Quantity of the material used.
    pub volume_use: i32,
    /// Unit of measurement for the material (e.g., "g", "ml").
    pub unit: String,
    /// Precision/scale factor for the volume_use.
    pub volume_use_precision: i32,
}

/// Data structure for inserting a new item/ingredient into a recipe list.
#[derive(Insertable)]
#[diesel(table_name = recipe_item)]
pub struct NewRecipeItem {
    /// ID of the parent recipe list.
    pub recipe_list_id: i32,
    /// ID of the material.
    pub material_id: i32,
    /// Quantity used.
    pub volume_use: i32,
    /// Unit of measurement.
    pub unit: String,
    /// Precision/scale factor.
    pub volume_use_precision: i32,
}
