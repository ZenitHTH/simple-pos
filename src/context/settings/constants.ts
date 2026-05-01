import { AppSettings, CuratedTheme } from "@/lib";

export const CURATED_THEMES: CuratedTheme[] = [
  { id: "flat-cn", name: "Chinese Soft", color: "#5352ed", description: "Flat UI Chinese Palette" },
  { id: "flat-se", name: "Swedish Deep", color: "#575fcf", description: "Flat UI Swedish Palette" },
  { id: "ocean", name: "Ocean Deep", color: "#0ea5e9", description: "Professional and calm" },
  { id: "matcha", name: "Matcha Cafe", color: "#4ade80", description: "Fresh and organic" },
  { id: "sunset", name: "Sunset Glow", color: "#f59e0b", description: "Warm and inviting" },
  { id: "ruby", name: "Ruby Wine", color: "#e11d48", description: "Elegant and bold" },
  { id: "slate", name: "Slate Tech", color: "#64748b", description: "Minimalist and clean" },
  { id: "midnight", name: "Midnight", color: "#1e1b4b", description: "High-contrast dark" },
];

export const THEME_PRESETS = {
  compact: {
    theme: {
      theme_preset: "compact" as const,
      theme_radius: 0.4,
    },
    scaling: {
      display_scale: 90,
      components: {
        sidebar: 85,
        cart: 90,
        grid: 90,
        button: 85,
      },
    },
  },
  cozy: {
    theme: {
      theme_preset: "cozy" as const,
      theme_radius: 0.5,
    },
    scaling: {
      display_scale: 100,
      components: {
        sidebar: 100,
        cart: 100,
        grid: 100,
        button: 100,
      },
    },
  },
};

export const DEFAULT_SETTINGS: AppSettings = {
  general: {
    currency_symbol: "$",
    tax_enabled: true,
    tax_rate: 7.0,
  },
  theme: {
    theme_primary_color: null,
    theme_background_color: "#ced6e0", // Anti-Flash White
    theme_card_color: "#dfe4ea",       // City Lights
    theme_text_color: "#2f3542",       // Prestige Blue
    theme_border_color: "#f1f2f6",     // Pumpkin Patch
    theme_radius: 0.5,
    theme_preset: "cozy",
  },
  storage: {
    image_storage_path: null,
    db_storage_path: null,
  },
  typography: {
    font_family: null,
    base_size: null,
    heading_weight: null,
    body_weight: null,
    line_height: null,
    letter_spacing: null,
  },
  scaling: {
    display_scale: 100.0,
    components: {
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
    fonts: {
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
      history: 100.0,
    },
  },
  styling: {
    cart: {
      font_size: 100,
      header_font_size: 100,
      price_font_size: 100,
      padding: 10,
      margin: 8,
      image_size: 48,
      gap: 12,
      border_style: "solid",
      bg_opacity: 0,
    },
    payment: {
      numpad_height: 320,
      numpad_scale: 100,
      numpad_font_scale: 100,
      numpad_display_font_scale: 100,
      numpad_button_height: 80,
      numpad_gap: 12,
    },
    grid: {
      item_padding: 16,
      item_radius: 24,
      item_title_font_size: 100,
      item_price_font_size: 100,
      gap: 20,
      item_shadow: 10,
      item_border_width: 1,
      item_hover_scale: 102,
      item_bg_opacity: 100,
    },
    sidebar: {
      icon_size: 20,
      item_spacing: 8,
      item_radius: 12,
      active_bg_opacity: 10,
    },
    button: {
      radius: 12,
      shadow_intensity: 10,
      transition_speed: 200,
    },
  },
  custom_presets: [],
};
