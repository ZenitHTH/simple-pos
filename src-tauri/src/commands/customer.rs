use database::customer;
use database::establish_connection;
use database::{Customer, NewCustomer};

/// Retrieves all customer records from the database.
///
/// # Arguments
/// * `key` - The database encryption key.
///
/// # Returns
/// A list of all customer records.
#[tauri::command]
pub fn get_customers(key: String) -> Result<Vec<Customer>, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    customer::get_all_customers(&mut conn).map_err(|e| e.to_string())
}

/// Creates a new customer record.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `name` - The name of the customer.
/// * `tax_id` - Optional tax identification number.
/// * `address` - Optional physical address.
/// * `branch` - Optional branch name or number.
///
/// # Returns
/// The newly created customer record.
#[tauri::command]
pub fn create_customer(
    key: String,
    name: String,
    tax_id: Option<String>,
    address: Option<String>,
    branch: Option<String>,
) -> Result<Customer, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    let new_customer = NewCustomer {
        name,
        tax_id,
        address,
        branch,
    };
    customer::insert_customer(&mut conn, &new_customer).map_err(|e| e.to_string())
}

/// Updates an existing customer record.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `id` - The ID of the customer record to update.
/// * `name` - The new name for the customer.
/// * `tax_id` - Optional new tax identification number.
/// * `address` - Optional new address.
/// * `branch` - Optional new branch information.
///
/// # Returns
/// The updated customer record.
#[tauri::command]
pub fn update_customer(
    key: String,
    id: i32,
    name: String,
    tax_id: Option<String>,
    address: Option<String>,
    branch: Option<String>,
) -> Result<Customer, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    let update_data = NewCustomer {
        name,
        tax_id,
        address,
        branch,
    };
    customer::update_customer_record(&mut conn, id, &update_data).map_err(|e| e.to_string())
}
