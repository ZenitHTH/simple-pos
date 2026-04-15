use chrono::Utc;
use database::category::model::NewCategory;
use database::customer::model::NewCustomer;
use database::product::model::NewProduct;
use database::receipt::model::NewReceipt;
use database::run_migrations;
use diesel::prelude::*;
use std::fs;
use std::path::PathBuf;

fn main() -> Result<(), String> {
    println!("Starting simulation tool...");

    // 1. Establish an in-memory SQLite connection
    let mut conn = SqliteConnection::establish(":memory:").map_err(|e| e.to_string())?;

    // Set a dummy encryption key to simulate the real app's encrypted database
    diesel::sql_query("PRAGMA key = 'Runner01';")
        .execute(&mut conn)
        .map_err(|e| e.to_string())?;

    // 2. Run migrations
    run_migrations(&mut conn).map_err(|e| e.to_string())?;

    // 3. Populate fake data
    // Insert categories
    use database::category::insert_category;
    let cat1 = insert_category(&mut conn, &NewCategory { name: "Beverages" }).unwrap();

    // Insert products
    use database::product::insert_product;
    let prod1 = insert_product(
        &mut conn,
        &NewProduct {
            title: "Coffee",
            category_id: cat1.id,
            satang: 5000, // 50.00 THB
            use_recipe_stock: false,
        },
    )
    .unwrap();

    let prod2 = insert_product(
        &mut conn,
        &NewProduct {
            title: "Tea",
            category_id: cat1.id,
            satang: 4000, // 40.00 THB
            use_recipe_stock: false,
        },
    )
    .unwrap();

    // Insert customers
    use database::customer::insert_customer;
    let cust1 = insert_customer(
        &mut conn,
        &NewCustomer {
            name: "Test Company Co., Ltd.".to_string(),
            tax_id: Some("1234567890123".to_string()),
            address: Some("123 Test Street, Bangkok".to_string()),
            branch: Some("00000".to_string()),
        },
    )
    .unwrap();

    let cust2 = insert_customer(
        &mut conn,
        &NewCustomer {
            name: "John Doe".to_string(),
            tax_id: None,
            address: None,
            branch: None,
        },
    )
    .unwrap();

    // Insert receipts
    use database::receipt::{add_item, create_receipt_header};

    // Receipt 1 - Registered Customer
    let timestamp_1 = Utc::now().timestamp() - 86400; // Yesterday
    let r1 = create_receipt_header(&mut conn, Some(timestamp_1), Some(cust1.id)).unwrap();
    add_item(
        &mut conn,
        &NewReceipt {
            receipt_id: r1.receipt_id,
            product_id: prod1.product_id,
            quantity: 2,
            satang_at_sale: prod1.satang,
        },
    )
    .unwrap();

    // Receipt 2 - Unregistered Customer
    let timestamp_2 = Utc::now().timestamp() - 3600; // Today
    let r2 = create_receipt_header(&mut conn, Some(timestamp_2), Some(cust2.id)).unwrap();
    add_item(
        &mut conn,
        &NewReceipt {
            receipt_id: r2.receipt_id,
            product_id: prod2.product_id,
            quantity: 1,
            satang_at_sale: prod2.satang,
        },
    )
    .unwrap();

    // Receipt 3 - General Customer (null)
    let timestamp_3 = Utc::now().timestamp();
    let r3 = create_receipt_header(&mut conn, Some(timestamp_3), None).unwrap();
    add_item(
        &mut conn,
        &NewReceipt {
            receipt_id: r3.receipt_id,
            product_id: prod1.product_id,
            quantity: 1,
            satang_at_sale: prod1.satang,
        },
    )
    .unwrap();

    println!("Database populated successfully!");

    // 4. Generate Export
    use export_lib::thai_accounting::{TaxReportRow, build_thai_sales_tax_report};
    use export_lib::{CellValue, ExportTable, export_xlsx_sheets};

    // Fetch headers manually since we have an isolated script
    let headers: Vec<database::receipt::ReceiptList> =
        database::receipt::get_all_headers(&mut conn).unwrap();
    let customers = database::customer::get_all_customers(&mut conn).unwrap();
    let products = database::product::get_all_products(&mut conn).unwrap();
    // Build a product lookup map: product_id -> (title, satang)
    let product_map: std::collections::HashMap<i32, &database::product::model::Product> =
        products.iter().map(|p| (p.product_id, p)).collect();

    let vat_rate = 7.0; // Simulated VAT rate
    let mut report_rows = Vec::new();

    for header in headers {
        let items =
            database::receipt::get_items_by_header_id(&mut conn, header.receipt_id).unwrap();

        let date_str = chrono::DateTime::from_timestamp(header.datetime_unix, 0)
            .unwrap()
            .format("%d/%m/%Y")
            .to_string();

        let invoice_no = format!("INV-{:06}", header.receipt_id);

        let (customer_name, tax_id, branch_address) = if let Some(cid) = header.customer_id {
            if let Some(c) = customers.iter().find(|c| c.id == cid) {
                (
                    c.name.clone(),
                    c.tax_id.clone().unwrap_or_else(|| "-".to_string()),
                    c.address.clone().unwrap_or_else(|| "-".to_string()),
                )
            } else {
                ("ลูกค้าทั่วไป".to_string(), "-".to_string(), "-".to_string())
            }
        } else {
            ("ลูกค้าทั่วไป".to_string(), "-".to_string(), "-".to_string())
        };

        let mut grand_total = 0.0;
        for item in items {
            let price = item.satang_at_sale as f64 / 100.0;
            grand_total += price * item.quantity as f64;
        }

        let amount_before_vat = grand_total * 100.0 / (100.0 + vat_rate);
        let vat_amount = grand_total * vat_rate / (100.0 + vat_rate);

        report_rows.push(TaxReportRow {
            date: date_str,
            invoice_no,
            customer_name,
            tax_id,
            branch_address,
            amount_before_vat,
            vat_amount,
            grand_total,
        });
    }

    let tax_report_table = build_thai_sales_tax_report(report_rows);

    // ─── Sheet 2: Receipt Line Items ──────────────────────────────────────────
    let line_item_headers = vec![
        "Invoice No.".to_string(),
        "Date".to_string(),
        "Customer".to_string(),
        "Product".to_string(),
        "Qty".to_string(),
        "Price (THB)".to_string(),
        "Subtotal (THB)".to_string(),
    ];
    let mut line_items_table = ExportTable::new(line_item_headers);

    // Re-fetch all headers for the line-item sheet
    let all_headers = database::receipt::get_all_headers(&mut conn).unwrap();
    for header in &all_headers {
        let invoice_no = format!("INV-{:06}", header.receipt_id);
        let date_str = chrono::DateTime::from_timestamp(header.datetime_unix, 0)
            .unwrap()
            .format("%d/%m/%Y")
            .to_string();
        let customer_name = if let Some(cid) = header.customer_id {
            customers
                .iter()
                .find(|c| c.id == cid)
                .map(|c| c.name.clone())
                .unwrap_or_else(|| "ลูกค้าทั่วไป".to_string())
        } else {
            "ลูกค้าทั่วไป".to_string()
        };

        let items =
            database::receipt::get_items_by_header_id(&mut conn, header.receipt_id).unwrap();
        for item in items {
            let product_title = product_map
                .get(&item.product_id)
                .map(|p| p.title.clone())
                .unwrap_or_else(|| format!("Product #{}", item.product_id));
            let price = item.satang_at_sale as f64 / 100.0;
            let subtotal = price * item.quantity as f64;
            line_items_table.add_row(vec![
                CellValue::Text(invoice_no.clone()),
                CellValue::Text(date_str.clone()),
                CellValue::Text(customer_name.clone()),
                CellValue::Text(product_title),
                CellValue::Int(item.quantity as i64),
                CellValue::Number(price),
                CellValue::Number(subtotal),
            ]);
        }
    }

    // ─── Export ──────────────────────────────────────────────────────────────
    let export_dir = PathBuf::from("simulated_exports");
    if !export_dir.exists() {
        fs::create_dir(&export_dir).map_err(|e| e.to_string())?;
    }

    // CSV: tax report only
    let csv_path = export_dir.join("test_report.csv");
    tax_report_table
        .export_csv(&csv_path)
        .map_err(|e| e.to_string())?;

    // XLSX: two sheets
    let xlsx_path = export_dir.join("test_report.xlsx");
    export_xlsx_sheets(
        &[
            ("รายงานภาษีขาย", &tax_report_table),
            ("Receipt Line Items", &line_items_table),
        ],
        &xlsx_path,
    )
    .map_err(|e| e.to_string())?;

    println!(
        "Simulation exported successfully to: {:?}",
        fs::canonicalize(export_dir).map_err(|e| e.to_string())?
    );

    Ok(())
}
