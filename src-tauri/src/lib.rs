// 1. Declare the commands module
pub mod commands;

// 2. Import everything you need for the run function
use commands::category::*;
use commands::product::*;
use commands::receipt::*;
use commands::stock::*;

use commands::customer::*;
use commands::database::*;
use commands::export::*;
use commands::images::*;
use commands::material::*;
use commands::recipe::*;
use commands::settings::*; // Settings Commands
use tauri::Manager;
use std::sync::RwLock;

pub struct AppState {
    pub pool: RwLock<Option<database::connection::DbPool>>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppState { pool: RwLock::new(None) })
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_focus();
            }
        }))
        .plugin(
            tauri_plugin_log::Builder::default()
                .filter(|metadata| {
                    // Security: Prevent logging of IPC calls which contains raw arguments (like encryption keys)
                    !metadata.target().starts_with("tauri::ipc")
                        && !metadata.target().starts_with("tauri::runtime")
                })
                .build(),
        )
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            // Programmatically allow the images directory in the fs scope
            use tauri_plugin_fs::FsExt;
            if let Ok(mut images_dir) = app.path().app_local_data_dir() {
                images_dir.push("images");
                let _ = app.fs_scope().allow_directory(&images_dir, true);
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Product Commands
            get_products,
            create_product,
            update_product,
            delete_product,
            set_product_stock_mode,
            // Stock Commands
            get_stock,
            get_all_stocks,
            insert_stock,
            update_stock,
            remove_stock,
            // Receipt Commands
            complete_checkout,
            create_invoice,
            add_invoice_items,
            get_invoice_detail,
            get_invoices_by_date,
            get_accumulated_report,
            // Category Commands
            get_categories,
            create_category,
            update_category,
            delete_category,
            // Customer Commands
            get_customers,
            create_customer,
            update_customer,
            // Export Commands
            export_receipts,
            // Settings Commands
            get_settings,
            save_settings,
            get_storage_info,
            migrate_image_directory,
            // Database Commands
            initialize_database,
            check_database_exists,
            // Image Commands
            save_image,
            link_product_image,
            unlink_product_image,
            clear_product_images,
            get_product_images,
            get_all_images,
            delete_image,
            get_all_image_links,
            update_image_position,
            // Material Commands
            get_materials,
            create_material,
            update_material,
            delete_material,
            // Recipe Commands
            create_recipe_list,
            get_recipe_list_by_product,
            delete_recipe_list,
            add_recipe_item,
            get_recipe_items,
            update_recipe_item,
            delete_recipe_item
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
