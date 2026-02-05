// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

//mod commands;
use app_lib::commands::{category, export, product, receipt};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            product::get_products,
            product::create_product,
            product::update_product,
            product::delete_product,
            category::get_categories,
            category::create_category,
            category::delete_category,
            receipt::create_invoice,
            receipt::add_invoice_item,
            receipt::get_invoice_detail,
            receipt::get_invoices_by_date,
            export::export_receipts
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
