use super::utils::float_to_scaled;
use crate::conn;
use database::recipe;
use database::{NewRecipeItem, RecipeItem, RecipeList};

#[tauri::command]
pub fn create_recipe_list(key: String, product_id: i32) -> Result<RecipeList, String> {
    let mut conn = conn!(key);
    recipe::create_recipe_list(&mut conn, product_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_recipe_list_by_product(
    key: String,
    product_id: i32,
) -> Result<Option<RecipeList>, String> {
    let mut conn = conn!(key);
    recipe::get_recipe_list_by_product(&mut conn, product_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_recipe_list(key: String, list_id: i32) -> Result<usize, String> {
    let mut conn = conn!(key);
    recipe::delete_recipe_list(&mut conn, list_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn add_recipe_item(
    key: String,
    recipe_list_id: i32,
    material_id: i32,
    volume_use: f64,
    unit: String,
) -> Result<RecipeItem, String> {
    let mut conn = conn!(key);

    let (val, prec) = float_to_scaled(volume_use);

    let new_item = NewRecipeItem {
        recipe_list_id,
        material_id,
        volume_use: val,
        unit,
        volume_use_precision: prec,
    };
    recipe::add_recipe_item(&mut conn, &new_item).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_recipe_items(key: String, recipe_list_id: i32) -> Result<Vec<RecipeItem>, String> {
    let mut conn = conn!(key);
    recipe::get_items_by_recipe_list_id(&mut conn, recipe_list_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_recipe_item(
    key: String,
    item_id: i32,
    volume_use: f64,
    unit: String,
) -> Result<RecipeItem, String> {
    let mut conn = conn!(key);

    let (val, prec) = float_to_scaled(volume_use);

    recipe::update_recipe_item(&mut conn, item_id, val, unit, prec).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_recipe_item(key: String, item_id: i32) -> Result<usize, String> {
    let mut conn = conn!(key);
    recipe::remove_recipe_item(&mut conn, item_id).map_err(|e| e.to_string())
}
