use diesel::prelude::*;

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::product)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Product {
    pub product_id: i32,
    pub title: String,
    pub catagory: String,
    pub satang: i32
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::product)]
pub struct NewProduct<'a> {
    pub title: &'a str,
    pub catagory: &'a str,
    pub satang: &'a i32
}

/*
Struct Product {
id:i32
Name:String
Category:String
Price Satang : i32
Quantity : i32 }

*/
