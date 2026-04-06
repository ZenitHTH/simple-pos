use database::establish_connection;
use database::run_migrations;

#[tauri::command]
pub fn initialize_database(key: String) -> Result<(), String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    run_migrations(&mut conn).map_err(|e| e.to_string())?;
    Ok(())
}
#[tauri::command]
pub fn check_database_exists(_app: tauri::AppHandle) -> Result<bool, String> {
    use database::get_database_path;
    let db_path = get_database_path().map_err(|e| e.to_string())?;
    Ok(db_path.exists())
}
