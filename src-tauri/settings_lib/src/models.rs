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
    pub theme_background_color: Option<String>,
    pub theme_card_color: Option<String>,
    pub theme_text_color: Option<String>,
    pub theme_border_color: Option<String>,
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

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct StorageInfo {
    pub image_path: String,
    pub db_path: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct AppSettings {
    pub general: GeneralSettings,
    pub theme: ThemeSettings,
    pub storage: StorageSettings,
    pub typography: TypographySettings,
    pub scaling: ScalingSettings,
    pub styling: StylingSettings,
    pub custom_presets: Vec<serde_json::Value>, // Temporary placeholder for custom presets
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
                theme_background_color: None,
                theme_card_color: None,
                theme_text_color: None,
                theme_border_color: None,
                theme_radius: Some(0.5),
                theme_preset: Some("cozy".to_string()),
            },
            custom_presets: Vec::new(),
            ..Default::default()
        }
    }
}
