import { useEffect } from "react";
import { AppSettings } from "@/lib";

export function useApplySettings(settings: AppSettings) {
  useEffect(() => {
    const root = document.documentElement;

    // Basic sanitization for CSS variables
    const safeFont = (f: string | null | undefined) => (f?.includes(";") ? "Inter" : f);
    const safeColor = (c: string | null | undefined) => (c?.includes(";") ? "#3b82f6" : c);

    root.style.setProperty(
      "--typography-font-family",
      safeFont(settings.typography.font_family) ?? "Inter, sans-serif",
    );
    root.style.setProperty(
      "--typography-base-size",
      `${settings.typography.base_size ?? 16}px`,
    );
    root.style.setProperty(
      "--typography-heading-weight",
      String(settings.typography.heading_weight ?? 700),
    );
    root.style.setProperty(
      "--typography-body-weight",
      String(settings.typography.body_weight ?? 400),
    );
    root.style.setProperty(
      "--typography-line-height",
      String(settings.typography.line_height ?? 1.6),
    );
    root.style.setProperty(
      "--typography-letter-spacing",
      `${settings.typography.letter_spacing ?? 0}em`,
    );

    // Apply primary theme color
    const primaryColor = safeColor(settings.theme.theme_primary_color);
    if (primaryColor) {
      root.style.setProperty("--theme-primary", primaryColor);
    } else {
      root.style.removeProperty("--theme-primary");
    }

    // Apply manual color overrides
    const backgroundColor = safeColor(settings.theme.theme_background_color);
    if (backgroundColor) root.style.setProperty("--theme-background", backgroundColor);
    else root.style.removeProperty("--theme-background");

    const cardColor = safeColor(settings.theme.theme_card_color);
    if (cardColor) root.style.setProperty("--theme-card", cardColor);
    else root.style.removeProperty("--theme-card");

    const textColor = safeColor(settings.theme.theme_text_color);
    if (textColor) root.style.setProperty("--theme-text", textColor);
    else root.style.removeProperty("--theme-text");

    const borderColor = safeColor(settings.theme.theme_border_color);
    if (borderColor) root.style.setProperty("--theme-border", borderColor);
    else root.style.removeProperty("--theme-border");

    // Apply radius
    if (settings.theme.theme_radius !== null) {
      root.style.setProperty("--radius", `${settings.theme.theme_radius}rem`);
    } else {
      root.style.removeProperty("--radius");
    }

    // ── Product Grid Styling ──
    const grid = settings.styling.grid;
    root.style.setProperty("--grid-item-padding", `${grid.item_padding ?? 16}px`);
    root.style.setProperty("--grid-item-radius", `${grid.item_radius ?? 24}px`);
    root.style.setProperty("--grid-item-title-font-size", String(grid.item_title_font_size ?? 100));
    root.style.setProperty("--grid-item-price-font-size", String(grid.item_price_font_size ?? 100));
    root.style.setProperty("--grid-gap", `${grid.gap ?? 20}px`);
    root.style.setProperty("--grid-item-shadow-opacity", `${(grid.item_shadow ?? 10) / 100}`);
    root.style.setProperty("--grid-item-border-width", `${grid.item_border_width ?? 1}px`);
    root.style.setProperty("--grid-item-hover-scale", `${(grid.item_hover_scale ?? 102) / 100}`);
    root.style.setProperty("--grid-item-bg-opacity", `${(grid.item_bg_opacity ?? 100) / 100}`);

    // ── Sidebar Styling ──
    const sidebar = settings.styling.sidebar;
    root.style.setProperty("--sidebar-icon-size", `${sidebar.icon_size ?? 20}px`);
    root.style.setProperty("--sidebar-item-spacing", `${sidebar.item_spacing ?? 8}px`);
    root.style.setProperty("--sidebar-item-radius", `${sidebar.item_radius ?? 12}px`);
    root.style.setProperty("--sidebar-active-bg-opacity", `${(sidebar.active_bg_opacity ?? 10) / 100}`);

    // ── Button Styling ──
    const button = settings.styling.button;
    root.style.setProperty("--button-radius", `${button.radius ?? 12}px`);
    root.style.setProperty("--button-shadow-intensity", `${(button.shadow_intensity ?? 10) / 100}`);
    root.style.setProperty("--button-transition-speed", `${button.transition_speed ?? 200}ms`);

    // ── Cart Item Styling ──
    const cart = settings.styling.cart;
    root.style.setProperty("--cart-item-font-size", String(cart.font_size ?? 100));
    root.style.setProperty("--cart-item-header-font-size", String(cart.header_font_size ?? 100));
    root.style.setProperty("--cart-item-price-font-size", String(cart.price_font_size ?? 100));
    root.style.setProperty("--cart-item-padding", `${cart.padding ?? 10}`);
    root.style.setProperty("--cart-item-margin", `${cart.margin ?? 8}`);
    root.style.setProperty("--cart-item-image-size", `${cart.image_size ?? 48}px`);
    root.style.setProperty("--cart-item-gap", `${cart.gap ?? 12}px`);
    root.style.setProperty("--cart-item-border-style", cart.border_style ?? "solid");
    root.style.setProperty("--cart-item-bg-opacity", `${(cart.bg_opacity ?? 0) / 100}`);

    // Apply global scales
    root.style.setProperty(
        "--display-scale",
        `${(settings.scaling.display_scale ?? 100) / 100}`,
    );

    // Apply font scales that are used as CSS variables
    root.style.setProperty(
        "--header-font-scale",
        `${(settings.scaling.fonts.header ?? 100) / 100}`,
    );

  }, [settings]);
}
