import { StorageInfo } from "./image";

export interface GeneralSettings {
  currency_symbol: string;
  tax_enabled: boolean;
  tax_rate: number;
}

/**
 * Consolidated initial state for the application.
 */
export interface AppInitialState {
  settings: AppSettings;
  storage_info: StorageInfo;
  database_exists: boolean;
}

export interface ThemeSettings {
  // ── Theme ──
  theme_primary_color: string | null;
  theme_background_color: string | null;
  theme_card_color: string | null;
  theme_text_color: string | null;
  theme_border_color: string | null;
  theme_radius: number | null;
  theme_preset: "compact" | "cozy" | "custom" | null;
}
export interface StorageSettings {
  image_storage_path: string | null;
  db_storage_path: string | null;
}

export interface TypographySettings {
  font_family: string | null;
  base_size: number | null;
  heading_weight: number | null;
  body_weight: number | null;
  line_height: number | null;
  letter_spacing: number | null;
}

export interface ComponentScales {
  sidebar: number;
  cart: number;
  grid: number;
  manage_table: number;
  stock_table: number;
  material_table: number;
  category_table: number;
  setting_page: number;
  payment_modal: number;
  button: number;
}

export interface FontScales {
  header: number;
  sidebar: number;
  cart: number;
  grid: number;
  manage_table: number;
  stock_table: number;
  material_table: number;
  category_table: number;
  setting_page: number;
  payment_modal: number;
  button: number;
  history: number | null;
}

export interface ScalingSettings {
  display_scale: number;
  components: ComponentScales;
  fonts: FontScales;
}

export interface CartStyling {
  font_size: number | null;
  header_font_size: number | null;
  price_font_size: number | null;
  padding: number | null;
  margin: number | null;
  image_size: number | null;
  gap: number | null;
  border_style: "solid" | "dashed" | "none" | null;
  bg_opacity: number | null;
}

export interface PaymentStyling {
  numpad_height: number | null;
  numpad_scale: number;
  numpad_font_scale: number;
  numpad_display_font_scale: number;
  numpad_button_height: number | null;
  numpad_gap: number | null;
}

export interface GridStyling {
  item_padding: number | null;
  item_radius: number | null;
  item_title_font_size: number | null;
  item_price_font_size: number | null;
  gap: number | null;
  item_shadow: number | null;
  item_border_width: number | null;
  item_hover_scale: number | null;
  item_bg_opacity: number | null;
}

export interface SidebarStyling {
  icon_size: number | null;
  item_spacing: number | null;
  item_radius: number | null;
  active_bg_opacity: number | null;
}

export interface ButtonStyling {
  radius: number | null;
  shadow_intensity: number | null;
  transition_speed: number | null;
}

export interface StylingSettings {
  cart: CartStyling;
  payment: PaymentStyling;
  grid: GridStyling;
  sidebar: SidebarStyling;
  button: ButtonStyling;
}

export interface CustomPreset {
  id: string;
  name: string;
  theme: ThemeSettings;
  styling: StylingSettings;
  scaling: ScalingSettings;
}

export interface AppSettings {
  general: GeneralSettings;
  theme: ThemeSettings;
  storage: StorageSettings;
  typography: TypographySettings;
  scaling: ScalingSettings;
  styling: StylingSettings;
  custom_presets: CustomPreset[];
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

export interface CuratedTheme {
  id: string;
  name: string;
  color: string;
  description: string;
}
