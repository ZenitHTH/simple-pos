use database::establish_connection;
use database::receipt;
use database::stock;
use database::{NewReceipt, Receipt, ReceiptList};
use diesel::Connection;

#[tauri::command]
pub fn create_invoice(key: String, customer_id: Option<i32>) -> Result<ReceiptList, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    // Create a new header with "Now" timestamp (None)
    receipt::create_receipt_header(&mut conn, None, customer_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn add_invoice_item(
    key: String,
    receipt_id: i32,
    product_id: i32,
    quantity: i32,
) -> Result<Receipt, String> {
    if quantity <= 0 || quantity > 1_000_000 {
        return Err("Invalid quantity.".to_string());
    }

    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;

    conn.transaction(|conn| {
        // Fetch product to get the current price (satang)
        use database::product;
        let product_info = product::find_product(conn, product_id)
            .map_err(|_| diesel::result::Error::RollbackTransaction)?;

        let item = NewReceipt {
            receipt_id,
            product_id,
            quantity,
            satang_at_sale: product_info.satang,
        };
        let saved_item = receipt::add_item(conn, &item)
            .map_err(|_| diesel::result::Error::RollbackTransaction)?;

        // Update stock
        if product_info.use_recipe_stock {
            use database::material;
            use database::recipe;

            if let Ok(Some(recipe_list)) = recipe::get_recipe_list_by_product(conn, product_id) {
                let recipe_items = recipe::get_items_by_recipe_list_id(conn, recipe_list.id)
                    .map_err(|_| diesel::result::Error::RollbackTransaction)?;

                for r_item in recipe_items {
                    if let Ok(mut mat) = material::find_material(conn, r_item.material_id) {
                        // Calculate total volume to deduct
                        // volume_use is scaled by volume_use_precision
                        let recipe_scaled_vol =
                            r_item.volume_use as f64 / 10f64.powi(r_item.volume_use_precision);
                        let total_deduction_vol = recipe_scaled_vol * (quantity as f64);

                        // mat.volume is scaled by mat.precision
                        let mat_unit_vol = mat.volume as f64 / 10f64.powi(mat.precision);

                        // Current total volume: unit_vol * quantity
                        let current_total_vol = mat_unit_vol * (mat.quantity as f64);
                        let new_total_vol = current_total_vol - total_deduction_vol;

                        // New quantity = new_total_vol / unit_vol
                        if mat_unit_vol > 0.0 {
                            mat.quantity = (new_total_vol / mat_unit_vol).round() as i32;
                        }

                        material::update_material(conn, mat)
                            .map_err(|_| diesel::result::Error::RollbackTransaction)?;
                    }
                }
            }
        } else {
            if let Ok(current_stock) = stock::get_stock(conn, product_id) {
                let new_qty = current_stock.quantity - quantity;
                stock::update_stock(conn, product_id, new_qty)
                    .map_err(|_| diesel::result::Error::RollbackTransaction)?;
            }
        }

        Ok(saved_item)
    })
    .map_err(|e: diesel::result::Error| e.to_string())
}

#[tauri::command]
pub fn get_invoice_detail(
    key: String,
    receipt_id: i32,
) -> Result<(ReceiptList, Vec<Receipt>), String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    receipt::get_full_receipt(&mut conn, receipt_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_invoices_by_date(
    key: String,
    start_unix: i64,
    end_unix: i64,
) -> Result<Vec<ReceiptList>, String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    receipt::find_headers_by_date_range(&mut conn, start_unix, end_unix).map_err(|e| e.to_string())
}
