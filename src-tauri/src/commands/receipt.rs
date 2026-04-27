use database::receipt;
use database::stock;
use database::{NewReceipt, Receipt, ReceiptList};
use diesel::Connection;
use serde::Serialize;

/// Represents an accumulated report of products and materials sold within a date range.
#[derive(Serialize)]
pub struct AccumulatedReport {
    pub products: Vec<ProductAccumulation>,
    pub materials: Vec<MaterialAccumulation>,
}

/// Represents the total quantity of a specific product sold.
#[derive(Serialize)]
pub struct ProductAccumulation {
    pub product_id: i32,
    pub title: String,
    pub total_quantity: i64,
}

/// Represents the total volume of a specific material used in products sold.
#[derive(Serialize)]
pub struct MaterialAccumulation {
    pub material_id: i32,
    pub name: String,
    pub total_volume_used: i64,
    pub precision: i32,
}

/// Creates a new receipt header, adds all items, and deducts stock in a single atomic transaction.
/// This reduces IPC overhead and ensures database consistency during the checkout process.
///
/// # Arguments
/// * `state` - The Tauri application state containing the database connection pool.
/// * `customer_id` - The ID of the customer associated with the receipt, if any.
/// * `items` - A list of product IDs and their respective quantities to be purchased.
///
/// # Returns
/// The newly created receipt header on success, or an error message on failure.
#[tauri::command]
pub async fn complete_checkout(
    state: tauri::State<'_, crate::AppState>,
    customer_id: Option<i32>,
    items: Vec<(i32, i32)>, // Vec<(product_id, quantity)>
) -> Result<ReceiptList, String> {
    let pool_lock = state.pool.read().map_err(|_| "Failed to read pool state")?;
    let pool = pool_lock.as_ref().ok_or("Database not initialized")?;
    let mut conn = pool.get().map_err(|e| e.to_string())?;

    conn.transaction(|conn| {
        use database::product;
        use database::recipe;

        // 1. Create Receipt Header
        let receipt_header = receipt::create_receipt_header(conn, None, customer_id)
            .map_err(|_e| diesel::result::Error::RollbackTransaction)?;
        let receipt_id = receipt_header.receipt_id;

        // 2. Add Items and Deduct Stock
        for (product_id, quantity) in items {
            // Validate quantity
            if quantity <= 0 || quantity > 10_000 {
                return Err(diesel::result::Error::RollbackTransaction);
            }

            // Fetch product info to get price and stock mode
            let product_info = product::find_product(conn, product_id)
                .map_err(|_| diesel::result::Error::RollbackTransaction)?;

            // Record item in the receipt
            let item = NewReceipt {
                receipt_id,
                product_id,
                quantity,
                satang_at_sale: product_info.satang,
            };
            let saved_item = receipt::add_item(conn, &item)
                .map_err(|_| diesel::result::Error::RollbackTransaction)?;

            // Deduct stock levels (handle recipe-based or direct stock)
            if product_info.use_recipe_stock {
                recipe::deduct_stock_from_recipe(conn, product_id, quantity, saved_item.id)
                    .map_err(|_| diesel::result::Error::RollbackTransaction)?;
            } else {
                stock::deduct_stock(conn, product_id, quantity)
                    .map_err(|_| diesel::result::Error::RollbackTransaction)?;
            }
        }

        Ok(receipt_header)
    })
    .map_err(|e| e.to_string())
}

/// Creates a new invoice (receipt header) for an optional customer.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `customer_id` - The ID of the customer associated with the invoice, if any.
///
/// # Returns
/// The newly created invoice header metadata.
#[tauri::command]
pub fn create_invoice(state: tauri::State<'_, crate::AppState>, customer_id: Option<i32>) -> Result<ReceiptList, String> {
    let mut conn = crate::conn!(state);
    // Create a new header with "Now" timestamp (None)
    receipt::create_receipt_header(&mut conn, None, customer_id).map_err(|e| e.to_string())
}

/// Adds items to an existing invoice and updates stock levels accordingly.
/// Supports both direct product stock and recipe-based material stock.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `receipt_id` - The ID of the invoice header.
/// * `items` - A list of product IDs and their respective quantities.
///
/// # Returns
/// An empty result on success.
#[tauri::command]
pub fn add_invoice_items(
    state: tauri::State<'_, crate::AppState>,
    receipt_id: i32,
    items: Vec<(i32, i32)>, // Vec<(product_id, quantity)>
) -> Result<(), String> {
    let mut conn = crate::conn!(state);

    conn.transaction(|conn| {
        use database::product;
        use database::recipe;

        for (product_id, quantity) in items {
            if quantity <= 0 || quantity > 10_000 {
                return Err(diesel::result::Error::RollbackTransaction);
            }

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
                recipe::deduct_stock_from_recipe(conn, product_id, quantity, saved_item.id)
                    .map_err(|_| diesel::result::Error::RollbackTransaction)?;
            } else {
                stock::deduct_stock(conn, product_id, quantity)
                    .map_err(|_| diesel::result::Error::RollbackTransaction)?;
            }
        }
        Ok(())
    })
    .map_err(|e| e.to_string())
}

/// Retrieves the header and all items for a specific invoice.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `receipt_id` - The ID of the invoice.
///
/// # Returns
/// A tuple containing the invoice header and a list of items in the invoice.
#[tauri::command]
pub fn get_invoice_detail(
    state: tauri::State<'_, crate::AppState>,
    receipt_id: i32,
) -> Result<(ReceiptList, Vec<Receipt>), String> {
    let mut conn = crate::conn!(state);
    receipt::get_full_receipt(&mut conn, receipt_id).map_err(|e| e.to_string())
}

/// Retrieves all invoices created within a specific Unix timestamp range.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `start_unix` - The start of the date range in Unix seconds.
/// * `end_unix` - The end of the date range in Unix seconds.
///
/// # Returns
/// A list of invoice headers within the specified date range.
#[tauri::command]
pub fn get_invoices_by_date(
    state: tauri::State<'_, crate::AppState>,
    start_unix: i64,
    end_unix: i64,
) -> Result<Vec<ReceiptList>, String> {
    let mut conn = crate::conn!(state);
    receipt::find_headers_by_date_range(&mut conn, start_unix, end_unix).map_err(|e| e.to_string())
}

/// Generates an accumulated report of products and materials sold within a date range.
///
/// # Arguments
/// * `key` - The database encryption key.
/// * `start_unix` - The start of the date range in Unix seconds.
/// * `end_unix` - The end of the date range in Unix seconds.
///
/// # Returns
/// An accumulated report containing summarized product sales and material usage.
#[tauri::command]
pub fn get_accumulated_report(
    state: tauri::State<'_, crate::AppState>,
    start_unix: i64,
    end_unix: i64,
) -> Result<AccumulatedReport, String> {
    use database::schema::{material, product, receipt_item, receipt_item_material, receipt_list};
    use diesel::prelude::*;

    let mut conn = crate::conn!(state);

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
