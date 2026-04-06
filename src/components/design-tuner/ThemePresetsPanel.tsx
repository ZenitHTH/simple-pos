"use client";

import { AppSettings } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { FaLayerGroup, FaCoffee } from "react-icons/fa";

interface ThemePresetsPanelProps {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

export function ThemePresetsPanel({
  settings,
  updateSettings,
}: ThemePresetsPanelProps) {
  const presets = [
    {
      id: "compact",
      label: "Compact",
      icon: <FaLayerGroup />,
      description: "Tight spacing for power users",
      values: {
        theme_preset: "compact" as const,
        sidebar_scale: 0.85,
        cart_scale: 0.9,
        grid_scale: 0.9,
        button_scale: 0.85,
        display_scale: 0.9,
        theme_radius: 0.4,
      },
    },
    {
      id: "cozy",
      label: "Cozy",
      icon: <FaCoffee />,
      description: "Comfortable touch targets",
      values: {
        theme_preset: "cozy" as const,
        sidebar_scale: 1.0,
        cart_scale: 1.0,
        grid_scale: 1.0,
        button_scale: 1.0,
        display_scale: 1.0,
        theme_radius: 0.8,
      },
    },
  ];

  return (
    <div className="px-2 pt-4">
      <h2 className="text-foreground/80 mb-4 text-sm font-semibold">
        Presets
      </h2>
      <div className="grid grid-cols-1 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => updateSettings(preset.values)}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
              settings.theme_preset === preset.id
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-border bg-card/50 hover:bg-secondary/50"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                settings.theme_preset === preset.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {preset.icon}
            </div>
            <div>
              <div className="text-xs font-bold">{preset.label}</div>
              <div className="text-[10px] text-muted-foreground">
                {preset.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
