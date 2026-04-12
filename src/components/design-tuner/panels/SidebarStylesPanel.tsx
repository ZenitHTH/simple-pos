"use client";

import { SidebarSlider } from "./SidebarSlider";
import { AppSettings, DeepPartial } from "@/lib";

interface SidebarStylesPanelProps {
  settings: AppSettings;
  updateSettings: (updates: DeepPartial<AppSettings>) => void;
}

export function SidebarStylesPanel({
  settings,
  updateSettings,
}: SidebarStylesPanelProps) {
  const handleReset = () => {
    updateSettings({
      styling: {
        sidebar: {
          icon_size: 20,
          item_spacing: 8,
          item_radius: 12,
          active_bg_opacity: 10,
        }
      },
      scaling: {
        fonts: {
          sidebar: 100
        }
      }
    });
  };

  return (
    <div className="border-border mt-6 border-t px-2 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <h2 className="text-foreground/80 mb-4 text-sm font-semibold">
        Sidebar Layout & Style
      </h2>
      <div className="space-y-6">
        <SidebarSlider
          label="Icon Size"
          value={settings.styling.sidebar.icon_size ?? 20}
          onChange={(v) => updateSettings({ styling: { sidebar: { icon_size: v } } })}
          min={12}
          max={32}
          unit="px"
        />
        <SidebarSlider
          label="Item Spacing"
          value={settings.styling.sidebar.item_spacing ?? 8}
          onChange={(v) => updateSettings({ styling: { sidebar: { item_spacing: v } } })}
          min={0}
          max={24}
          unit="px"
        />
        <SidebarSlider
          label="Corner Radius"
          value={settings.styling.sidebar.item_radius ?? 12}
          onChange={(v) => updateSettings({ styling: { sidebar: { item_radius: v } } })}
          min={0}
          max={24}
          unit="px"
        />
        <SidebarSlider
          label="Active Opacity"
          value={settings.styling.sidebar.active_bg_opacity ?? 10}
          onChange={(v) => updateSettings({ styling: { sidebar: { active_bg_opacity: v } } })}
          min={0}
          max={100}
          unit="%"
        />
        <SidebarSlider
          label="Font Size"
          value={settings.scaling.fonts.sidebar ?? 100}
          onChange={(v) => updateSettings({ scaling: { fonts: { sidebar: v } } })}
          min={50}
          max={150}
          unit="%"
        />

        <div className="pt-2">
          <button
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground w-full rounded-lg border border-dashed py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors"
          >
            Reset Sidebar Styles
          </button>
        </div>
      </div>
    </div>
  );
}
