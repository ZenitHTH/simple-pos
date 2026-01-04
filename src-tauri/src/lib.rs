// 1. Declare the commands module
pub mod commands;

// 2. Import everything you need for the run function
use commands::product::*;
use commands::receipt::*;
use commands::stock::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            // Product Commands
            get_products,
            create_product,
            update_product,
            delete_product,
            // Stock Commands
            get_stock,
            add_stock,
            // Receipt Commands
            create_invoice,
            add_invoice_item,
            get_invoice_detail,
            get_invoices_by_date
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
