use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Selectable, Insertable, AsChangeset, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = crate::schema::customer)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Customer {
    pub id: i32,
    pub name: String,
    pub tax_id: Option<String>,
    pub address: Option<String>,
    pub branch: String,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = crate::schema::customer)]
pub struct NewCustomer {
    pub name: String,
    pub tax_id: Option<String>,
    pub address: Option<String>,
    pub branch: Option<String>,
}
