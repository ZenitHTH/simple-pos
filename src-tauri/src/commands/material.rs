use super::utils::float_to_scaled;
use database::establish_connection;
use database::material;
use database::{Material, NewMaterial};

#[tauri::command]
pub fn get_materials(key: String) -> Result<Vec<Material>, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    material::get_all_materials(&mut conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_material(
    key: String,
    name: String,
    r#type: String,
    volume: f64,
    quantity: i32,
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

    let new_mat = NewMaterial {
        name: trimmed_name,
        type_: &r#type,
        volume: val,
        quantity,
        precision: prec,
    };
    material::insert_material(&mut conn, &new_mat).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_material(
    key: String,
    id: i32,
    name: String,
    r#type: String,
    volume: f64,
    quantity: i32,
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

    let mat = Material {
        id,
        name: trimmed_name.to_string(),
        type_: r#type,
        volume: val,
        quantity,
        precision: prec,
    };
    material::update_material(&mut conn, mat).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_material(key: String, id: i32) -> Result<usize, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    material::remove_material(&mut conn, id).map_err(|e| e.to_string())
}
