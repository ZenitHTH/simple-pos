# Settings Library Restructure Design

## Background & Motivation
The `settings_lib/src/lib.rs` file currently handles path resolution, flat-to-nested format migrations, file I/O operations (persistence), and data structure representations. This violates the Single Responsibility Principle and makes the crate harder to navigate. 

We will split the logic in `lib.rs` into distinct modules based on their responsibilities.

## Proposed Structure

We will introduce the following modules:

1. **`models.rs`** *(Already exists)*
   - Contains `AppSettings` and its nested sub-structs.
   - We will also move `StorageInfo` here since it's a data model returned by the API.

2. **`paths.rs`**
   - **Responsibility:** File system path resolution and validation.
   - **Functions:** `get_settings_path()`, `validate_path()`.

3. **`migration.rs`**
   - **Responsibility:** Handling legacy data formats and upgrading them to the current schema.
   - **Functions/Structs:** `SettingsFormat` enum, `migrate_flat_to_nested()`.

4. **`manager.rs`**
   - **Responsibility:** High-level persistence API for getting and saving settings.
   - **Functions:** `get_settings()`, `save_settings()`, `get_storage_info()`.

5. **`lib.rs`**
   - **Responsibility:** Module declaration and public re-exports to maintain a clean API for consumers.
   - **Content:** 
     ```rust
     pub mod models;
     pub mod paths;
     pub mod migration;
     pub mod manager;

     pub use models::*;
     pub use paths::{get_settings_path, validate_path};
     pub use migration::{SettingsFormat, migrate_flat_to_nested};
     pub use manager::{get_settings, save_settings, get_storage_info};
     ```

## Implementation Steps
1. Create `src/paths.rs` and move path-related logic.
2. Create `src/migration.rs` and move the massive `migrate_flat_to_nested` function.
3. Move `StorageInfo` to `src/models.rs`.
4. Create `src/manager.rs` and move the read/write logic.
5. Update `src/lib.rs` to wire up the new modules.
6. Verify everything builds with `cargo check -p settings_lib --lib`.
