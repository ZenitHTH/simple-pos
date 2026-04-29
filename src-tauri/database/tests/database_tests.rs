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

#[test]
fn test_image_linking_exclusivity() {
    let mut conn = setup_test_db();

    let cat =
        database::category::insert_category(&mut conn, &NewCategory { name: "Food" }).unwrap();

    let prod1 = database::product::insert_product(
        &mut conn,
        &NewProduct {
            title: "Apple",
            category_id: cat.id,
            satang: 1500,
            use_recipe_stock: false,
        },
    )
    .unwrap();

    let prod2 = database::product::insert_product(
        &mut conn,
        &NewProduct {
            title: "Banana",
            category_id: cat.id,
            satang: 2000,
            use_recipe_stock: false,
        },
    )
    .unwrap();

    let img = database::image::insert_image(
        &mut conn,
        &NewImage {
            file_name: "img.png",
            file_path: "path/to/img.png",
            file_hash: "hash123",
            image_object_position: Some("center".to_string()),
        },
    )
    .unwrap();

    // Link to product 1
    database::product_image::link_product_image(&mut conn, prod1.product_id, img.id).unwrap();

    // Verify it is linked to product 1
    let link = database::product_image::get_image_link(&mut conn, img.id)
        .unwrap()
        .expect("Link should exist");
    assert_eq!(link.product_id, prod1.product_id);

    // Verify exclusivity: Simulate the command check for ALREADY_LINKED
    let existing_link = database::product_image::get_image_link(&mut conn, img.id).unwrap();
    assert!(existing_link.is_some());
    if let Some(link) = existing_link {
        let product = database::product::find_product(&mut conn, link.product_id).unwrap();
        assert_eq!(product.title, "Apple");
        // In the command, this would return Err("ALREADY_LINKED: Apple")
    }

    // Test move image (simulate move_product_image command transaction)
    conn.transaction::<_, diesel::result::Error, _>(|c| {
        database::product_image::unlink_image_from_all_products(c, img.id)?;
        database::product_image::link_product_image(c, prod2.product_id, img.id)?;
        Ok(())
    })
    .unwrap();

    let link2 = database::product_image::get_image_link(&mut conn, img.id)
        .unwrap()
        .expect("Link should exist");
    assert_eq!(link2.product_id, prod2.product_id);
}
