use crate::schema::images;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Selectable, Debug, PartialEq, Serialize, Deserialize)]
#[diesel(table_name = images)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Image {
    pub id: i32,
    pub file_name: String,
    pub file_hash: String,
    pub file_path: String,
    pub created_at: NaiveDateTime,
    pub image_object_position: Option<String>,
}

#[derive(Insertable, Debug, PartialEq, Serialize, Deserialize)]
#[diesel(table_name = images)]
pub struct NewImage<'a> {
    pub file_name: &'a str,
    pub file_hash: &'a str,
    pub file_path: &'a str,
    pub image_object_position: Option<String>,
}
