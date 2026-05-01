"use client";

import { TunerSlider } from "../ui/TunerSlider";
import { AppSettings, DeepPartial } from "@/lib";

interface NumpadStylesPanelProps {
  settings: AppSettings;
  updateSettings: (updates: DeepPartial<AppSettings>) => void;
}

/**
 * NumpadStylesPanel Component
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
export function NumpadStylesPanel({
  settings,
  updateSettings,
}: NumpadStylesPanelProps) {
  const handleReset = () => {
    updateSettings({
      styling: {
        payment: {
          numpad_scale: 100,
          numpad_font_scale: 100,
          numpad_display_font_scale: 100,
          numpad_button_height: 80,
          numpad_gap: 12,
        },
      },
    });
  };

  return (
    <div className="border-border animate-in fade-in slide-in-from-top-2 mt-6 border-t px-2 pt-4 duration-300">
      <h2 className="text-foreground/80 mb-4 text-sm font-semibold">
        Numpad Styling
      </h2>
      <div className="space-y-4">
        <TunerSlider
          label="Overall Scale"
          value={settings.styling.payment.numpad_scale ?? 100}
          onChange={(v) =>
            updateSettings({ styling: { payment: { numpad_scale: v } } })
          }
          min={50}
          max={150}
          unit="%"
        />

        <TunerSlider
          label="Button Font Scale"
          value={settings.styling.payment.numpad_font_scale ?? 100}
          onChange={(v) =>
            updateSettings({ styling: { payment: { numpad_font_scale: v } } })
          }
          min={50}
          max={200}
          unit="%"
        />

        <TunerSlider
          label="Display Font Scale"
          value={settings.styling.payment.numpad_display_font_scale ?? 100}
          onChange={(v) =>
            updateSettings({
              styling: { payment: { numpad_display_font_scale: v } },
            })
          }
          min={50}
          max={200}
          unit="%"
        />

        <TunerSlider
          label="Button Height"
          value={settings.styling.payment.numpad_button_height ?? 80}
          onChange={(v) =>
            updateSettings({
              styling: { payment: { numpad_button_height: v } },
            })
          }
          min={40}
          max={120}
          unit="px"
        />

        <TunerSlider
          label="Button Gap"
          value={settings.styling.payment.numpad_gap ?? 12}
          onChange={(v) =>
            updateSettings({ styling: { payment: { numpad_gap: v } } })
          }
          min={0}
          max={32}
          unit="px"
        />

        <div className="pt-2">
          <button
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground w-full rounded-lg border border-dashed py-2 text-[10px] font-semibold tracking-wider uppercase transition-colors"
          >
            Reset Numpad Styles
          </button>
        </div>
      </div>
    </div>
  );
}
