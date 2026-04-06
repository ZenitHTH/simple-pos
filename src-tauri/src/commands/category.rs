use database::category;
use database::establish_connection;
use database::{Category, NewCategory};

#[tauri::command]
pub fn get_categories(key: String) -> Result<Vec<Category>, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    category::get_all_categories(&mut conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_category(key: String, name: String) -> Result<Category, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;

    let trimmed_name = name.trim();
    if trimmed_name.is_empty() {
        return Err("Category name cannot be empty.".to_string());
    }
    if trimmed_name.len() > 100 {
        return Err("Category name is too long.".to_string());
    }

    if let Ok(Some(_)) = category::find_category_by_name(&mut conn, trimmed_name) {
        return Err("A category with this name already exists.".to_string());
    }

    let new_cat = NewCategory { name: trimmed_name };
    category::insert_category(&mut conn, &new_cat).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_category(key: String, id: i32, name: String) -> Result<Category, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;

    let trimmed_name = name.trim();
    if trimmed_name.is_empty() {
        return Err("Category name cannot be empty.".to_string());
    }
    if trimmed_name.len() > 100 {
        return Err("Category name is too long.".to_string());
    }

    if let Ok(Some(existing)) = category::find_category_by_name(&mut conn, trimmed_name) {
        if existing.id != id {
            return Err("Another category with this name already exists.".to_string());
        }
    }

    let cat = Category {
        id,
        name: trimmed_name.to_string(),
    };
    category::update_category(&mut conn, cat).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_category(key: String, id: i32) -> Result<usize, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    category::remove_category(&mut conn, id).map_err(|e| e.to_string())
}
