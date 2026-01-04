use database::{NewProduct, NewReceipt, product, receipt};
use diesel::prelude::*;
use diesel_migrations::{EmbeddedMigrations, MigrationHarness, embed_migrations};

// Point to the migrations folder relative to this file
pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("./migrations");

fn setup_test_db() -> SqliteConnection {
    let mut conn = SqliteConnection::establish(":memory:").expect("Error creating in-memory DB");

    conn.run_pending_migrations(MIGRATIONS).unwrap();
    conn
}

#[test]
fn test_create_and_find_product() {
    let mut conn = setup_test_db();

    // 1. Create
    let new_prod = NewProduct {
        title: "Test Coffee",
        catagory: "Drinks",
        satang: 10000, // Now works because we use i32, not &i32
    };
    // Now works because insert_product returns Result
    let saved_prod = product::insert_product(&mut conn, &new_prod).unwrap();

    assert_eq!(saved_prod.title, "Test Coffee");
    assert_eq!(saved_prod.satang, 10000);

    // 2. Find
    let found_prod = product::find_product(&mut conn, saved_prod.product_id).unwrap();
    assert_eq!(found_prod.product_id, saved_prod.product_id);
}

#[test]
fn test_receipt_flow() {
    let mut conn = setup_test_db();

    // Setup Product
    let prod = product::insert_product(
        &mut conn,
        &NewProduct {
            title: "Latte",
            catagory: "Coffee",
            satang: 5000,
        },
    )
    .unwrap();

    // Setup Header (Bill)
    let header = receipt::create_receipt_header(&mut conn, None).unwrap();

    // Add Item
    let new_item = NewReceipt {
        receipt_id: header.receipt_id,
        product_id: prod.product_id,
        quantity: 2,
    };
    let saved_item = receipt::add_item(&mut conn, &new_item).unwrap();

    // Verify
    assert_eq!(saved_item.quantity, 2);

    // Check Full Receipt
    let (h, items) = receipt::get_full_receipt(&mut conn, header.receipt_id).unwrap();
    assert_eq!(h.receipt_id, header.receipt_id);
    assert_eq!(items.len(), 1);
}
