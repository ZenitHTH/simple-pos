"use client";

import { TunerSlider } from "../ui/TunerSlider";
import { AppSettings, DeepPartial } from "@/lib";

interface HistoryStylesPanelProps {
  settings: AppSettings;
  updateSettings: (updates: DeepPartial<AppSettings>) => void;
}

/**
 * HistoryStylesPanel Component
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
export function HistoryStylesPanel({
  settings,
  updateSettings,
}: HistoryStylesPanelProps) {
  const handleReset = () => {
    updateSettings({
      scaling: {
        fonts: {
          header: 100,
          history: 100,
        },
      },
    });
  };

  return (
    <div className="border-border animate-in fade-in slide-in-from-top-2 mt-6 border-t px-2 pt-4 duration-300">
      <h2 className="text-foreground/80 mb-4 text-sm font-semibold">
        Typography Tuning
      </h2>
      <div className="space-y-6">
        <TunerSlider
          label="Header Size"
          value={settings.scaling.fonts.header ?? 100}
          onChange={(v) =>
            updateSettings({ scaling: { fonts: { header: v } } })
          }
          min={50}
          max={150}
          unit="%"
        />
        <TunerSlider
          label="Content Size"
          value={settings.scaling.fonts.history ?? 100}
          onChange={(v) =>
            updateSettings({ scaling: { fonts: { history: v } } })
          }
          min={50}
          max={150}
          unit="%"
        />

        <div className="pt-2">
          <button
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground w-full rounded-lg border border-dashed py-2 text-[10px] font-semibold tracking-wider uppercase transition-colors"
          >
            Reset History Styles
          </button>
        </div>
      </div>
    </div>
  );
}
