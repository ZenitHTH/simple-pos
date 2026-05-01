# Settings Library Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the monolithic settings logic from `commands/settings.rs` into a standalone Rust library crate `settings_lib` to improve modularity and reusability.

**Architecture:** We will create a new workspace crate `settings_lib` that handles the `AppSettings` data model, JSON persistence, and legacy schema migrations. The Tauri command layer will be refactored to be a thin wrapper around this library.

**Tech Stack:** Rust, Serde (serialization), `directories` (path resolution), Tauri (as a consumer).

---

### Task 1: Initialize the `settings_lib` Crate

**Files:**
- Create: `src-tauri/settings_lib/Cargo.toml`
- Modify: `src-tauri/Cargo.toml`

- [ ] **Step 1: Create the new crate directory and manifest**

```toml
# src-tauri/settings_lib/Cargo.toml
[package]
name = "settings_lib"
version = "0.1.0"
edition = "2024"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
directories = "6.0.0"
log = "0.4"
```

- [ ] **Step 2: Add the new crate to the workspace**

Modify `src-tauri/Cargo.toml` to include `settings_lib` in the workspace members and add it as a dependency.

```toml
# src-tauri/Cargo.toml
# ... in [workspace] members ...
members = ["database", "export_lib", "image_lib", "settings_lib"]

# ... in [dependencies] ...
settings_lib = { path = "settings_lib" }
```

- [ ] **Step 3: Verify the crate structure**

Run: `cargo check` in `src-tauri` directory.
Expected: Build passes.

- [ ] **Step 4: Commit**

```bash
git add src-tauri/Cargo.toml src-tauri/settings_lib/Cargo.toml
git commit -m "refactor: initialize settings_lib crate"
```

---

### Task 2: Define Models in `settings_lib`

**Files:**
- Create: `src-tauri/settings_lib/src/models.rs`
- Create: `src-tauri/settings_lib/src/lib.rs`

- [ ] **Step 1: Move struct definitions to `models.rs`**

```rust
// src-tauri/settings_lib/src/models.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct GeneralSettings {
    pub currency_symbol: String,
    pub tax_enabled: bool,
    pub tax_rate: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct ThemeSettings {
    pub theme_primary_color: Option<String>,
    pub theme_radius: Option<f64>,
    pub theme_preset: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct StorageSettings {
    pub image_storage_path: Option<String>,
    pub db_storage_path: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct TypographySettings {
    pub font_family: Option<String>,
    pub base_size: Option<f64>,
    pub heading_weight: Option<f64>,
    pub body_weight: Option<f64>,
    pub line_height: Option<f64>,
    pub letter_spacing: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct ComponentScales {
    pub sidebar: f64,
    pub cart: f64,
    pub grid: f64,
    pub manage_table: f64,
    pub stock_table: f64,
    pub material_table: f64,
    pub category_table: f64,
    pub setting_page: f64,
    pub payment_modal: f64,
    pub button: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct FontScales {
    pub header: f64,
    pub sidebar: f64,
    pub cart: f64,
    pub grid: f64,
    pub manage_table: f64,
    pub stock_table: f64,
    pub material_table: f64,
    pub category_table: f64,
    pub setting_page: f64,
    pub payment_modal: f64,
    pub button: f64,
    pub history: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct ScalingSettings {
    pub display_scale: f64,
    pub components: ComponentScales,
    pub fonts: FontScales,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct CartStyling {
    pub font_size: Option<f64>,
    pub header_font_size: Option<f64>,
    pub price_font_size: Option<f64>,
    pub padding: Option<f64>,
    pub margin: Option<f64>,
    pub image_size: Option<f64>,
    pub gap: Option<f64>,
    pub border_style: Option<String>,
    pub bg_opacity: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct PaymentStyling {
    pub numpad_height: Option<f64>,
    pub numpad_scale: f64,
    pub numpad_font_scale: f64,
    pub numpad_display_font_scale: f64,
    pub numpad_button_height: Option<f64>,
    pub numpad_gap: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct GridStyling {
    pub item_padding: Option<f64>,
    pub item_radius: Option<f64>,
    pub item_title_font_size: Option<f64>,
    pub item_price_font_size: Option<f64>,
    pub gap: Option<f64>,
    pub item_shadow: Option<f64>,
    pub item_border_width: Option<f64>,
    pub item_hover_scale: Option<f64>,
    pub item_bg_opacity: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct SidebarStyling {
    pub icon_size: Option<f64>,
    pub item_spacing: Option<f64>,
    pub item_radius: Option<f64>,
    pub active_bg_opacity: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct ButtonStyling {
    pub radius: Option<f64>,
    pub shadow_intensity: Option<f64>,
    pub transition_speed: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct StylingSettings {
    pub cart: CartStyling,
    pub payment: PaymentStyling,
    pub grid: GridStyling,
    pub sidebar: SidebarStyling,
    pub button: ButtonStyling,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct AppSettings {
    pub general: GeneralSettings,
    pub theme: ThemeSettings,
    pub storage: StorageSettings,
    pub typography: TypographySettings,
    pub scaling: ScalingSettings,
    pub styling: StylingSettings,
}

impl AppSettings {
    pub fn legacy_default() -> Self {
        Self {
            general: GeneralSettings {
                currency_symbol: "$".to_string(),
                tax_enabled: true,
                tax_rate: 7.0,
            },
            scaling: ScalingSettings {
                display_scale: 100.0,
                components: ComponentScales {
                    sidebar: 100.0,
                    cart: 100.0,
                    grid: 100.0,
                    manage_table: 100.0,
                    stock_table: 100.0,
                    material_table: 100.0,
                    category_table: 100.0,
                    setting_page: 100.0,
                    payment_modal: 100.0,
                    button: 100.0,
                },
                fonts: FontScales {
                    header: 100.0,
                    sidebar: 100.0,
                    cart: 100.0,
                    grid: 100.0,
                    manage_table: 100.0,
                    stock_table: 100.0,
                    material_table: 100.0,
                    category_table: 100.0,
                    setting_page: 100.0,
                    payment_modal: 100.0,
                    button: 100.0,
                    history: Some(100.0),
                },
            },
            styling: StylingSettings {
                cart: CartStyling {
                    font_size: Some(100.0),
                    header_font_size: Some(100.0),
                    price_font_size: Some(100.0),
                    padding: Some(10.0),
                    margin: Some(8.0),
                    image_size: Some(48.0),
                    gap: Some(12.0),
                    border_style: Some("solid".to_string()),
                    bg_opacity: Some(0.0),
                },
                payment: PaymentStyling {
                    numpad_height: Some(320.0),
                    numpad_scale: 100.0,
                    numpad_font_scale: 100.0,
                    numpad_display_font_scale: 100.0,
                    numpad_button_height: Some(80.0),
                    numpad_gap: Some(12.0),
                },
                grid: GridStyling {
                    item_padding: Some(16.0),
                    item_radius: Some(24.0),
                    item_title_font_size: Some(100.0),
                    item_price_font_size: Some(100.0),
                    gap: Some(20.0),
                    item_shadow: Some(10.0),
                    item_border_width: Some(1.0),
                    item_hover_scale: Some(102.0),
                    item_bg_opacity: Some(100.0),
                },
                sidebar: SidebarStyling {
                    icon_size: Some(20.0),
                    item_spacing: Some(8.0),
                    item_radius: Some(12.0),
                    active_bg_opacity: Some(10.0),
                },
                button: ButtonStyling {
                    radius: Some(12.0),
                    shadow_intensity: Some(10.0),
                    transition_speed: Some(200.0),
                },
            },
            theme: ThemeSettings {
                theme_primary_color: None,
                theme_radius: Some(0.5),
                theme_preset: Some("cozy".to_string()),
            },
            ..Default::default()
        }
    }
}
```

- [ ] **Step 2: Expose models in `lib.rs`**

```rust
// src-tauri/settings_lib/src/lib.rs
pub mod models;
pub use models::*;
```

- [ ] **Step 3: Commit**

```bash
git add src-tauri/settings_lib/src/models.rs src-tauri/settings_lib/src/lib.rs
git commit -m "feat: move AppSettings models to settings_lib"
```

---

### Task 3: Implement Manager Logic in `settings_lib`

**Files:**
- Modify: `src-tauri/settings_lib/src/lib.rs`

- [ ] **Step 1: Implement path resolution and validation**

```rust
// src-tauri/settings_lib/src/lib.rs
use directories::ProjectDirs;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};

pub mod models;
pub use models::*;

pub fn get_settings_path() -> Result<PathBuf, String> {
    let proj_dirs = ProjectDirs::from("", "", "simple-pos").ok_or_else(|| {
        "No valid home directory path could be retrieved from the operating system.".to_string()
    })?;

    let data_dir = proj_dirs.data_dir();
    if !data_dir.exists() {
        fs::create_dir_all(data_dir)
            .map_err(|e| format!("Error creating data directory: {}", e))?;
    }
    Ok(data_dir.join("settings.json"))
}

pub fn validate_path(path_str: &str) -> Result<(), String> {
    let path = PathBuf::from(path_str);
    if !path.is_absolute() {
        return Err(format!("Path '{}' must be absolute", path_str));
    }
    if path
        .components()
        .any(|c| matches!(c, std::path::Component::ParentDir))
    {
        return Err(format!(
            "Path '{}' cannot contain '..' components",
            path_str
        ));
    }
    Ok(())
}
```

- [ ] **Step 2: Implement migration logic**

```rust
// src-tauri/settings_lib/src/lib.rs
// ... add to previous ...

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(untagged)]
pub enum SettingsFormat {
    Nested(AppSettings),
    Flat(serde_json::Value),
}

pub fn migrate_flat_to_nested(flat: serde_json::Value) -> AppSettings {
    let mut nested = AppSettings::legacy_default();

    if let Some(obj) = flat.as_object() {
        // General
        if let Some(v) = obj.get("currency_symbol") { nested.general.currency_symbol = v.as_str().unwrap_or("$").to_string(); }
        if let Some(v) = obj.get("tax_enabled") { nested.general.tax_enabled = v.as_bool().unwrap_or(true); }
        if let Some(v) = obj.get("tax_rate") { nested.general.tax_rate = v.as_f64().unwrap_or(7.0); }

        // Scaling
        if let Some(v) = obj.get("display_scale") { nested.scaling.display_scale = v.as_f64().unwrap_or(100.0); }
        
        // Component Scales
        if let Some(v) = obj.get("sidebar_scale") { nested.scaling.components.sidebar = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("cart_scale") { nested.scaling.components.cart = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("grid_scale") { nested.scaling.components.grid = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("manage_table_scale") { nested.scaling.components.manage_table = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("stock_table_scale") { nested.scaling.components.stock_table = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("material_table_scale") { nested.scaling.components.material_table = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("category_table_scale") { nested.scaling.components.category_table = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("setting_page_scale") { nested.scaling.components.setting_page = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("payment_modal_scale") { nested.scaling.components.payment_modal = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("button_scale") { nested.scaling.components.button = v.as_f64().unwrap_or(100.0); }

        // Font Scales
        if let Some(v) = obj.get("header_font_scale") { nested.scaling.fonts.header = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("sidebar_font_scale") { nested.scaling.fonts.sidebar = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("cart_font_scale") { nested.scaling.fonts.cart = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("grid_font_scale") { nested.scaling.fonts.grid = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("manage_table_font_scale") { nested.scaling.fonts.manage_table = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("stock_table_font_scale") { nested.scaling.fonts.stock_table = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("material_table_font_scale") { nested.scaling.fonts.material_table = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("category_table_font_scale") { nested.scaling.fonts.category_table = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("setting_page_font_scale") { nested.scaling.fonts.setting_page = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("payment_modal_font_scale") { nested.scaling.fonts.payment_modal = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("button_font_scale") { nested.scaling.fonts.button = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("history_font_scale") { nested.scaling.fonts.history = v.as_f64(); }

        // Styling - Cart
        if let Some(v) = obj.get("cart_item_font_size") { nested.styling.cart.font_size = v.as_f64(); }
        if let Some(v) = obj.get("cart_item_header_font_size") { nested.styling.cart.header_font_size = v.as_f64(); }
        if let Some(v) = obj.get("cart_item_price_font_size") { nested.styling.cart.price_font_size = v.as_f64(); }
        if let Some(v) = obj.get("cart_item_padding") { nested.styling.cart.padding = v.as_f64(); }
        if let Some(v) = obj.get("cart_item_margin") { nested.styling.cart.margin = v.as_f64(); }
        if let Some(v) = obj.get("cart_item_image_size") { nested.styling.cart.image_size = v.as_f64(); }
        if let Some(v) = obj.get("cart_item_gap") { nested.styling.cart.gap = v.as_f64(); }
        if let Some(v) = obj.get("cart_item_border_style") { nested.styling.cart.border_style = v.as_str().map(|s| s.to_string()); }
        if let Some(v) = obj.get("cart_item_bg_opacity") { nested.styling.cart.bg_opacity = v.as_f64(); }

        // Styling - Payment
        if let Some(v) = obj.get("payment_numpad_height") { nested.styling.payment.numpad_height = v.as_f64(); }
        if let Some(v) = obj.get("numpad_scale") { nested.styling.payment.numpad_scale = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("numpad_font_scale") { nested.styling.payment.numpad_font_scale = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("numpad_display_font_scale") { nested.styling.payment.numpad_display_font_scale = v.as_f64().unwrap_or(100.0); }
        if let Some(v) = obj.get("numpad_button_height") { nested.styling.payment.numpad_button_height = v.as_f64(); }
        if let Some(v) = obj.get("numpad_gap") { nested.styling.payment.numpad_gap = v.as_f64(); }

        // Styling - Grid
        if let Some(v) = obj.get("grid_item_padding") { nested.styling.grid.item_padding = v.as_f64(); }
        if let Some(v) = obj.get("grid_item_radius") { nested.styling.grid.item_radius = v.as_f64(); }
        if let Some(v) = obj.get("grid_item_title_font_size") { nested.styling.grid.item_title_font_size = v.as_f64(); }
        if let Some(v) = obj.get("grid_item_price_font_size") { nested.styling.grid.item_price_font_size = v.as_f64(); }
        if let Some(v) = obj.get("grid_gap") { nested.styling.grid.gap = v.as_f64(); }
        if let Some(v) = obj.get("grid_item_shadow") { nested.styling.grid.item_shadow = v.as_f64(); }
        if let Some(v) = obj.get("grid_item_border_width") { nested.styling.grid.item_border_width = v.as_f64(); }
        if let Some(v) = obj.get("grid_item_hover_scale") { nested.styling.grid.item_hover_scale = v.as_f64(); }
        if let Some(v) = obj.get("grid_item_bg_opacity") { nested.styling.grid.item_bg_opacity = v.as_f64(); }

        // Styling - Sidebar
        if let Some(v) = obj.get("sidebar_icon_size") { nested.styling.sidebar.icon_size = v.as_f64(); }
        if let Some(v) = obj.get("sidebar_item_spacing") { nested.styling.sidebar.item_spacing = v.as_f64(); }
        if let Some(v) = obj.get("sidebar_item_radius") { nested.styling.sidebar.item_radius = v.as_f64(); }
        if let Some(v) = obj.get("sidebar_active_bg_opacity") { nested.styling.sidebar.active_bg_opacity = v.as_f64(); }

        // Styling - Button
        if let Some(v) = obj.get("button_radius") { nested.styling.button.radius = v.as_f64(); }
        if let Some(v) = obj.get("button_shadow_intensity") { nested.styling.button.shadow_intensity = v.as_f64(); }
        if let Some(v) = obj.get("button_transition_speed") { nested.styling.button.transition_speed = v.as_f64(); }

        // Typography
        if let Some(v) = obj.get("typography_font_family") { nested.typography.font_family = v.as_str().map(|s| s.to_string()); }
        if let Some(v) = obj.get("typography_base_size") { nested.typography.base_size = v.as_f64(); }
        if let Some(v) = obj.get("typography_heading_weight") { nested.typography.heading_weight = v.as_f64(); }
        if let Some(v) = obj.get("typography_body_weight") { nested.typography.body_weight = v.as_f64(); }
        if let Some(v) = obj.get("typography_line_height") { nested.typography.line_height = v.as_f64(); }
        if let Some(v) = obj.get("typography_letter_spacing") { nested.typography.letter_spacing = v.as_f64(); }

        // Storage
        if let Some(v) = obj.get("image_storage_path") { nested.storage.image_storage_path = v.as_str().map(|s| s.to_string()); }
        if let Some(v) = obj.get("db_storage_path") { nested.storage.db_storage_path = v.as_str().map(|s| s.to_string()); }

        // Theme
        if let Some(v) = obj.get("theme_primary_color") { nested.theme.theme_primary_color = v.as_str().map(|s| s.to_string()); }
        if let Some(v) = obj.get("theme_radius") { nested.theme.theme_radius = v.as_f64(); }
        if let Some(v) = obj.get("theme_preset") { nested.theme.theme_preset = v.as_str().map(|s| s.to_string()); }
    }

    nested
}
```

- [ ] **Step 3: Implement core API functions**

```rust
// src-tauri/settings_lib/src/lib.rs
// ... add to previous ...

pub fn get_settings() -> Result<AppSettings, String> {
    let path = get_settings_path()?;
    if !path.exists() {
        return Ok(AppSettings::legacy_default());
    }

    let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let format: SettingsFormat = match serde_json::from_str(&content) {
        Ok(f) => f,
        Err(e) => {
            log::error!("Failed to parse settings.json: {}. Using defaults.", e);
            return Ok(AppSettings::legacy_default());
        }
    };

    match format {
        SettingsFormat::Nested(s) => Ok(s),
        SettingsFormat::Flat(flat) => {
            log::info!("Migrating flat settings to nested format...");
            let nested = migrate_flat_to_nested(flat);
            // Save the migrated settings immediately
            let content = serde_json::to_string_pretty(&nested).map_err(|e| e.to_string())?;
            fs::write(path, content).map_err(|e| e.to_string())?;
            Ok(nested)
        }
    }
}

pub fn save_settings(settings: AppSettings) -> Result<(), String> {
    // Validate storage paths if provided
    if let Some(ref p) = settings.storage.db_storage_path {
        validate_path(p)?;
    }
    if let Some(ref p) = settings.storage.image_storage_path {
        validate_path(p)?;
    }

    let path = get_settings_path()?;
    let content = serde_json::to_string_pretty(&settings).map_err(|e| e.to_string())?;
    fs::write(path, content).map_err(|e| e.to_string())?;
    Ok(())
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct StorageInfo {
    pub image_path: String,
    pub db_path: String,
}

pub fn get_storage_info() -> Result<StorageInfo, String> {
    // Note: database::get_database_path() is currently in the app crate's context.
    // We might need to pass it in or refactor database crate to be accessible.
    // For now, let's assume we can resolve it using the same logic or calling a provided closure.
    // Actually, database crate is a peer. Let's make settings_lib depend on it if needed,
    // OR just move the path logic to settings_lib.
    
    // Better: settings_lib should be the source of truth for where things go.
    let path = get_settings_path()?;
    let parent = path.parent().ok_or("Cannot determine data directory")?;
    let db_path = parent.join("pos.db").to_string_lossy().to_string();

    let settings = get_settings()?;
    let image_path = if let Some(p) = settings.storage.image_storage_path {
        p
    } else {
        parent.join("images").to_string_lossy().to_string()
    };

    Ok(StorageInfo {
        image_path,
        db_path,
    })
}
```

- [ ] **Step 4: Commit**

```bash
git add src-tauri/settings_lib/src/lib.rs
git commit -m "feat: implement manager logic in settings_lib"
```

---

### Task 4: Refactor `commands/settings.rs`

**Files:**
- Modify: `src-tauri/src/commands/settings.rs`

- [ ] **Step 1: Replace logic with calls to `settings_lib`**

```rust
// src-tauri/src/commands/settings.rs
use settings_lib::{AppSettings, StorageInfo, get_settings as lib_get_settings, save_settings as lib_save_settings, get_storage_info as lib_get_storage_info};
use tauri::command;
use database::establish_connection;
use std::path::PathBuf;

#[command]
pub fn get_settings() -> Result<AppSettings, String> {
    lib_get_settings()
}

#[command]
pub fn save_settings(settings: AppSettings) -> Result<(), String> {
    lib_save_settings(settings)
}

#[command]
pub fn get_storage_info() -> Result<StorageInfo, String> {
    lib_get_storage_info()
}

#[command]
pub fn migrate_image_directory(key: String, new_path: String) -> Result<(), String> {
    settings_lib::validate_path(&new_path)?;

    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    let images = database::image::get_all_images(&mut conn).map_err(|e| e.to_string())?;

    let new_path_buf = PathBuf::from(&new_path);
    if !new_path_buf.exists() {
        std::fs::create_dir_all(&new_path_buf)
            .map_err(|e| format!("Error creating new directory: {}", e))?;
    }

    for image in images {
        let old_path = PathBuf::from(&image.file_path);
        let actual_filename = match old_path.file_name() {
            Some(name) => name,
            None => continue,
        };
        
        let dest_path = new_path_buf.join(actual_filename);
        let dest_path_str = dest_path.to_string_lossy().to_string();

        if old_path.exists() {
            if old_path == dest_path {
                continue;
            }

            std::fs::copy(&old_path, &dest_path).map_err(|e| {
                format!("Failed to copy {} to {}: {}", image.file_name, dest_path_str, e)
            })?;

            database::image::update_image_path(&mut conn, image.id, &dest_path_str)
                .map_err(|e| e.to_string())?;

            if old_path != dest_path {
                let _ = std::fs::remove_file(&old_path);
            }
        }
    }

    Ok(())
}
```

- [ ] **Step 2: Commit**

```bash
git add src-tauri/src/commands/settings.rs
git commit -m "refactor: use settings_lib in Tauri commands"
```

---

### Task 5: Update Consumer Commands

**Files:**
- Modify: `src-tauri/src/commands/export.rs`
- Modify: `src-tauri/src/commands/images.rs`

- [ ] **Step 1: Update `export.rs`**

```rust
// src-tauri/src/commands/export.rs
// Change import from crate::commands::settings::get_settings to settings_lib::get_settings
use settings_lib::get_settings;
// ...
```

- [ ] **Step 2: Update `images.rs`**

```rust
// src-tauri/src/commands/images.rs
// Change import from super::settings::get_settings to settings_lib::get_settings
use settings_lib::get_settings;
// ...
```

- [ ] **Step 3: Verify build**

Run: `cargo check`
Expected: Build passes.

- [ ] **Step 4: Commit**

```bash
git add src-tauri/src/commands/export.rs src-tauri/src/commands/images.rs
git commit -m "refactor: update consumers to use settings_lib"
```

---

### Task 6: Final Verification

- [ ] **Step 1: Run the app**

Run: `npm run tauri dev`
Expected: App launches, settings load correctly.

- [ ] **Step 2: Test saving settings**

Go to Settings page, change currency or scale, save.
Expected: Settings are persisted and reload correctly on restart.

- [ ] **Step 3: Verify migration (Manual test)**

Manually create a flat `settings.json` in the data dir and launch the app.
Expected: App migrates it to nested format automatically.

- [ ] **Step 4: Final Commit**

```bash
git commit --allow-empty -m "docs: settings refactor complete"
```
