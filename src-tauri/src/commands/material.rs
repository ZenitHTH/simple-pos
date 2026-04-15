use super::utils::float_to_scaled;
use database::establish_connection;
use database::material;
use database::{Material, NewMaterial};

/// Retrieves all material records from the database.
///
/// # Arguments
///
/// * `key` - The database encryption key.
///
/// # Returns
///
/// A list of all material records.
#[tauri::command]
pub fn get_materials(key: String) -> Result<Vec<Material>, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    material::get_all_materials(&mut conn).map_err(|e| e.to_string())
}

/// Creates a new material record with the specified details.
///
/// Validates input name and volume, scales the volume to an integer based on precision,
/// and inserts the new material into the database.
///
/// # Arguments
///
/// * `key` - The database encryption key.
/// * `name` - The name of the material.
/// * `type` - The category/type of the material.
/// * `volume` - The total volume of the material (f64).
/// * `quantity` - The initial stock quantity.
/// * `tags` - Optional tags for the material.
///
/// # Returns
///
/// The newly created material record.
#[tauri::command]
pub fn create_material(
    key: String,
    name: String,
    r#type: String,
    volume: f64,
    quantity: i32,
    tags: Vec<String>,
) -> Result<Material, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;

    let trimmed_name = name.trim();
    if trimmed_name.is_empty() {
        return Err("Material name cannot be empty.".to_string());
    }
    if volume <= 0.0 {
        return Err("Volume must be greater than zero.".to_string());
    }

    let (val, prec) = float_to_scaled(volume);

    let tags_json = if tags.is_empty() {
        None
    } else {
        Some(serde_json::to_string(&tags).map_err(|e| e.to_string())?)
    };

    let new_mat = NewMaterial {
        name: trimmed_name,
        type_: &r#type,
        volume: val,
        quantity,
        precision: prec,
        tags: tags_json.as_deref(),
    };
    material::insert_material(&mut conn, &new_mat).map_err(|e| e.to_string())
}

/// Updates an existing material's information.
///
/// Performs validation on name and volume, scales the new volume, and updates
/// the record in the database.
///
/// # Arguments
///
/// * `key` - The database encryption key.
/// * `id` - The ID of the material to update.
/// * `name` - The new name for the material.
/// * `type` - The new type for the material.
/// * `volume` - The new total volume for the material.
/// * `quantity` - The new stock quantity.
/// * `tags` - The new tags for the material.
///
/// # Returns
///
/// The updated material record.
#[tauri::command]
pub fn update_material(
    key: String,
    id: i32,
    name: String,
    r#type: String,
    volume: f64,
    quantity: i32,
    tags: Vec<String>,
) -> Result<Material, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;

    let trimmed_name = name.trim();
    if trimmed_name.is_empty() {
        return Err("Material name cannot be empty.".to_string());
    }
    if volume <= 0.0 {
        return Err("Volume must be greater than zero.".to_string());
    }

    let (val, prec) = float_to_scaled(volume);

    let tags_json = if tags.is_empty() {
        None
    } else {
        Some(serde_json::to_string(&tags).map_err(|e| e.to_string())?)
    };

    let mat = Material {
        id,
        name: trimmed_name.to_string(),
        type_: r#type,
        volume: val,
        quantity,
        precision: prec,
        tags: tags_json,
    };
    material::update_material(&mut conn, mat).map_err(|e| e.to_string())
}

/// Deletes a material record by its ID.
///
/// # Arguments
///
/// * `key` - The database encryption key.
/// * `id` - The ID of the material to delete.
///
/// # Returns
///
/// The number of deleted records.
#[tauri::command]
pub fn delete_material(key: String, id: i32) -> Result<usize, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    material::remove_material(&mut conn, id).map_err(|e| e.to_string())
}
