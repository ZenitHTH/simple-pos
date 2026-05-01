use database::product::model::ProductWithImage;
use database::run_migrations;
use database::{Category, Customer, Material, Stock};
use serde::Serialize;

#[derive(Serialize)]
pub struct ManagementData {
    pub products: Vec<ProductWithImage>,
    pub categories: Vec<Category>,
    pub customers: Vec<Customer>,
    pub materials: Vec<Material>,
    pub stocks: Vec<Stock>,
}

/// Retrieves all management data in a single atomic database operation.
/// Consolidates products, categories, customers, materials, and stocks to reduce IPC overhead.
#[tauri::command]
pub fn get_full_management_data(
    state: tauri::State<'_, crate::AppState>,
) -> Result<ManagementData, String> {
    let mut conn = crate::conn!(state);

    let products =
        database::product::get_all_products_with_images(&mut conn).map_err(|e| e.to_string())?;
    let categories =
        database::category::get_all_categories(&mut conn).map_err(|e| e.to_string())?;
    let customers = database::customer::get_all_customers(&mut conn).map_err(|e| e.to_string())?;
    let materials = database::material::get_all_materials(&mut conn).map_err(|e| e.to_string())?;
    let stocks = database::stock::get_all_stocks(&mut conn).map_err(|e| e.to_string())?;

    Ok(ManagementData {
        products,
        categories,
        customers,
        materials,
        stocks,
    })
}

/// Initializes the database using the provided encryption key.
/// Runs all pending database migrations.
///
/// # Arguments
/// * `key` - The database encryption key.
///
/// # Returns
/// An empty result on success.
#[tauri::command]
pub fn initialize_database(
    key: String,
    state: tauri::State<'_, crate::AppState>,
) -> Result<(), String> {
    // 1. First, verify the key using a single, non-pooled connection.
    // This prevents log flooding and crashes if the key is wrong.
    database::connection::verify_database_key(&key)?;

    // 2. If verified, create the authenticated connection pool.
    let pool = database::connection::create_pool(&key)?;

    // 3. Run any pending migrations to ensure schema is up-to-date.
    {
        let mut conn = pool.get().map_err(|e| e.to_string())?;
        run_migrations(&mut conn).map_err(|e| e.to_string())?;
    }

    // 4. Save the pool to application state.
    *state
        .pool
        .write()
        .map_err(|_| "Failed to lock pool state")? = Some(pool);
    Ok(())
}

/// Checks if the database file exists on disk.
///
/// # Arguments
/// * `_app` - The Tauri application handle (unused).
///
/// # Returns
/// True if the database file exists, false otherwise.
#[tauri::command]
pub fn check_database_exists(_app: tauri::AppHandle) -> Result<bool, String> {
    use database::get_database_path;
    let db_path = get_database_path().map_err(|e| e.to_string())?;
    Ok(db_path.exists())
}

/// Clears the authenticated database connection pool.
/// This ensures that the database is no longer accessible after logout.
#[tauri::command]
pub fn logout_database(state: tauri::State<'_, crate::AppState>) -> Result<(), String> {
    *state
        .pool
        .write()
        .map_err(|_| "Failed to lock pool state")? = None;
    Ok(())
}
