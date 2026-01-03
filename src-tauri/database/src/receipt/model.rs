use crate::receipt::schema::{receipt_item, receipt_list};
use chrono::NaiveDateTime;
use diesel::prelude::*;

// --- Receipt List (Header) ---
#[derive(Queryable, Selectable, Identifiable, Debug, Clone)]
#[diesel(table_name = receipt_list)]
#[diesel(primary_key(receipt_id))]
pub struct ReceiptList {
    pub receipt_id: i32,
    pub datetime_unix: i64,
}

impl ReceiptList {
    pub fn get_datetime(&self) -> Option<NaiveDateTime> {
        NaiveDateTime::from_timestamp_opt(self.datetime_unix, 0)
    }
}

#[derive(Insertable)]
#[diesel(table_name = receipt_list)]
pub struct NewReceiptList {
    pub datetime_unix: i64,
}

// --- Receipt (Items) ---
#[derive(Queryable, Selectable, Associations, Debug, Clone)]
#[diesel(table_name = receipt_item)]
#[diesel(belongs_to(ReceiptList, foreign_key = receipt_id))]
pub struct Receipt {
    pub id: i32,
    pub receipt_id: i32,
    pub product_id: i32,
    pub quantity: i32,
}

#[derive(Insertable)]
#[diesel(table_name = receipt_item)]
pub struct NewReceipt {
    pub receipt_id: i32,
    pub product_id: i32,
    pub quantity: i32,
}
