"use client";

import { useState } from "react";
import { AppSettings, CustomPreset, DeepPartial } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { FaLayerGroup, FaCoffee, FaSave, FaTrash, FaPlus, FaPalette, FaExpand } from "react-icons/fa";
import { THEME_PRESETS } from "@/context/settings/constants";
import { useSettings } from "@/context/settings/SettingsContext";

interface ThemePresetsPanelProps {
  settings: AppSettings;
  updateSettings: (updates: DeepPartial<AppSettings>) => void;
  onOpenLibrary?: () => void;
}

export function ThemePresetsPanel({
  settings,
  updateSettings,
  onOpenLibrary,
}: ThemePresetsPanelProps) {
  const { commitHistory } = useSettings();
  const [newPresetName, setNewPresetName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const presets = [
    {
      id: "compact",
      label: "Compact",
      icon: <FaLayerGroup />,
      description: "Tight spacing for power users",
      values: THEME_PRESETS.compact,
    },
    {
      id: "cozy",
      label: "Cozy",
      icon: <FaCoffee />,
      description: "Comfortable touch targets",
      values: THEME_PRESETS.cozy,
    },
  ];

  const handleSavePreset = () => {
    if (!newPresetName.trim()) return;

    const newPreset: CustomPreset = {
      id: `custom-${Date.now()}`,
      name: newPresetName.trim(),
      theme: { ...settings.theme, theme_preset: "custom" },
      styling: { ...settings.styling },
      scaling: { ...settings.scaling },
    };

    updateSettings({
      custom_presets: [...(settings.custom_presets || []), newPreset],
      theme: { ...settings.theme, theme_preset: "custom" as any }
    });
    commitHistory();

    setNewPresetName("");
    setIsSaving(false);
  };

  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateSettings({
      custom_presets: settings.custom_presets.filter((p) => p.id !== id),
    });
  };

  return (
    <div className="px-2 pt-4 space-y-6">
      {/* Built-in Presets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-foreground/80 text-sm font-semibold">
            Built-in Presets
          </h2>
          {onOpenLibrary && (
            <button
              onClick={onOpenLibrary}
              className="text-muted-foreground hover:text-primary transition-colors"      
              title="Open full library"
            >
              <FaExpand size={14} />
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                updateSettings(preset.values);
                commitHistory();
              }}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3 text-left transition-all", 
                settings.theme.theme_preset === preset.id
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border bg-card/50 hover:bg-secondary/50"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  settings.theme.theme_preset === preset.id
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

      {/* Custom Presets */}
      <div className="border-t border-border/50 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-foreground/80 text-sm font-semibold">
            Custom Presets
          </h2>
          {!isSaving && (
            <button
              onClick={() => setIsSaving(true)}
              className="text-primary hover:text-primary/80 transition-colors"
              title="Save current as new preset"
            >
              <FaPlus size={14} />
            </button>
          )}
        </div>

        {isSaving && (
          <div className="mb-4 space-y-3 p-3 bg-muted/30 rounded-xl border border-dashed border-primary/30">
            <input
              type="text"
              placeholder="Preset Name..."
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleSavePreset}
                disabled={!newPresetName.trim()}
                className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FaSave /> Save
              </button>
              <button
                onClick={() => setIsSaving(false)}
                className="flex-1 bg-secondary text-muted-foreground rounded-lg py-2 text-[10px] font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-2">
          {settings.custom_presets?.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-border rounded-xl">
              <p className="text-[10px] text-muted-foreground italic">No custom presets yet</p>
            </div>
          ) : (
            settings.custom_presets?.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  updateSettings({
                    theme: { ...preset.theme, theme_preset: "custom" as any },
                    styling: preset.styling,
                    scaling: preset.scaling
                  });
                  commitHistory();
                }}
                className={cn(
                  "group flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                  settings.theme.theme_preset === "custom" && preset.name === preset.name // Simplistic check
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-card/50 hover:bg-secondary/50"
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  <FaPalette size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold truncate">{preset.name}</div>
                  <div className="text-[9px] text-muted-foreground uppercase tracking-tight">Custom Theme</div>
                </div>
                <button
                  onClick={(e) => handleDeletePreset(preset.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive transition-all"
                >
                  <FaTrash size={12} />
                </button>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

