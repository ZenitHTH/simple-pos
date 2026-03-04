use crate::receipt::schema::{receipt_item, receipt_item_material, receipt_list};
use chrono::{DateTime, FixedOffset, NaiveDateTime};
use diesel::prelude::*;
use serde::Serialize;
// --- Receipt List (Header) ---
#[derive(Queryable, Selectable, Serialize, Identifiable, Debug, Clone)]
#[diesel(table_name = receipt_list)]
#[diesel(primary_key(receipt_id))]
pub struct ReceiptList {
    pub receipt_id: i32,
    pub datetime_unix: i64,
    pub customer_id: Option<i32>,
}

impl ReceiptList {
    /// Convert the stored Unix timestamp to a readable Date
    /// Pass `offset_hours` to adjust the timezone (e.g., 7 for Thailand)
    pub fn get_datetime(&self, offset_hours: i32) -> Option<NaiveDateTime> {
        // 1. Create the timezone offset (hours * 3600 seconds)
        // .unwrap() is safe here because 7 * 3600 is a valid offset
        let offset =
            FixedOffset::east_opt(offset_hours * 3600).unwrap_or(FixedOffset::east_opt(0).unwrap());

        // 2. Convert Unix Timestamp -> UTC DateTime -> Local DateTime -> NaiveDateTime
        DateTime::from_timestamp(self.datetime_unix, 0)
            .map(|utc_dt| utc_dt.with_timezone(&offset).naive_local())
    }
}

#[derive(Insertable)]
#[diesel(table_name = receipt_list)]
pub struct NewReceiptList {
    pub datetime_unix: i64,
    pub customer_id: Option<i32>,
}

// --- Receipt (Items) ---
#[derive(Queryable, Selectable, Serialize, Associations, Debug, Clone)]
#[diesel(table_name = receipt_item)]
#[diesel(belongs_to(ReceiptList, foreign_key = receipt_id))]
pub struct Receipt {
    pub id: i32,
    pub receipt_id: i32,
    pub product_id: i32,
    pub quantity: i32,
    pub satang_at_sale: i32,
}

#[derive(Insertable)]
#[diesel(table_name = receipt_item)]
pub struct NewReceipt {
    pub receipt_id: i32,
    pub product_id: i32,
    pub quantity: i32,
    pub satang_at_sale: i32,
}

// --- Receipt Item Material (Historical usage) ---
#[derive(Queryable, Selectable, Serialize, Associations, Debug, Clone)]
#[diesel(table_name = receipt_item_material)]
#[diesel(belongs_to(Receipt, foreign_key = receipt_item_id))]
pub struct ReceiptItemMaterial {
    pub id: i32,
    pub receipt_item_id: i32,
    pub material_id: i32,
    pub volume_used: i32,
    pub precision: i32,
}

#[derive(Insertable)]
#[diesel(table_name = receipt_item_material)]
pub struct NewReceiptItemMaterial {
    pub receipt_item_id: i32,
    pub material_id: i32,
    pub volume_used: i32,
    pub precision: i32,
}
