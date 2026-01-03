pub mod model;
pub mod schema;

use self::schema::{receipt_item, receipt_list};
use chrono::Utc; // Ensure you add `chrono` to your Cargo.toml
use diesel::prelude::*;
pub use model::*;

// --- Header Functions ---

pub fn create_receipt_header(
    conn: &mut SqliteConnection,
) -> Result<ReceiptList, diesel::result::Error> {
    let new_header = NewReceiptList {
        datetime_unix: Utc::now().timestamp(),
    };

    diesel::insert_into(receipt_list::table)
        .values(&new_header)
        .returning(ReceiptList::as_returning())
        .get_result(conn)
}

pub fn get_all_headers(
    conn: &mut SqliteConnection,
) -> Result<Vec<ReceiptList>, diesel::result::Error> {
    receipt_list::table.load::<ReceiptList>(conn)
}

// --- Item Functions ---

pub fn add_item(
    conn: &mut SqliteConnection,
    new_item: &NewReceipt,
) -> Result<Receipt, diesel::result::Error> {
    diesel::insert_into(receipt_item::table)
        .values(new_item)
        .returning(Receipt::as_returning())
        .get_result(conn)
}

pub fn get_items_by_header_id(
    conn: &mut SqliteConnection,
    header_id: i32,
) -> Result<Vec<Receipt>, diesel::result::Error> {
    receipt_item::table
        .filter(receipt_item::receipt_id.eq(header_id))
        .load::<Receipt>(conn)
}

// --- Search Functions ---

pub fn find_headers_by_date_range(
    conn: &mut SqliteConnection,
    start_unix: i64,
    end_unix: i64,
) -> Result<Vec<ReceiptList>, diesel::result::Error> {
    receipt_list::table
        .filter(receipt_list::datetime_unix.ge(start_unix))
        .filter(receipt_list::datetime_unix.le(end_unix))
        .order(receipt_list::datetime_unix.desc())
        .load::<ReceiptList>(conn)
}

pub fn get_full_receipt(
    conn: &mut SqliteConnection,
    header_id: i32,
) -> Result<(ReceiptList, Vec<Receipt>), diesel::result::Error> {
    let header = receipt_list::table
        .find(header_id)
        .first::<ReceiptList>(conn)?;
    let items = get_items_by_header_id(conn, header_id)?;
    Ok((header, items))
}
