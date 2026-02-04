use database::establish_connection;
use database::category;
use database::{NewCategory, Category};

#[tauri::command]
pub fn get_categories() -> Result<Vec<Category>, String> {
    let mut conn = establish_connection();
    return category::get_all_categories(&mut conn).map_err(|e| e.to_string());
}

#[tauri::command]
pub fn create_category(name: String) -> Result<Category, String> {
    let mut conn = establish_connection();
    let new_cat = NewCategory {
        name: &name,
    };
    category::insert_category(&mut conn, &new_cat).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_category(id: i32, name: String) -> Result<Category, String> {
    let mut conn = establish_connection();
    let cat = Category {
        id,
        name,
    };
    category::update_category(&mut conn, cat).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_category(id: i32) -> Result<usize, String> {
    let mut conn = establish_connection();
    category::remove_category(&mut conn, id).map_err(|e| e.to_string())
}
