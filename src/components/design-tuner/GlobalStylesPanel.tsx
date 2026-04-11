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
          value={settings.theme.theme_radius ?? 0.5}
          onChange={(v) => updateSettings({ theme: { theme_radius: v } })}
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
            Primary Color (Auto-generates palette)
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

        {/* Button Styling */}
        <div className="border-t border-border/50 pt-4 mt-4 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Global Buttons
          </h3>
          <SidebarSlider
            label="Button Radius"
            value={settings.styling.button.radius ?? 12}
            onChange={(v) => updateSettings({ styling: { button: { radius: v } } })}
            min={0}
            max={32}
            unit="px"
          />
          <SidebarSlider
            label="Shadow Intensity"
            value={settings.styling.button.shadow_intensity ?? 10}
            onChange={(v) => updateSettings({ styling: { button: { shadow_intensity: v } } })}
            min={0}
            max={100}
            unit="%"
          />
          <SidebarSlider
            label="Anim Speed"
            value={settings.styling.button.transition_speed ?? 200}
            onChange={(v) => updateSettings({ styling: { button: { transition_speed: v } } })}
            min={100}
            max={500}
            step={50}
            unit="ms"
          />
        </div>

        {/* Reset Buttons */}
        <div className="pt-2">
          <button
            onClick={() => {
              updateSettings({
                theme: {
                  theme_primary_color: "#3b82f6",
                  theme_radius: 0.5,
                  theme_preset: null,
                },
                styling: {
                  button: {
                    radius: 12,
                    shadow_intensity: 10,
                    transition_speed: 200,
                  }
                }
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
