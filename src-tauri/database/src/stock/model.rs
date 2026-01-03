/*
* Stock
   Primary ID :INT
   Product ID : Ref Product.Primary ID
   Quantity : INT
*/

use diesel::prelude::*;

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::stock::schema::stock)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Stock {
    pub stock_id: i32,
    pub product_id: i32,
    pub quantity: i32,
}

#[derive(Insertable)]
#[diesel(table_name = crate::stock::schema::stock)]
pub struct NewStock<'a> {
    pub product_id: &'a i32,
    pub quantity: &'a i32,
}
