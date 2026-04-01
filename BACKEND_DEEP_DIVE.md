# Backend Deep Dive: Modular Architecture

This document provides a granular view of the Rust backend, detailing the internal structure of each crate and module.

```mermaid
graph TD
    %% Main App Crate
    subgraph "app (src-tauri/src/)"
        MN[main.rs] --> LIB_APP[lib.rs]
        LIB_APP --> IH[Invoke Handler]
        IH --> CMD[commands/]
        
        subgraph "Command Modules"
            CMD --> C_PR[product.rs]
            CMD --> C_RC[receipt.rs]
            CMD --> C_ST[stock.rs]
            CMD --> C_MT[material.rs]
            CMD --> C_IM[images.rs]
            CMD --> C_EX[export.rs]
            CMD --> C_SE[settings.rs]
        end
    end

    %% Database Crate
    subgraph "database (src-tauri/database/)"
        DB_LIB[lib.rs] --> DB_CONN[connection.rs]
        DB_LIB --> DB_SCH[schema.rs]
        
        subgraph "Domain Modules (Models & Ops)"
            DB_LIB --> M_PR[product/]
            DB_LIB --> M_ST[stock/]
            DB_LIB --> M_MT[material/]
            DB_LIB --> M_RE[recipe/]
            DB_LIB --> M_RC[receipt/]
            DB_LIB --> M_CT[category/]
            DB_LIB --> M_CU[customer/]
            DB_LIB --> M_IM[image/]
        end
    end

    %% Export Crate
    subgraph "export_lib (src-tauri/export_lib/)"
        EX_LIB[lib.rs] --> EX_CSV[csv_export.rs]
        EX_LIB --> EX_XLS[xlsx_export.rs]
        EX_LIB --> EX_ODS[ods_export.rs]
        EX_LIB --> EX_THAI[thai_accounting.rs]
    end

    %% Image Crate
    subgraph "image_lib (src-tauri/image_lib/)"
        IM_LIB[lib.rs] --> IM_HASH[Hashing / MD5 / SHA]
        IM_LIB --> IM_ST[Storage / File I/O]
    end

    %% Relationships
    C_PR & C_RC & C_ST & C_MT & C_IM --> DB_LIB
    C_EX --> EX_LIB
    C_IM --> IM_LIB
    EX_LIB --> DB_LIB

    %% Persistence
    DB_CONN --> SQL[(SQLite + SQLCipher)]
    IM_ST --> FS[[Local Storage]]
```

### Module Responsibilities

| Crate / Module | Responsibility |
| :--- | :--- |
| **`app::commands`** | Validates frontend input and routes requests to underlying libraries. |
| **`database::connection`** | Manages the encrypted SQLCipher connection pool. |
| **`database::schema`** | Diesel-generated schema for compile-time query safety. |
| **`database::<domain>`** | Contains `models.rs` (structs) and `operations.rs` (CRUD functions) for each entity. |
| **`export_lib`** | Handles multi-format data generation and Thai tax reporting logic. |
| **`image_lib`** | Manages unique image storage using file hashing to prevent duplicates. |

### Technical Details
- **Encryption**: AES-256 via SQLCipher at the database layer.
- **ORM**: Diesel (configured with `returning_clauses_for_sqlite_3_35`).
- **Reports**: Uses `rust-xlsxwriter` for Excel and standard CSV crates for basic exports.
