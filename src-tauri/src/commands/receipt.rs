use database::establish_connection;
use database::receipt;
use database::stock;
use database::{NewReceipt, Receipt, ReceiptList};
use diesel::Connection;
use serde::Serialize;

#[derive(Serialize)]
pub struct AccumulatedReport {
    pub products: Vec<ProductAccumulation>,
    pub materials: Vec<MaterialAccumulation>,
}

#[derive(Serialize)]
pub struct ProductAccumulation {
    pub product_id: i32,
    pub title: String,
    pub total_quantity: i64,
}

#[derive(Serialize)]
pub struct MaterialAccumulation {
    pub material_id: i32,
    pub name: String,
    pub total_volume_used: i64,
    pub precision: i32,
}

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
    if quantity <= 0 || quantity > 10_000 {
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
                        // Calculate total volume to deduct using integer arithmetic to maintain precision
                        // volume_use is significand, quantity is integer.
                        let total_deduction_scaled = (r_item.volume_use as i64) * (quantity as i64);

                        // Align precisions
                        // mat.volume is scaled by mat.precision
                        // total_deduction_scaled is scaled by r_item.volume_use_precision
                        let deduction_aligned = if mat.precision >= r_item.volume_use_precision {
                            total_deduction_scaled * 10i64.pow((mat.precision - r_item.volume_use_precision) as u32)
                        } else {
                            total_deduction_scaled / 10i64.pow((r_item.volume_use_precision - mat.precision) as u32)
                        };

                        // Current total volume: mat.volume * mat.quantity
                        let current_total_vol_scaled = (mat.volume as i64) * (mat.quantity as i64);
                        let new_total_vol_scaled = current_total_vol_scaled - deduction_aligned;

                        // New quantity = new_total_vol_scaled / mat.volume
                        if mat.volume > 0 {
                            mat.quantity = (new_total_vol_scaled / mat.volume as i64) as i32;
                        }

                        material::update_material(conn, mat.clone())
                            .map_err(|_| diesel::result::Error::RollbackTransaction)?;

                        // Record historical usage
                        let hist_item = database::NewReceiptItemMaterial {
                            receipt_item_id: saved_item.id,
                            material_id: r_item.material_id,
                            volume_used: total_deduction_scaled as i32,
                            precision: r_item.volume_use_precision,
                        };
                        receipt::add_item_material(conn, &hist_item)
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

#[tauri::command]
pub fn get_accumulated_report(
    key: String,
    start_unix: i64,
    end_unix: i64,
) -> Result<AccumulatedReport, String> {
    use database::schema::{material, product, receipt_item, receipt_item_material, receipt_list};
    use diesel::prelude::*;

    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;

    // 1. Get products accumulation using SQL aggregation
    let product_stats = receipt_list::table
        .inner_join(receipt_item::table.on(receipt_item::receipt_id.eq(receipt_list::receipt_id)))
        .inner_join(product::table.on(product::product_id.eq(receipt_item::product_id)))
        .filter(receipt_list::datetime_unix.ge(start_unix))
        .filter(receipt_list::datetime_unix.le(end_unix))
        .group_by((product::product_id, product::title))
        .select((
            product::product_id,
            product::title,
            diesel::dsl::sum(receipt_item::quantity),
        ))
        .load::<(i32, String, Option<i64>)>(&mut conn)
        .map_err(|e| e.to_string())?
        .into_iter()
        .map(|(id, title, qty)| ProductAccumulation {
            product_id: id,
            title,
            total_quantity: qty.unwrap_or(0),
        })
        .collect::<Vec<_>>();

    // 2. Get materials accumulation using SQL aggregation
    let material_stats = receipt_list::table
        .inner_join(receipt_item::table.on(receipt_item::receipt_id.eq(receipt_list::receipt_id)))
        .inner_join(
            receipt_item_material::table
                .on(receipt_item_material::receipt_item_id.eq(receipt_item::id)),
        )
        .inner_join(material::table.on(material::id.eq(receipt_item_material::material_id)))
        .filter(receipt_list::datetime_unix.ge(start_unix))
        .filter(receipt_list::datetime_unix.le(end_unix))
        .group_by((material::id, material::name, receipt_item_material::precision))
        .select((
            material::id,
            material::name,
            diesel::dsl::sum(receipt_item_material::volume_used),
            receipt_item_material::precision,
        ))
        .load::<(i32, String, Option<i64>, i32)>(&mut conn)
        .map_err(|e| e.to_string())?
        .into_iter()
        .map(|(id, name, vol, prec)| MaterialAccumulation {
            material_id: id,
            name,
            total_volume_used: vol.unwrap_or(0),
            precision: prec,
        })
        .collect::<Vec<_>>();

    Ok(AccumulatedReport {
        products: product_stats,
        materials: material_stats,
    })
}
