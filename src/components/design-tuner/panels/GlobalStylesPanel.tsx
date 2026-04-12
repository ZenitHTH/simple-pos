"use client";

import { useState } from "react";
import { ThemeExplorerModal } from "../core/ThemeExplorerModal";
import { FaCompass } from "react-icons/fa";
import { AppSettings, DeepPartial } from "@/lib/types";
import { TunerSlider } from "../ui/TunerSlider";

interface GlobalStylesPanelProps {
  settings: AppSettings;
  updateSettings: (updates: DeepPartial<AppSettings>) => void;
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
  const [showExplorer, setShowExplorer] = useState(false);

  return (
    <div className="border-border mt-8 border-t px-2 pt-4">
      <h2 className="text-foreground/80 mb-4 text-sm font-semibold">
        Global Styles
      </h2>

      {/* Theme Explorer Trigger */}
      <div className="mb-6 px-2">
        <button
          onClick={() => setShowExplorer(true)}
          style={{ borderRadius: `calc(${settings.theme.theme_radius ?? 0.5}rem * 4)` }}
          className="group relative w-full overflow-hidden bg-primary p-4 text-left shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-primary-foreground text-sm font-black uppercase tracking-widest">
                Theme Library
              </h3>
              <p className="text-primary-foreground/70 text-[10px] font-bold uppercase">
                Browse & Generate Palettes
              </p>
            </div>
            <FaCompass className="text-primary-foreground/40 duration-500 transition-transform text-xl group-hover:rotate-45" />
          </div>
          {/* Subtle background decoration */}
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
        </button>
      </div>

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
              value={settings.theme.theme_primary_color ?? "#3b82f6"}
              onChange={(e) =>
                updateSettings({ theme: { theme_primary_color: e.target.value } })
              }
              className="h-8 w-8 cursor-pointer overflow-hidden rounded-lg border-0 p-0 shadow-sm"
            />
            <input
              type="text"
              value={settings.theme.theme_primary_color ?? "#3b82f6"}
              onChange={(e) =>
                updateSettings({ theme: { theme_primary_color: e.target.value } })
              }
              className="border-input bg-background flex-1 rounded-lg border px-3 py-1 font-mono text-xs shadow-sm focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="#3b82f6"
            />
          </div>
        </div>

        {/* Manual Overrides */}
        <div className="border-border/50 mt-4 space-y-4 border-t pt-4">
          <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
            Manual Overrides
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-muted-foreground px-1 text-[10px] font-medium uppercase">
                Background
              </label>
              <div className="flex gap-1.5">
                <input
                  type="color"
                  value={settings.theme.theme_background_color ?? "#ffffff"}
                  onChange={(e) =>
                    updateSettings({
                      theme: { theme_background_color: e.target.value },
                    })
                  }
                  className="h-7 w-7 cursor-pointer overflow-hidden rounded-md border-0 p-0 shadow-sm"
                />
                <button
                  onClick={() =>
                    updateSettings({ theme: { theme_background_color: null } })
                  }
                  className="text-muted-foreground hover:text-foreground text-[9px] transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-muted-foreground px-1 text-[10px] font-medium uppercase">
                Card
              </label>
              <div className="flex gap-1.5">
                <input
                  type="color"
                  value={settings.theme.theme_card_color ?? "#ffffff"}
                  onChange={(e) =>
                    updateSettings({
                      theme: { theme_card_color: e.target.value },
                    })
                  }
                  className="h-7 w-7 cursor-pointer overflow-hidden rounded-md border-0 p-0 shadow-sm"
                />
                <button
                  onClick={() =>
                    updateSettings({ theme: { theme_card_color: null } })
                  }
                  className="text-muted-foreground hover:text-foreground text-[9px] transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-muted-foreground px-1 text-[10px] font-medium uppercase">
                Text
              </label>
              <div className="flex gap-1.5">
                <input
                  type="color"
                  value={settings.theme.theme_text_color ?? "#0f172a"}
                  onChange={(e) =>
                    updateSettings({ theme: { theme_text_color: e.target.value } })
                  }
                  className="h-7 w-7 cursor-pointer overflow-hidden rounded-md border-0 p-0 shadow-sm"
                />
                <button
                  onClick={() =>
                    updateSettings({ theme: { theme_text_color: null } })
                  }
                  className="text-muted-foreground hover:text-foreground text-[9px] transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-muted-foreground px-1 text-[10px] font-medium uppercase">
                Border
              </label>
              <div className="flex gap-1.5">
                <input
                  type="color"
                  value={settings.theme.theme_border_color ?? "#e2e8f0"}
                  onChange={(e) =>
                    updateSettings({
                      theme: { theme_border_color: e.target.value },
                    })
                  }
                  className="h-7 w-7 cursor-pointer overflow-hidden rounded-md border-0 p-0 shadow-sm"
                />
                <button
                  onClick={() =>
                    updateSettings({ theme: { theme_border_color: null } })
                  }
                  className="text-muted-foreground hover:text-foreground text-[9px] transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Button Styling */}
        <div className="border-border/50 mt-4 space-y-4 border-t pt-4">
          <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
            Global Buttons
          </h3>
          <SidebarSlider
            label="Button Radius"
            value={settings.styling.button.radius ?? 12}
            onChange={(v) =>
              updateSettings({ styling: { button: { radius: v } } })
            }
            min={0}
            max={32}
            unit="px"
          />
          <SidebarSlider
            label="Shadow Intensity"
            value={settings.styling.button.shadow_intensity ?? 10}
            onChange={(v) =>
              updateSettings({ styling: { button: { shadow_intensity: v } } })
            }
            min={0}
            max={100}
            unit="%"
          />
          <SidebarSlider
            label="Anim Speed"
            value={settings.styling.button.transition_speed ?? 200}
            onChange={(v) =>
              updateSettings({ styling: { button: { transition_speed: v } } })
            }
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
                  theme_primary_color: DEFAULT_SETTINGS.theme.theme_primary_color,
                  theme_radius: DEFAULT_SETTINGS.theme.theme_radius,
                  theme_preset: DEFAULT_SETTINGS.theme.theme_preset,
                  theme_background_color: DEFAULT_SETTINGS.theme.theme_background_color,
                  theme_card_color: DEFAULT_SETTINGS.theme.theme_card_color,
                  theme_text_color: DEFAULT_SETTINGS.theme.theme_text_color,
                  theme_border_color: DEFAULT_SETTINGS.theme.theme_border_color,
                },
                styling: {
                  button: {
                    radius: DEFAULT_SETTINGS.styling.button.radius,
                    shadow_intensity: DEFAULT_SETTINGS.styling.button.shadow_intensity,
                    transition_speed: DEFAULT_SETTINGS.styling.button.transition_speed,
                  },
                },
              });
              setPreviewZoom(16);
            }}
            className="text-muted-foreground hover:text-foreground w-full rounded-lg border border-dashed py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors"
          >
            Reset Globals
          </button>
        </div>
      </div>

      {/* Render Modal */}
      <ThemeExplorerModal
        isOpen={showExplorer}
        onClose={() => setShowExplorer(false)}
        settings={settings}
        updateSettings={updateSettings}
      />
    </div>
  );
}
