"use client";

import { useSettings } from "@/context/settings/SettingsContext";
import { AppSettings } from "@/lib";
import SelectableOverlay from "./SelectableOverlay";
import { ReactNode } from "react";

interface ScalableContainerProps {
  settingKey: keyof AppSettings;
  children: ReactNode;
  className?: string;
}

export default function ScalableContainer({
  settingKey,
  children,
  className = "",
}: ScalableContainerProps) {
  const { settings } = useSettings();

  // Mapping for legacy scale keys to nested paths
  const getScaleValues = (key: string) => {
    switch (key) {
      case "manage_table_scale":
        return {
          scale: settings.scaling.components.manage_table,
          fontScale: settings.scaling.fonts.manage_table,
        };
      case "stock_table_scale":
        return {
          scale: settings.scaling.components.stock_table,
          fontScale: settings.scaling.fonts.stock_table,
        };
      case "material_table_scale":
        return {
          scale: settings.scaling.components.material_table,
          fontScale: settings.scaling.fonts.material_table,
        };
      case "category_table_scale":
        return {
          scale: settings.scaling.components.category_table,
          fontScale: settings.scaling.fonts.category_table,
        };
      case "setting_page_scale":
        return {
          scale: settings.scaling.components.setting_page,
          fontScale: settings.scaling.fonts.setting_page,
        };
      case "payment_modal_scale":
        return {
          scale: settings.scaling.components.payment_modal,
          fontScale: settings.scaling.fonts.payment_modal,
        };
      default:
        return { scale: 100, fontScale: 100 };
    }
  };

  const { scale, fontScale } = getScaleValues(String(settingKey));

  return (
    <div
      className={`group relative origin-top transition-transform duration-200 ease-out ${className}`}
      style={{
        transform: `scale(${scale / 100})`,
        marginBottom: `${(scale - 100) * 0.5}%`,
        fontSize: `${fontScale}%`,
      }}
    >
      <SelectableOverlay id={String(settingKey)} />
      {children}
    </div>
  );
}
