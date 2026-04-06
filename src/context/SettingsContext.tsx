"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { AppSettings, settingsApi } from "@/lib";
import { logger } from "@/lib/logger";

interface SettingsContextType {
  settings: AppSettings;
  loading: boolean;
  updateSettings: (updates: Partial<AppSettings>) => void;
  save: () => Promise<void>;
  resetToCheckpoint: () => void; // Reverts to last saved state
  resetToDefault: () => void; // Reverts to hardcoded defaults
}

export const THEME_PRESETS = {
  compact: {
    theme_radius: 0.3,
    button_scale: 90,
    display_scale: 95,
  },
  cozy: {
    theme_radius: 0.8,
    button_scale: 110,
    display_scale: 105,
  },
};

const DEFAULT_SETTINGS: AppSettings = {
  currency_symbol: "$",
  tax_enabled: true,
  tax_rate: 7.0,
  display_scale: 100.0,
  sidebar_scale: 100.0,
  cart_scale: 100.0,
  grid_scale: 100.0,
  manage_table_scale: 100.0,
  stock_table_scale: 100.0,
  material_table_scale: 100.0,
  category_table_scale: 100.0,
  sidebar_font_scale: 100.0,
  cart_font_scale: 100.0,
  grid_font_scale: 100.0,
  manage_table_font_scale: 100.0,
  stock_table_font_scale: 100.0,
  material_table_font_scale: 100.0,
  category_table_font_scale: 100.0,
  setting_page_scale: 100.0,
  setting_page_font_scale: 100.0,
  header_font_scale: 100.0,
  button_scale: 100.0,
  button_font_scale: 100.0,
  layout_max_width: 1280.0,
  payment_modal_scale: 100.0,
  payment_modal_font_scale: 100.0,
  history_font_scale: 100.0,
  payment_numpad_height: 320,
  cart_item_font_size: 100,
  cart_item_header_font_size: 100,
  cart_item_price_font_size: 100,
  cart_item_padding: 10,
  cart_item_margin: 8,
  // ── Typography ──
  typography_font_family: null,
  typography_base_size: null,
  typography_heading_weight: null,
  typography_body_weight: null,
  typography_line_height: null,
  typography_letter_spacing: null,
  image_storage_path: null,
  db_storage_path: null,
  theme_primary_color: null,
  theme_radius: 0.5,
  theme_preset: "cozy",
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    load();
  }, []);

  // Apply scaling whenever settings.display_scale changes
  useEffect(() => {
    if (settings.display_scale) {
      document.documentElement.style.fontSize = `${settings.display_scale}%`;
    }
  }, [settings.display_scale]);

  // Apply typography CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--typography-font-family",
      settings.typography_font_family ?? "Inter, sans-serif",
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
    if (settings.theme_primary_color) {
      root.style.setProperty("--primary", settings.theme_primary_color);
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
    root.style.setProperty("--button-scale", `${(settings.button_scale ?? 100) / 100}`);
    root.style.setProperty("--button-font-scale", `${(settings.button_font_scale ?? 100) / 100}`);
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

  const load = async () => {
    try {
      const data = await settingsApi.getSettings();
      // Ensure display_scale exists (migration for old saves)
      setSettings({ ...DEFAULT_SETTINGS, ...data });
      // Small delay to ensure state is set before initializing auto-save
      setTimeout(() => setIsInitialized(true), 100);
    } catch (error) {
      logger.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => {
      let next = { ...prev, ...updates };

      // Auto-apply preset values if theme_preset is changing to a known preset
      if (updates.theme_preset && updates.theme_preset !== "custom") {
        const preset =
          THEME_PRESETS[updates.theme_preset as keyof typeof THEME_PRESETS];
        if (preset) {
          next = { ...next, ...preset };
        }
      }

      return next;
    });
  };

  const save = async () => {
    try {
      await settingsApi.saveSettings(settings);
      // Optionally fetch again or just assume success
    } catch (error) {
      logger.error("Failed to save settings:", error);
      throw error;
    }
  };

  // Auto-save effect
  useEffect(() => {
    if (!isInitialized) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      save().catch((err) => logger.error("Auto-save failed:", err));
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [settings, isInitialized]);

  const resetToCheckpoint = async () => {
    setLoading(true);
    await load();
  };

  const resetToDefault = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        updateSettings,
        save,
        resetToCheckpoint,
        resetToDefault,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
