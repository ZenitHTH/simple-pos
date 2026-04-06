# Tauri Backend Architecture

This directory contains the Rust backend for the Vibe POS application, built with Tauri v2. It provides a secure, performant bridge between the frontend and the local system.

## Architecture

![Backend Architecture](./mermaid-diagram-2026-02-14-152729.svg)

## Structure

- **`src/`**: Core Rust source files (`main.rs`, `lib.rs`, `commands/`).
- **`database/`**: Local crate for database interactions (Diesel ORM + SQLCipher).
- **`export_lib/`**: Local crate for handling data exports (CSV, XLSX, ODS).
- **`image_lib/`**: Local crate for image processing and storage.
- **`tauri.conf.json`**: Tauri configuration file defining capabilities and window settings.

## Security

The backend uses **SQLCipher** to provide transparent 256-bit AES encryption for the SQLite database. This ensures that even if the `.db` file is accessed directly, the data remains protected.

## Key Command Modules

The backend exposes several command modules to the frontend:

### Product & Stock
- `get_products`, `create_product`, `update_product`, `delete_product`
- `get_stock`, `get_all_stocks`, `insert_stock`, `update_stock`, `remove_stock`
- `set_product_stock_mode`: Toggle between direct stock and recipe-based deduction.

### Transactions & Invoices
- `create_invoice`: Create a new sale record.
- `add_invoice_item`: Add products to an active invoice.
- `get_invoices_by_date`, `get_invoice_detail`: Retrieve order history and reports.
- `get_accumulated_report`: Fetch total sales and material usage for a period.

### Customer Management
- `get_customers`, `create_customer`, `update_customer`, `delete_customer`

### Material & Recipe
- `get_materials`, `create_material`, `update_material`, `delete_material`
- `get_recipe_list_by_product`, `create_recipe_list`, `delete_recipe_list`
- `get_recipe_items`, `add_recipe_item`, `update_recipe_item`, `delete_recipe_item`

### Categories
- `get_categories`, `create_category`, `update_category`, `delete_category`

### Images
- `save_image`: Save uploaded image to content-addressed local storage.
- `delete_image`: Remove image and its metadata.
- `link_product_image`, `unlink_product_image`: Manage product-image relationships.
- `update_image_position`: Update the CSS object-position for an image.

### Settings
- `get_settings`, `save_settings`: Manage application settings (persisted to `settings.json` in user data directory).
- `get_storage_info`: Retrieve paths for database and images.
- `migrate_image_directory`: Move all images to a new custom directory.

### System
- `initialize_database`, `check_database_exists`, `check_db_password`
