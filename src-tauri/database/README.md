# Database Module

This crate `simple-pos-database` manages the data persistence layer for the Vibe POS application. It uses **Diesel ORM** with **SQLite** and **SQLCipher** to handle secure database operations.

## Security & Encryption

The database is encrypted using **SQLCipher** (256-bit AES).
- **Encryption Key**: Managed internally by the application.
- **Data Protection**: All tables, including products, customers, and transactions, are encrypted at rest.
- **Direct Access**: The database file cannot be read using standard SQLite viewers without the correct key.

## Architecture

The module is structured to separate concerns between connection management and domain-specific logic.

![Architecture Diagram](./mermaid-diagram-2026-02-11-180349.svg)

### Modules

- **lib.rs**: The library entry point.
- **connection.rs**: Handles the SQLite connection pool and SQLCipher initialization.
- **Domain Modules**:
  - `product`: Manages product data.
  - `category`: Manages product categories.
  - `stock`: Manages inventory levels.
  - `receipt`: Handles sales transactions.
  - `customer`: (New) Manages customer profiles.
  - `material`: (New) Raw materials inventory.
  - `recipe`: (New) Ingredients and proportions for products.
  - `image`: Manages image metadata.
  - `product_image`: Maps products to images.

## Database Schema

The following ER diagram illustrates the relationships between the database entities.

![ER Diagram](./mermaid-diagram-2026-02-11-180323.svg)

### Key Entities

- **CATEGORY**: Groups products.
- **PRODUCT**: Items for sale.
- **STOCK**: Inventory tracking.
- **RECEIPT**: Sales transactions.
- **CUSTOMER**: User/Client data.
- **MATERIAL**: Raw ingredients.
- **RECIPE**: Linking materials to products.
- **IMAGES**: Metadata for local images.

> **Note**: Application settings (currency, tax, layout) are persisted in a JSON file (`settings.json`) in the user's data directory, not in the database.

## Development

### Prerequisites

- Rust (latest stable)
- Diesel CLI: `cargo install diesel_cli --no-default-features --features sqlite`
- **SQLCipher**: Must be available on the system for linking.

### Setup

1.  Ensure `.env` is configured with `DATABASE_URL`.
2.  Run migrations:
    ```bash
    diesel migration run
    ```
