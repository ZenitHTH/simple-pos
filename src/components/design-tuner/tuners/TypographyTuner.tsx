"use client";

import { AppSettings, DeepPartial } from "@/lib/types";
import { TYPOGRAPHY_DEFAULTS } from "@/lib/constants/typography";
import { TypographyStylesPanel } from "../panels/TypographyStylesPanel";
import { TypographyPreview } from "../previews/TypographyPreview";

interface TypographyTunerProps {
  settings: AppSettings;
  updateSettings: (updates: DeepPartial<AppSettings>) => void;
}

export function TypographyTuner({
  settings,
  updateSettings,
}: TypographyTunerProps) {
  // Derive current values from settings with fallbacks
  const fontFamily =
    settings.typography.font_family ?? TYPOGRAPHY_DEFAULTS.fontFamily;
  const baseSize =
    settings.typography.base_size ?? TYPOGRAPHY_DEFAULTS.baseSize;
  const headingWeight =
    settings.typography.heading_weight ?? TYPOGRAPHY_DEFAULTS.headingWeight;
  const bodyWeight =
    settings.typography.body_weight ?? TYPOGRAPHY_DEFAULTS.bodyWeight;
  const lineHeight =
    settings.typography.line_height ?? TYPOGRAPHY_DEFAULTS.lineHeight;
  const letterSpacing =
    settings.typography.letter_spacing ?? TYPOGRAPHY_DEFAULTS.letterSpacing;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
      {/* Header */}
      <div>
        <h2 className="mb-1 text-3xl font-bold">Typography</h2>
        <p className="text-muted-foreground text-sm">
          Live-tune font family, sizes, weights, and spacing. Changes apply
          globally. Click <strong>Save Changes</strong> to persist.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Controls Panel */}
        <TypographyStylesPanel
          settings={settings}
          updateSettings={updateSettings}
          fontFamily={fontFamily}
          baseSize={baseSize}
          headingWeight={headingWeight}
          bodyWeight={bodyWeight}
          lineHeight={lineHeight}
          letterSpacing={letterSpacing}
        />

        {/* Live Preview Panel */}
        <TypographyPreview
          fontFamily={fontFamily}
          baseSize={baseSize}
          headingWeight={headingWeight}
          bodyWeight={bodyWeight}
          lineHeight={lineHeight}
          letterSpacing={letterSpacing}
        />
      </div>
    </div>
  );
}
