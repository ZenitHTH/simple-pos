//! Receipt data models.
//!
//! This module defines the structs used to represent receipts and their line items
//! in the database, capturing transaction history and material usage at the time of sale.

use crate::receipt::schema::{receipt_item, receipt_item_material, receipt_list};
use chrono::{DateTime, FixedOffset, NaiveDateTime};
use diesel::prelude::*;
use serde::Serialize;

/// Represents a receipt header, storing high-level transaction information.
#[derive(Queryable, Selectable, Serialize, Identifiable, Debug, Clone)]
#[diesel(table_name = receipt_list)]
#[diesel(primary_key(receipt_id))]
pub struct ReceiptList {
    /// Unique identifier for the receipt.
    pub receipt_id: i32,
    /// Unix timestamp when the transaction occurred.
    pub datetime_unix: i64,
    /// Optional ID of the customer associated with this transaction.
    pub customer_id: Option<i32>,
}

impl ReceiptList {
    /// Converts the stored Unix timestamp to a readable `NaiveDateTime`.
    ///
    /// The `offset_hours` parameter adjusts the timezone (e.g., 7 for ICT/Thailand).
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

/// Data structure for inserting a new receipt header into the database.
#[derive(Insertable)]
#[diesel(table_name = receipt_list)]
pub struct NewReceiptList {
    /// Unix timestamp for the new transaction.
    pub datetime_unix: i64,
    /// Optional customer ID for the new transaction.
    pub customer_id: Option<i32>,
}

/// Represents an individual item within a receipt.
#[derive(Queryable, Selectable, Serialize, Associations, Debug, Clone)]
#[diesel(table_name = receipt_item)]
#[diesel(belongs_to(ReceiptList, foreign_key = receipt_id))]
pub struct Receipt {
    /// Unique identifier for the receipt item record.
    pub id: i32,
    /// Reference to the parent receipt header.
    pub receipt_id: i32,
    /// ID of the product sold.
    pub product_id: i32,
    /// Quantity of the product sold.
    pub quantity: i32,
    /// Price of the product at the time of sale (in satang).
    pub satang_at_sale: i32,
}

/// Data structure for inserting a new item into a receipt.
#[derive(Insertable)]
#[diesel(table_name = receipt_item)]
pub struct NewReceipt {
    /// ID of the parent receipt header.
    pub receipt_id: i32,
    /// ID of the product being sold.
    pub product_id: i32,
    /// Quantity being sold.
    pub quantity: i32,
    /// Sale price at this moment (in satang).
    pub satang_at_sale: i32,
}

/// Records the historical material usage for a specific receipt item at the time of sale.
///
/// This snapshot ensures that even if a recipe changes later, the record of what was
/// actually consumed for this specific sale remains accurate.
#[derive(Queryable, Selectable, Serialize, Associations, Debug, Clone)]
#[diesel(table_name = receipt_item_material)]
#[diesel(belongs_to(Receipt, foreign_key = receipt_item_id))]
pub struct ReceiptItemMaterial {
    /// Unique identifier for this material usage record.
    pub id: i32,
    /// Reference to the specific receipt item this usage belongs to.
    pub receipt_item_id: i32,
    /// ID of the material consumed.
    pub material_id: i32,
    /// Amount of material used.
    pub volume_used: i32,
    /// Decimal precision for the volume used.
    pub precision: i32,
}

/// Data structure for inserting a new material usage record associated with a receipt item.
#[derive(Insertable)]
#[diesel(table_name = receipt_item_material)]
pub struct NewReceiptItemMaterial {
    /// ID of the associated receipt item.
    pub receipt_item_id: i32,
    /// ID of the material used.
    pub material_id: i32,
    /// Amount used.
    pub volume_used: i32,
    /// Precision for the amount.
    pub precision: i32,
}
