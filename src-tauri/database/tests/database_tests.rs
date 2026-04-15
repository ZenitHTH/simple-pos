use database::*;
use diesel::prelude::*;

fn setup_test_db() -> SqliteConnection {
    let mut conn = SqliteConnection::establish(":memory:").unwrap();
    // Use a dummy key for sqlcipher in-memory
    diesel::sql_query("PRAGMA key = 'test_key';")
        .execute(&mut conn)
        .unwrap();
    run_migrations(&mut conn).expect("Failed to run migrations");
    conn
}

#[test]
fn test_category_operations() {
    let mut conn = setup_test_db();

    // Test insert
    let new_cat = NewCategory {
        name: "Test Category",
    };
    let inserted = database::category::insert_category(&mut conn, &new_cat).unwrap();
    assert_eq!(inserted.name, "Test Category");

    // Test get all
    let all = database::category::get_all_categories(&mut conn).unwrap();
    assert!(all.len() >= 1);
}

#[test]
fn test_product_operations() {
    let mut conn = setup_test_db();

    let cat =
        database::category::insert_category(&mut conn, &NewCategory { name: "Food" }).unwrap();

    // Test insert
    let new_prod = NewProduct {
        title: "Apple",
        category_id: cat.id,
        satang: 1500,
        use_recipe_stock: false,
    };
    let inserted = database::product::insert_product(&mut conn, &new_prod).unwrap();
    assert_eq!(inserted.title, "Apple");

    // Test get all
    let all = database::product::get_all_products(&mut conn).unwrap();
    assert_eq!(all.len(), 1);
}

#[test]
fn test_receipt_operations() {
    let mut conn = setup_test_db();

    let cat =
        database::category::insert_category(&mut conn, &NewCategory { name: "Food" }).unwrap();
    let prod = database::product::insert_product(
        &mut conn,
        &NewProduct {
            title: "Apple",
            category_id: cat.id,
            satang: 1500,
            use_recipe_stock: false,
        },
    )
    .unwrap();

    // Test header creation
    let header = database::receipt::create_receipt_header(&mut conn, None, None).unwrap();
    assert!(header.receipt_id > 0);

    // Test item addition
    let new_item = NewReceipt {
        receipt_id: header.receipt_id,
        product_id: prod.product_id,
        quantity: 2,
        satang_at_sale: prod.satang,
    };
    let item = database::receipt::add_item(&mut conn, &new_item).unwrap();
    assert_eq!(item.quantity, 2);

    // Test fetch items
    let items = database::receipt::get_items_by_header_id(&mut conn, header.receipt_id).unwrap();
    assert_eq!(items.len(), 1);
}

#[test]
fn test_material_operations() {
    let mut conn = setup_test_db();

    // Test insert
    let new_mat = NewMaterial {
        name: "Sugar",
        type_: "Ingredient",
        volume: 1000,
        quantity: 10,
        precision: 0,
        tags: None,
    };
    let inserted = database::material::insert_material(&mut conn, &new_mat).unwrap();
    assert_eq!(inserted.name, "Sugar");
}

#[test]
fn test_customer_operations() {
    let mut conn = setup_test_db();

    // Test insert
    let new_cust = NewCustomer {
        name: "John Doe".to_string(),
        tax_id: Some("1234567890123".to_string()),
        address: Some("123 Street".to_string()),
        branch: Some("00000".to_string()),
    };
    let inserted = database::customer::insert_customer(&mut conn, &new_cust).unwrap();
    assert_eq!(inserted.name, "John Doe");
}
