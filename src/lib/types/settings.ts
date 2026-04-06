export interface AppSettings {
  // ── General ──
  currency_symbol: string;
  tax_enabled: boolean;
  tax_rate: number;

  // ── Global Display ──
  display_scale: number;
  layout_max_width: number;

  // ── Component Scales ──
  sidebar_scale: number;
  cart_scale: number;
  grid_scale: number;
  manage_table_scale: number;
  stock_table_scale: number;
  category_table_scale: number;
  setting_page_scale: number;
  payment_modal_scale: number;
  material_table_scale: number;
  button_scale: number;

  // ── Font Scales ──
  header_font_scale: number;
  sidebar_font_scale: number;
  cart_font_scale: number;
  grid_font_scale: number;
  manage_table_font_scale: number;
  stock_table_font_scale: number;
  category_table_font_scale: number;
  setting_page_font_scale: number;
  payment_modal_font_scale: number;
  material_table_font_scale: number;
  history_font_scale: number | null;
  button_font_scale: number;

  // ── Cart Item Styling ──
  cart_item_font_size: number | null;
  cart_item_header_font_size: number | null;
  cart_item_price_font_size: number | null;
  cart_item_padding: number | null;
  cart_item_margin: number | null;

  // ── Payment ──
  payment_numpad_height: number | null;

  // ── Typography ──
  typography_font_family: string | null;
  typography_base_size: number | null;
  typography_heading_weight: number | null;
  typography_body_weight: number | null;
  typography_line_height: number | null;
  typography_letter_spacing: number | null;

  // ── Storage Paths ──
  image_storage_path: string | null;
  db_storage_path: string | null;
  theme_primary_color: string | null;
  theme_radius: number | null;
  theme_preset: "compact" | "cozy" | "custom" | null;
}
