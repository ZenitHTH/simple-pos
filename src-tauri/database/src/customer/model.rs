use diesel::prelude::*;
use serde::{Deserialize, Serialize};

/// Represents a customer record in the database.
#[derive(Queryable, Selectable, Insertable, AsChangeset, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = crate::schema::customer)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Customer {
    /// Unique identifier for the customer.
    pub id: i32,
    /// Full name of the customer or company.
    pub name: String,
    /// Tax Identification Number (TIN).
    pub tax_id: Option<String>,
    /// Physical or billing address.
    pub address: Option<String>,
    /// Branch identifier (e.g., "00000" for head office).
    pub branch: String,
}

/// Struct for inserting a new customer record into the database.
#[derive(Insertable, Deserialize)]
#[diesel(table_name = crate::schema::customer)]
pub struct NewCustomer {
    /// Customer name.
    pub name: String,
    /// Optional tax ID.
    pub tax_id: Option<String>,
    /// Optional address.
    pub address: Option<String>,
    /// Optional branch identifier.
    pub branch: Option<String>,
}
