# Database Module

This crate `simple-pos-database` manages the data persistence layer for the Vibe POS application. It uses **Diesel ORM** with **SQLite** and **SQLCipher** to handle secure database operations.

## Security & Encryption

The database is encrypted using **SQLCipher** (256-bit AES).
- **Encryption Key**: User-provided key required to establish a connection.
- **Data Protection**: All tables, including products, customers, and transactions, are encrypted at rest.
- **Direct Access**: The database file cannot be read using standard SQLite viewers without the correct key and SQLCipher support.

## Architecture

The module is structured to separate concerns between connection management and domain-specific logic.

![Architecture Diagram](./mermaid-diagram-2026-02-11-180349.svg)

### Modules

- **`lib.rs`**: The library entry point.
- **`connection.rs`**: Handles the SQLite connection pool and SQLCipher initialization.
- **Domain Modules**:
  - **`product`**: Manages product metadata and stock modes.
  - **`category`**: Manages hierarchical or flat product categories.
  - **`stock`**: Manages inventory levels for products.
  - **`receipt`**: Handles sales transactions and line items.
  - **`customer`**: Manages customer profiles (Tax ID, Address, Branch).
  - **`material`**: Tracks raw materials inventory.
  - **`recipe`**: Defines ingredients and proportions for complex products.
  - **`image`**: Manages metadata for local images.
  - **`product_image`**: Maps many-to-many (or 1:N) relationships between products and images.

## Database Schema

The following ER diagram illustrates the relationships between the database entities.

![ER Diagram](./mermaid-diagram-2026-02-11-180323.svg)

### Key Entities

- **CATEGORY**: Groups products.
- **PRODUCT**: Items for sale.
- **STOCK**: Inventory tracking.
- **RECEIPT**: Sales transactions.
- **CUSTOMER**: User/Client data for invoicing.
- **MATERIAL**: Raw ingredients.
- **RECIPE**: Linking materials to products for automated stock deduction.
- **IMAGES**: Metadata for content-addressed local images.

> **Note**: Application UI settings (currency, tax, layout scaling) are persisted in a JSON file (`settings.json`) in the user's data directory, not in the encrypted database.

## Development

### Prerequisites

- Rust (latest stable)
- Diesel CLI: `cargo install diesel_cli --no-default-features --features sqlite`
- **SQLCipher**: Must be available on the system for linking.

### Setup

1. Ensure your environment is set up for SQLCipher.
2. Run migrations:
   ```bash
   diesel migration run
   ```
