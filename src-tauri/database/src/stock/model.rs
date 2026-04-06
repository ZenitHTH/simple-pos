/*
* Stock
   Primary ID :INT
   Product ID : Ref Product.Primary ID
   Quantity : INT
*/

use diesel::prelude::*;
use serde::Serialize;

#[derive(Queryable, Selectable, Serialize, Debug, Clone)]
#[diesel(table_name = crate::stock::schema::stock)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Stock {
    pub stock_id: i32,
    pub product_id: i32,
    pub satang: i32,
    pub quantity: i32,
}

#[derive(Insertable)]
#[diesel(table_name = crate::stock::schema::stock)]
pub struct NewStock {
    pub product_id: i32,
    pub quantity: i32,
    pub satang: i32,
}
