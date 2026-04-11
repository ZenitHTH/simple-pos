use crate::models::AppSettings;
use serde::{Deserialize, Serialize};

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
        if let Some(v) = obj.get("theme_background_color") { nested.theme.theme_background_color = v.as_str().map(|s| s.to_string()); }
        if let Some(v) = obj.get("theme_card_color") { nested.theme.theme_card_color = v.as_str().map(|s| s.to_string()); }
        if let Some(v) = obj.get("theme_text_color") { nested.theme.theme_text_color = v.as_str().map(|s| s.to_string()); }
        if let Some(v) = obj.get("theme_border_color") { nested.theme.theme_border_color = v.as_str().map(|s| s.to_string()); }
        if let Some(v) = obj.get("theme_radius") { nested.theme.theme_radius = v.as_f64(); }
        if let Some(v) = obj.get("theme_preset") { nested.theme.theme_preset = v.as_str().map(|s| s.to_string()); }
    }

    nested
}
