use crate::models::AppSettings;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(untagged)]
pub enum SettingsFormat {
    Nested(AppSettings),
    Flat(serde_json::Value),
}

/// Helper macros to clean up the migration logic by reducing repetitive "if let" patterns.
macro_rules! migrate_field {
    // For string fields that need .to_string()
    ($target:expr, $obj:expr, $key:expr, str) => {
        if let Some(v) = $obj.get($key).and_then(|v| v.as_str()) {
            $target = v.to_string();
        }
    };
    // For Option<String> fields
    ($target:expr, $obj:expr, $key:expr, str, opt) => {
        if let Some(v) = $obj.get($key).and_then(|v| v.as_str()) {
            $target = Some(v.to_string());
        }
    };
    // For required fields (overwrites existing value if present in flat JSON)
    ($target:expr, $obj:expr, $key:expr, $method:ident) => {
        if let Some(v) = $obj.get($key).and_then(|v| v.$method()) {
            $target = v;
        }
    };
    // For Option fields (converts present value to Some(T))
    ($target:expr, $obj:expr, $key:expr, $method:ident, opt) => {
        if let Some(v) = $obj.get($key).and_then(|v| v.$method()) {
            $target = Some(v);
        }
    };
}

pub fn migrate_flat_to_nested(flat: serde_json::Value) -> AppSettings {
    let mut nested = AppSettings::legacy_default();

    if let Some(obj) = flat.as_object() {
        // --- General ---
        migrate_field!(nested.general.currency_symbol, obj, "currency_symbol", str);
        migrate_field!(nested.general.tax_enabled, obj, "tax_enabled", as_bool);
        migrate_field!(nested.general.tax_rate, obj, "tax_rate", as_f64);

        // --- Scaling & Components ---
        migrate_field!(nested.scaling.display_scale, obj, "display_scale", as_f64);
        let c = &mut nested.scaling.components;
        migrate_field!(c.sidebar, obj, "sidebar_scale", as_f64);
        migrate_field!(c.cart, obj, "cart_scale", as_f64);
        migrate_field!(c.grid, obj, "grid_scale", as_f64);
        migrate_field!(c.manage_table, obj, "manage_table_scale", as_f64);
        migrate_field!(c.stock_table, obj, "stock_table_scale", as_f64);
        migrate_field!(c.material_table, obj, "material_table_scale", as_f64);
        migrate_field!(c.category_table, obj, "category_table_scale", as_f64);
        migrate_field!(c.setting_page, obj, "setting_page_scale", as_f64);
        migrate_field!(c.payment_modal, obj, "payment_modal_scale", as_f64);
        migrate_field!(c.button, obj, "button_scale", as_f64);

        // --- Font Scaling ---
        let f = &mut nested.scaling.fonts;
        migrate_field!(f.header, obj, "header_font_scale", as_f64);
        migrate_field!(f.sidebar, obj, "sidebar_font_scale", as_f64);
        migrate_field!(f.cart, obj, "cart_font_scale", as_f64);
        migrate_field!(f.grid, obj, "grid_font_scale", as_f64);
        migrate_field!(f.manage_table, obj, "manage_table_font_scale", as_f64);
        migrate_field!(f.stock_table, obj, "stock_table_font_scale", as_f64);
        migrate_field!(f.material_table, obj, "material_table_font_scale", as_f64);
        migrate_field!(f.category_table, obj, "category_table_font_scale", as_f64);
        migrate_field!(f.setting_page, obj, "setting_page_font_scale", as_f64);
        migrate_field!(f.payment_modal, obj, "payment_modal_font_scale", as_f64);
        migrate_field!(f.button, obj, "button_font_scale", as_f64);
        migrate_field!(f.history, obj, "history_font_scale", as_f64, opt);

        // --- Styling: Cart ---
        let cart = &mut nested.styling.cart;
        migrate_field!(cart.font_size, obj, "cart_item_font_size", as_f64, opt);
        migrate_field!(cart.header_font_size, obj, "cart_item_header_font_size", as_f64, opt);
        migrate_field!(cart.price_font_size, obj, "cart_item_price_font_size", as_f64, opt);
        migrate_field!(cart.padding, obj, "cart_item_padding", as_f64, opt);
        migrate_field!(cart.margin, obj, "cart_item_margin", as_f64, opt);
        migrate_field!(cart.image_size, obj, "cart_item_image_size", as_f64, opt);
        migrate_field!(cart.gap, obj, "cart_item_gap", as_f64, opt);
        migrate_field!(cart.border_style, obj, "cart_item_border_style", str, opt);
        migrate_field!(cart.bg_opacity, obj, "cart_item_bg_opacity", as_f64, opt);

        // --- Styling: Payment ---
        let pay = &mut nested.styling.payment;
        migrate_field!(pay.numpad_height, obj, "payment_numpad_height", as_f64, opt);
        migrate_field!(pay.numpad_scale, obj, "numpad_scale", as_f64);
        migrate_field!(pay.numpad_font_scale, obj, "numpad_font_scale", as_f64);
        migrate_field!(pay.numpad_display_font_scale, obj, "numpad_display_font_scale", as_f64);
        migrate_field!(pay.numpad_button_height, obj, "numpad_button_height", as_f64, opt);
        migrate_field!(pay.numpad_gap, obj, "numpad_gap", as_f64, opt);

        // --- Styling: Grid ---
        let g = &mut nested.styling.grid;
        migrate_field!(g.item_padding, obj, "grid_item_padding", as_f64, opt);
        migrate_field!(g.item_radius, obj, "grid_item_radius", as_f64, opt);
        migrate_field!(g.item_title_font_size, obj, "grid_item_title_font_size", as_f64, opt);
        migrate_field!(g.item_price_font_size, obj, "grid_item_price_font_size", as_f64, opt);
        migrate_field!(g.gap, obj, "grid_gap", as_f64, opt);
        migrate_field!(g.item_shadow, obj, "grid_item_shadow", as_f64, opt);
        migrate_field!(g.item_border_width, obj, "grid_item_border_width", as_f64, opt);
        migrate_field!(g.item_hover_scale, obj, "grid_item_hover_scale", as_f64, opt);
        migrate_field!(g.item_bg_opacity, obj, "grid_item_bg_opacity", as_f64, opt);

        // --- Styling: Sidebar ---
        let s = &mut nested.styling.sidebar;
        migrate_field!(s.icon_size, obj, "sidebar_icon_size", as_f64, opt);
        migrate_field!(s.item_spacing, obj, "sidebar_item_spacing", as_f64, opt);
        migrate_field!(s.item_radius, obj, "sidebar_item_radius", as_f64, opt);
        migrate_field!(s.active_bg_opacity, obj, "sidebar_active_bg_opacity", as_f64, opt);

        // --- Styling: Button ---
        let b = &mut nested.styling.button;
        migrate_field!(b.radius, obj, "button_radius", as_f64, opt);
        migrate_field!(b.shadow_intensity, obj, "button_shadow_intensity", as_f64, opt);
        migrate_field!(b.transition_speed, obj, "button_transition_speed", as_f64, opt);

        // --- Typography ---
        let t = &mut nested.typography;
        migrate_field!(t.font_family, obj, "typography_font_family", str, opt);
        migrate_field!(t.base_size, obj, "typography_base_size", as_f64, opt);
        migrate_field!(t.heading_weight, obj, "typography_heading_weight", as_f64, opt);
        migrate_field!(t.body_weight, obj, "typography_body_weight", as_f64, opt);
        migrate_field!(t.line_height, obj, "typography_line_height", as_f64, opt);
        migrate_field!(t.letter_spacing, obj, "typography_letter_spacing", as_f64, opt);

        // --- Storage ---
        migrate_field!(nested.storage.image_storage_path, obj, "image_storage_path", str, opt);
        migrate_field!(nested.storage.db_storage_path, obj, "db_storage_path", str, opt);

        // --- Theme ---
        let th = &mut nested.theme;
        migrate_field!(th.theme_primary_color, obj, "theme_primary_color", str, opt);
        migrate_field!(th.theme_background_color, obj, "theme_background_color", str, opt);
        migrate_field!(th.theme_card_color, obj, "theme_card_color", str, opt);
        migrate_field!(th.theme_text_color, obj, "theme_text_color", str, opt);
        migrate_field!(th.theme_border_color, obj, "theme_border_color", str, opt);
        migrate_field!(th.theme_radius, obj, "theme_radius", as_f64, opt);
        migrate_field!(th.theme_preset, obj, "theme_preset", str, opt);
    }

    nested
}
