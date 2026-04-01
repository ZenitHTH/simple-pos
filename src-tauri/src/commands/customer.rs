use database::customer;
use database::establish_connection;
use database::{Customer, NewCustomer};

#[tauri::command]
pub fn get_customers(key: String) -> Result<Vec<Customer>, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    customer::get_all_customers(&mut conn).map_err(|e| e.to_string())
}

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
