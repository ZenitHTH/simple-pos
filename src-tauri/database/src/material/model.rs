use diesel::prelude::*;
use serde::Serialize;

#[derive(Queryable, Selectable, Serialize, Debug, Clone)]
#[diesel(table_name = crate::material::schema::material)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Material {
    pub id: i32,
    pub name: String,
    pub type_: String,
    pub volume: i32,
    pub quantity: i32,
    pub precision: i32,
    pub tags: Option<String>,
}

#[derive(Insertable)]
#[diesel(table_name = crate::material::schema::material)]
pub struct NewMaterial<'a> {
    pub name: &'a str,
    pub type_: &'a str,
    pub volume: i32,
    pub quantity: i32,
    pub precision: i32,
    pub tags: Option<&'a str>,
}
