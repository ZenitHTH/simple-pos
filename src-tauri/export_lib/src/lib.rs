pub mod csv_export;
// pub mod ods_export;
pub mod xlsx_export;

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ExportData {
    pub receipt_id: i32,
    pub date: String,
    pub total: f64,
    // Add more fields as needed, keeping it simple for now
    // Ideally we export items too, so maybe a flat structure:
    pub product_name: String,
    pub quantity: i32,
    pub price: f64,
}
