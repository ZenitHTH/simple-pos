"use client";

import { AppSettings } from "@/lib/types";
import { SidebarSlider } from "./SidebarSlider";

interface GlobalStylesPanelProps {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  // Local state for tuner's own preview zoom
  previewZoom: number;
  setPreviewZoom: (v: number) => void;
}

export function GlobalStylesPanel({
  settings,
  updateSettings,
  previewZoom,
  setPreviewZoom,
}: GlobalStylesPanelProps) {
  return (
    <div className="border-border mt-8 border-t px-2 pt-4">
      <h2 className="text-foreground/80 mb-4 text-sm font-semibold">
        Global Styles
      </h2>
      <div className="space-y-4">
        {/* Radius Slider */}
        <SidebarSlider
          label="Radius"
          value={settings.theme_radius ?? 0.5}
          onChange={(v) => updateSettings({ theme_radius: v })}
          min={0}
          max={2}
          step={0.1}
          unit="rem"
        />

        {/* Preview Zoom Slider - This only affects the tuner preview div */}
        <SidebarSlider
          label="Preview Zoom"
          value={previewZoom}
          onChange={setPreviewZoom}
          min={12}
          max={32}
          step={1}
          unit="px"
        />

        {/* Primary Color Picker */}
        <div className="space-y-2">
          <label className="text-muted-foreground block text-xs font-medium">
            Primary Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={settings.theme_primary_color ?? "#3b82f6"}
              onChange={(e) =>
                updateSettings({ theme_primary_color: e.target.value })
              }
              className="h-8 w-8 cursor-pointer rounded-lg border-0 p-0 overflow-hidden shadow-sm"
            />
            <input
              type="text"
              value={settings.theme_primary_color ?? "#3b82f6"}
              onChange={(e) =>
                updateSettings({ theme_primary_color: e.target.value })
              }
              className="border-input bg-background flex-1 rounded-lg border px-3 py-1 text-xs font-mono shadow-sm focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="#3b82f6"
            />
          </div>
        </div>

        {/* Reset Buttons */}
        <div className="pt-2">
          <button
            onClick={() => {
              updateSettings({
                theme_primary_color: "#3b82f6",
                theme_radius: 0.5,
              });
              setPreviewZoom(16);
            }}
            className="text-muted-foreground hover:text-foreground w-full rounded-lg border border-dashed py-2 text-[10px] transition-colors uppercase tracking-wider font-semibold"
          >
            Reset Globals
          </button>
        </div>
      </div>
    </div>
  );
}
