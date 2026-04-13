"use client";

import { AppSettings, DeepPartial } from "@/lib/types";
import { Select } from "@/components/ui/Select";
import { PillGroup } from "@/components/ui/PillGroup";
import { TunerSlider } from "../ui/TunerSlider";
import {
  FONT_FAMILIES,
  WEIGHT_OPTIONS,
  TYPOGRAPHY_DEFAULTS,
} from "@/lib/constants/typography";

interface TypographyControlsProps {
  settings: AppSettings;
  updateSettings: (updates: DeepPartial<AppSettings>) => void;
  fontFamily: string;
  baseSize: number;
  headingWeight: number;
  bodyWeight: number;
  lineHeight: number;
  letterSpacing: number;
}

/**
 * TypographyStylesPanel Component
 * 
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
export function TypographyStylesPanel({
  settings,
  updateSettings,
  fontFamily,
  baseSize,
  headingWeight,
  bodyWeight,
  lineHeight,
  letterSpacing,
}: TypographyControlsProps) {
  const handleReset = () => {
    updateSettings({
      typography: {
        font_family: TYPOGRAPHY_DEFAULTS.fontFamily,
        base_size: TYPOGRAPHY_DEFAULTS.baseSize,
        heading_weight: TYPOGRAPHY_DEFAULTS.headingWeight,
        body_weight: TYPOGRAPHY_DEFAULTS.bodyWeight,
        line_height: TYPOGRAPHY_DEFAULTS.lineHeight,
        letter_spacing: TYPOGRAPHY_DEFAULTS.letterSpacing,
      }
    });
  };

  return (
    <div className="border-border bg-card space-y-6 rounded-2xl border p-6 shadow-sm">
      <h3 className="text-base font-bold">Controls</h3>

      {/* Font Family */}
      <div className="space-y-2">
        <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Font Family
        </label>
        <Select
          value={fontFamily}
          onChange={(v) =>
            updateSettings({ typography: { font_family: v as string } })
          }
          options={FONT_FAMILIES}
          className="max-w-xs"
          placeholder="Select Font..."
        />
      </div>

      {/* Base Size */}
      <TunerSlider
        label="Base Size"
        value={baseSize}
        min={12}
        max={24}
        step={1}
        unit="px"
        onChange={(v) => updateSettings({ typography: { base_size: v } })}
      />

      {/* Heading Weight */}
      <div className="space-y-2">
        <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Heading Weight
        </label>
        <PillGroup
          value={headingWeight}
          onChange={(v) => updateSettings({ typography: { heading_weight: v } })}
          options={WEIGHT_OPTIONS.filter((o) => o.value >= 500)}
          styleInActive={(opt) => ({ fontWeight: opt.value })}
        />
      </div>

      {/* Body Weight */}
      <div className="space-y-2">
        <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Body Weight
        </label>
        <PillGroup
          value={bodyWeight}
          onChange={(v) => updateSettings({ typography: { body_weight: v } })}
          options={WEIGHT_OPTIONS.filter((o) => o.value <= 600)}
          styleInActive={(opt) => ({ fontWeight: opt.value })}
        />
      </div>

      {/* Line Height */}
      <TunerSlider
        label="Line Height"
        value={lineHeight}
        min={1.0}
        max={2.5}
        step={0.05}
        onChange={(v) => updateSettings({ typography: { line_height: v } })}
        formatDisplay={(v) => v.toFixed(2)}
      />

      {/* Letter Spacing */}
      <TunerSlider
        label="Letter Spacing"
        value={letterSpacing}
        min={-0.05}
        max={0.15}
        step={0.005}
        unit="em"
        onChange={(v) =>
          updateSettings({
            typography: { letter_spacing: parseFloat(v.toFixed(3)) },
          })
        }
        formatDisplay={(v) =>
          v === 0 ? "0em" : `${v > 0 ? "+" : ""}${v.toFixed(3)}em`
        }
      />

      {/* Reset */}
      <button
        onClick={handleReset}
        className="text-muted-foreground hover:text-foreground w-full rounded-xl border border-dashed py-2 text-xs transition-colors"
      >
        Reset to defaults
      </button>
    </div>
  );
}
