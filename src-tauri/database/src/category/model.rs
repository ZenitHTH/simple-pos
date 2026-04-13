use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use super::schema::category;

/// Represents a product category record from the database.
#[derive(Queryable, Selectable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = category)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Category {
    pub id: i32,
    pub name: String,
}

/// Data structure for inserting a new category into the database.
#[derive(Insertable, Deserialize)]
#[diesel(table_name = category)]
pub struct NewCategory<'a> {
    pub name: &'a str,
}
