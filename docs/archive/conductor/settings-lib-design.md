# Settings Library Refactor Design

## Background & Motivation
Currently, `src-tauri/src/commands/settings.rs` acts as a monolithic "God Module." It handles file I/O, validation, complex schema migrations from flat to nested structures, and Tauri command definitions. This tight coupling violates the single responsibility principle and makes the settings logic difficult to reuse across other local crates (like `database`, `export_lib`, or `image_lib`).

To align with the project's architecture (like the `database` crate), we need to extract the core settings management logic into a dedicated Rust library crate: `src-tauri/settings_lib`.

## Architecture & Components
We will create a new workspace crate `settings_lib` with the following responsibilities:

1.  **Models (`models.rs`)**:
    *   Define the `AppSettings` struct and its nested sub-structs (`GeneralSettings`, `ThemeSettings`, etc.).
    *   Define the legacy `SettingsFormat` enum for migrations.
2.  **Core API (`lib.rs` / `manager.rs`)**:
    *   `get_settings()`: Reads and deserializes `settings.json`, applying flat-to-nested migrations if necessary.
    *   `save_settings(settings: AppSettings)`: Serializes and writes to disk.
    *   `get_storage_info()`: Returns the resolved paths for images and the DB.
    *   Path resolution and validation logic (`get_settings_path`, `validate_path`).
3.  **Tauri Commands (`src-tauri/src/commands/settings.rs`)**:
    *   Will be reduced to simple wrapper functions that call into `settings_lib`.
    *   The `migrate_image_directory` command will remain in `commands/settings.rs` (or move to `images.rs`) because it represents a complex side-effect involving file moving and DB updates, which goes beyond simple configuration management.

## Trade-offs and Considerations
*   **Pros**: Decouples configuration from the Tauri runtime. Other crates can depend on `settings_lib` to read configuration without relying on circular dependencies with the main app crate.
*   **Cons**: Adds a new crate to the workspace, slightly increasing build complexity.

## Implementation Steps
1.  Initialize the new crate: `cargo new --lib src-tauri/settings_lib`.
2.  Update `src-tauri/Cargo.toml` to add `settings_lib` to the workspace and dependencies.
3.  Move struct definitions and Serde logic from `commands/settings.rs` to `settings_lib/src/models.rs`.
4.  Move file I/O, path validation, and migration logic to `settings_lib/src/lib.rs`.
5.  Refactor `src-tauri/src/commands/settings.rs` to consume `settings_lib`.
6.  Refactor `src-tauri/src/commands/export.rs` and `images.rs` to use `settings_lib::get_settings()`.

## Verification
- Project must build successfully (`cargo build`).
- Settings must still load correctly on application launch, and migrations must still work.
