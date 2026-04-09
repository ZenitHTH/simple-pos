import { useEffect } from "react";
import { AppSettings } from "@/lib";

export function useApplySettings(settings: AppSettings) {
  useEffect(() => {
    const root = document.documentElement;

    // Basic sanitization for CSS variables
    const safeFont = (f: string | null) => (f?.includes(";") ? "Inter" : f);
    const safeColor = (c: string | null) => (c?.includes(";") ? "#3b82f6" : c);

    root.style.setProperty(
      "--typography-font-family",
      safeFont(settings.typography_font_family) ?? "Inter, sans-serif",
    );
    root.style.setProperty(
      "--typography-base-size",
      `${settings.typography_base_size ?? 16}px`,
    );
    root.style.setProperty(
      "--typography-heading-weight",
      String(settings.typography_heading_weight ?? 700),
    );
    root.style.setProperty(
      "--typography-body-weight",
      String(settings.typography_body_weight ?? 400),
    );
    root.style.setProperty(
      "--typography-line-height",
      String(settings.typography_line_height ?? 1.6),
    );
    root.style.setProperty(
      "--typography-letter-spacing",
      `${settings.typography_letter_spacing ?? 0}em`,
    );

    // Apply primary theme color
    const primaryColor = safeColor(settings.theme_primary_color);
    if (primaryColor) {
      root.style.setProperty("--primary", primaryColor);
    } else {
      root.style.removeProperty("--primary");
    }

    // Apply radius
    if (settings.theme_radius !== null) {
      root.style.setProperty("--radius", `${settings.theme_radius}rem`);
    } else {
      root.style.removeProperty("--radius");
    }

    // Apply button scales
    root.style.setProperty(
      "--button-scale",
      `${(settings.button_scale ?? 100) / 100}`,
    );
    root.style.setProperty(
      "--button-font-scale",
      `${(settings.button_font_scale ?? 100) / 100}`,
    );
  }, [
    settings.typography_font_family,
    settings.typography_base_size,
    settings.typography_heading_weight,
    settings.typography_body_weight,
    settings.typography_line_height,
    settings.typography_letter_spacing,
    settings.theme_primary_color,
    settings.theme_radius,
    settings.button_scale,
    settings.button_font_scale,
  ]);
}
