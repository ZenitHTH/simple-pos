"use client";

import { TunerSlider } from "../ui/TunerSlider";
import { AppSettings, DeepPartial } from "@/lib";

interface ButtonStylesPanelProps {
  settings: AppSettings;
  updateSettings: (updates: DeepPartial<AppSettings>) => void;
}

/**
 * ButtonStylesPanel Component
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
export function ButtonStylesPanel({
  settings,
  updateSettings,
}: ButtonStylesPanelProps) {
  const handleReset = () => {
    updateSettings({
      scaling: {
        components: { button: 100 },
        fonts: { button: 100 },
      },
    });
  };

  return (
    <div className="border-border animate-in fade-in slide-in-from-top-2 mt-6 border-t px-2 pt-4 duration-300">
      <h2 className="text-foreground/80 mb-4 text-sm font-semibold">
        Button Styles
      </h2>
      <div className="space-y-3">
        <TunerSlider
          label="Button Scale"
          value={settings.scaling.components.button ?? 100}
          onChange={(v) =>
            updateSettings({ scaling: { components: { button: v } } })
          }
          min={50}
          max={200}
          unit="%"
        />
        <TunerSlider
          label="Button Font Scale"
          value={settings.scaling.fonts.button ?? 100}
          onChange={(v) =>
            updateSettings({ scaling: { fonts: { button: v } } })
          }
          min={50}
          max={200}
          unit="%"
        />

        <div className="pt-2">
          <button
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground w-full rounded-lg border border-dashed py-2 text-[10px] font-semibold tracking-wider uppercase transition-colors"
          >
            Reset Button Styles
          </button>
        </div>
      </div>
    </div>
  );
}
