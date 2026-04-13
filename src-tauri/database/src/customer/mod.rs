//! Customer database operations.
//!
//! This module handles CRUD operations for customer profiles, which are used
//! for recording sales and tax-related information (e.g., tax IDs for invoices).

pub mod model;

use crate::schema::customer::dsl::*;
use diesel::prelude::*;
pub use model::*;

/// Retrieves all customers from the database.
pub fn get_all_customers(conn: &mut SqliteConnection) -> QueryResult<Vec<Customer>> {
    customer.load::<Customer>(conn)
}

/// Inserts a new customer record into the database.
pub fn insert_customer(
    conn: &mut SqliteConnection,
    new_customer: &NewCustomer,
) -> QueryResult<Customer> {
    diesel::insert_into(customer)
        .values(new_customer)
        .returning(Customer::as_returning())
        .get_result(conn)
}

/// Updates an existing customer record by their ID.
///
/// If `update_data.branch` is not provided, it defaults to "00000" (Head Office).
pub fn update_customer_record(
    conn: &mut SqliteConnection,
    customer_id: i32,
    update_data: &NewCustomer,
) -> QueryResult<Customer> {
    diesel::update(customer.find(customer_id))
        .set((
            name.eq(&update_data.name),
            tax_id.eq(&update_data.tax_id),
            address.eq(&update_data.address),
            branch.eq(update_data.branch.as_deref().unwrap_or("00000")),
        ))
        .returning(Customer::as_returning())
        .get_result(conn)
}
