use super::utils::float_to_scaled;
use database::recipe;
use database::{NewRecipeItem, RecipeItem, RecipeList};

/// Creates a new recipe list for a specific product.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `product_id` - The ID of the product for which the recipe is being created.
///
/// # Returns
/// The newly created recipe list metadata.
#[tauri::command]
pub fn create_recipe_list(state: tauri::State<'_, crate::AppState>, product_id: i32) -> Result<RecipeList, String> {
    let mut conn = crate::conn!(state);
    recipe::create_recipe_list(&mut conn, product_id).map_err(|e| e.to_string())
}

/// Retrieves the recipe list associated with a specific product.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `product_id` - The ID of the product.
///
/// # Returns
/// An optional recipe list if one exists for the product.
#[tauri::command]
pub fn get_recipe_list_by_product(
    state: tauri::State<'_, crate::AppState>,
    product_id: i32,
) -> Result<Option<RecipeList>, String> {
    let mut conn = crate::conn!(state);
    recipe::get_recipe_list_by_product(&mut conn, product_id).map_err(|e| e.to_string())
}

/// Deletes a recipe list by its ID.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `list_id` - The ID of the recipe list to delete.
///
/// # Returns
/// The number of deleted records.
#[tauri::command]
pub fn delete_recipe_list(state: tauri::State<'_, crate::AppState>, list_id: i32) -> Result<usize, String> {
    let mut conn = crate::conn!(state);
    recipe::delete_recipe_list(&mut conn, list_id).map_err(|e| e.to_string())
}

/// Adds a new item (material) to a recipe list.
/// Scales the volume use based on the provided precision.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `recipe_list_id` - The ID of the recipe list.
/// * `material_id` - The ID of the material product being added.
/// * `volume_use` - The amount of material used.
/// * `unit` - The unit of measurement for the material.
///
/// # Returns
/// The newly added recipe item.
#[tauri::command]
pub fn add_recipe_item(
    state: tauri::State<'_, crate::AppState>,
    recipe_list_id: i32,
    material_id: i32,
    volume_use: f64,
    unit: String,
) -> Result<RecipeItem, String> {
    let mut conn = crate::conn!(state);

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

/// Retrieves all items belonging to a specific recipe list.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `recipe_list_id` - The ID of the recipe list.
///
/// # Returns
/// A list of all items in the specified recipe.
#[tauri::command]
pub fn get_recipe_items(state: tauri::State<'_, crate::AppState>, recipe_list_id: i32) -> Result<Vec<RecipeItem>, String> {
    let mut conn = crate::conn!(state);
    recipe::get_items_by_recipe_list_id(&mut conn, recipe_list_id).map_err(|e| e.to_string())
}

/// Updates an existing recipe item's volume use and unit.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `item_id` - The ID of the recipe item to update.
/// * `volume_use` - The new amount of material used.
/// * `unit` - The new unit of measurement.
///
/// # Returns
/// The updated recipe item.
#[tauri::command]
pub fn update_recipe_item(
    state: tauri::State<'_, crate::AppState>,
    item_id: i32,
    volume_use: f64,
    unit: String,
) -> Result<RecipeItem, String> {
    let mut conn = crate::conn!(state);

    let (val, prec) = float_to_scaled(volume_use);

    recipe::update_recipe_item(&mut conn, item_id, val, unit, prec).map_err(|e| e.to_string())
}

/// Deletes a recipe item by its ID.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `item_id` - The ID of the recipe item to delete.
///
/// # Returns
/// The number of deleted records.
#[tauri::command]
pub fn delete_recipe_item(state: tauri::State<'_, crate::AppState>, item_id: i32) -> Result<usize, String> {
    let mut conn = crate::conn!(state);
    recipe::remove_recipe_item(&mut conn, item_id).map_err(|e| e.to_string())
}
