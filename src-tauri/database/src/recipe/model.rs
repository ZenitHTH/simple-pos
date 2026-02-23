use crate::recipe::schema::{recipe_item, recipe_list};
use diesel::prelude::*;
use serde::Serialize;

#[derive(Queryable, Selectable, Serialize, Identifiable, Debug, Clone)]
#[diesel(table_name = recipe_list)]
pub struct RecipeList {
    pub id: i32,
    pub product_id: i32,
}

#[derive(Insertable)]
#[diesel(table_name = recipe_list)]
pub struct NewRecipeList {
    pub product_id: i32,
}

#[derive(Queryable, Selectable, Serialize, Associations, Debug, Clone)]
#[diesel(table_name = recipe_item)]
#[diesel(belongs_to(RecipeList, foreign_key = recipe_list_id))]
pub struct RecipeItem {
    pub id: i32,
    pub recipe_list_id: i32,
    pub material_id: i32,
    pub volume_use: i32,
    pub unit: String,
    pub volume_use_precision: i32,
}

#[derive(Insertable)]
#[diesel(table_name = recipe_item)]
pub struct NewRecipeItem {
    pub recipe_list_id: i32,
    pub material_id: i32,
    pub volume_use: i32,
    pub unit: String,
    pub volume_use_precision: i32,
}
