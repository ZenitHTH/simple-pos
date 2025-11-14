use diesel::prelude::*;

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::posts)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Product {
    pub product_id: i32,
    pub title: String,
    pub catagory: String,
    pub satang: i32,
}

/*
Struct Product {
id:i32
Name:String
Category:String
Price Satang : i32 
Quantity : i32 }

*/