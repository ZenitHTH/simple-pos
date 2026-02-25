"use client";

import { cn } from "@/lib";
import { AppSettings } from "@/lib/types";

// --- Types ---
interface TypographyTunerProps {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

// --- Font families available ---
const FONT_FAMILIES = [
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Geist", value: "Geist, sans-serif" },
  { label: "System UI", value: "system-ui, sans-serif" },
  { label: "Roboto", value: "'Roboto', sans-serif" },
  { label: "Mono", value: "ui-monospace, monospace" },
];

const WEIGHT_OPTIONS = [
  { label: "Thin", value: 100 },
  { label: "Light", value: 300 },
  { label: "Regular", value: 400 },
  { label: "Medium", value: 500 },
  { label: "Semibold", value: 600 },
  { label: "Bold", value: 700 },
  { label: "Extrabold", value: 800 },
  { label: "Black", value: 900 },
];

// --- Defaults (mirrors SettingsContext) ---
const DEFAULTS = {
  fontFamily: "Inter, sans-serif",
  baseSize: 16,
  headingWeight: 700,
  bodyWeight: 400,
  lineHeight: 1.6,
  letterSpacing: 0,
} as const;

// --- Sub-components ---
function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  formatDisplay,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
  formatDisplay?: (v: number) => string;
}) {
  const display = formatDisplay
    ? formatDisplay(value)
    : `${value}${unit ?? ""}`;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          {label}
        </label>
        <span className="text-primary font-mono text-xs font-bold">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="accent-primary h-2 w-full cursor-pointer"
      />
    </div>
  );
}

function WeightPills({
  value,
  onChange,
  options,
}: {
  value: number;
  onChange: (v: number) => void;
  options: { label: string; value: number }[];
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-lg px-2.5 py-1 text-xs transition-all",
            value === opt.value
              ? "bg-primary text-primary-foreground font-bold shadow-sm"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/70",
          )}
          style={{ fontWeight: opt.value }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// --- Main Component ---
export function TypographyTuner({
  settings,
  updateSettings,
}: TypographyTunerProps) {
  // Derive current values from settings with fallbacks
  const fontFamily = settings.typography_font_family ?? DEFAULTS.fontFamily;
  const baseSize = settings.typography_base_size ?? DEFAULTS.baseSize;
  const headingWeight =
    settings.typography_heading_weight ?? DEFAULTS.headingWeight;
  const bodyWeight = settings.typography_body_weight ?? DEFAULTS.bodyWeight;
  const lineHeight = settings.typography_line_height ?? DEFAULTS.lineHeight;
  const letterSpacing =
    settings.typography_letter_spacing ?? DEFAULTS.letterSpacing;

  const previewStyle = {
    fontFamily,
    lineHeight,
    letterSpacing: `${letterSpacing}em`,
    fontSize: `${baseSize}px`,
  };

  const handleReset = () => {
    updateSettings({
      typography_font_family: DEFAULTS.fontFamily,
      typography_base_size: DEFAULTS.baseSize,
      typography_heading_weight: DEFAULTS.headingWeight,
      typography_body_weight: DEFAULTS.bodyWeight,
      typography_line_height: DEFAULTS.lineHeight,
      typography_letter_spacing: DEFAULTS.letterSpacing,
    });
  };

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
        {/* ── Controls Panel ── */}
        <div className="border-border bg-card space-y-6 rounded-2xl border p-6 shadow-sm">
          <h3 className="text-base font-bold">Controls</h3>

          {/* Font Family */}
          <div className="space-y-2">
            <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Font Family
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FONT_FAMILIES.map((f) => (
                <button
                  key={f.value}
                  onClick={() =>
                    updateSettings({ typography_font_family: f.value })
                  }
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    fontFamily === f.value
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/70",
                  )}
                  style={{ fontFamily: f.value }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Base Size */}
          <SliderRow
            label="Base Size"
            value={baseSize}
            min={12}
            max={24}
            step={1}
            unit="px"
            onChange={(v) => updateSettings({ typography_base_size: v })}
          />

          {/* Heading Weight */}
          <div className="space-y-2">
            <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Heading Weight
            </label>
            <WeightPills
              value={headingWeight}
              onChange={(v) => updateSettings({ typography_heading_weight: v })}
              options={WEIGHT_OPTIONS.filter((o) => o.value >= 500)}
            />
          </div>

          {/* Body Weight */}
          <div className="space-y-2">
            <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Body Weight
            </label>
            <WeightPills
              value={bodyWeight}
              onChange={(v) => updateSettings({ typography_body_weight: v })}
              options={WEIGHT_OPTIONS.filter((o) => o.value <= 600)}
            />
          </div>

          {/* Line Height */}
          <SliderRow
            label="Line Height"
            value={lineHeight}
            min={1.0}
            max={2.5}
            step={0.05}
            onChange={(v) => updateSettings({ typography_line_height: v })}
            formatDisplay={(v) => v.toFixed(2)}
          />

          {/* Letter Spacing */}
          <SliderRow
            label="Letter Spacing"
            value={letterSpacing}
            min={-0.05}
            max={0.15}
            step={0.005}
            unit="em"
            onChange={(v) =>
              updateSettings({
                typography_letter_spacing: parseFloat(v.toFixed(3)),
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

        {/* ── Live Preview Panel ── */}
        <div
          className="border-border bg-card space-y-5 rounded-2xl border p-6 shadow-sm"
          style={previewStyle}
        >
          <h3
            className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase"
            style={{ fontFamily: "inherit", fontWeight: 600 }}
          >
            Live Preview
          </h3>

          <div
            style={{
              fontSize: `${baseSize * 2.5}px`,
              fontWeight: headingWeight,
            }}
            className="leading-tight tracking-tight"
          >
            Heading 1
          </div>

          <div
            style={{
              fontSize: `${baseSize * 1.875}px`,
              fontWeight: headingWeight,
            }}
          >
            Heading 2
          </div>

          <div
            style={{
              fontSize: `${baseSize * 1.5}px`,
              fontWeight: headingWeight,
            }}
          >
            Heading 3
          </div>

          <div className="border-border border-t pt-4">
            <p
              style={{
                fontWeight: bodyWeight,
                fontSize: `${baseSize}px`,
              }}
            >
              The quick brown fox jumps over the lazy dog. This is body text
              styled for readability at your current settings.
            </p>
          </div>

          <p
            className="text-muted-foreground"
            style={{
              fontSize: `${baseSize * 0.875}px`,
              fontWeight: bodyWeight,
            }}
          >
            Small text for captions, timestamps, or secondary info.
          </p>

          <div className="border-border bg-muted/30 mt-4 rounded-xl border p-3">
            <p
              className="font-mono text-xs"
              style={{ fontFamily: "ui-monospace, monospace" }}
            >
              family: {FONT_FAMILIES.find((f) => f.value === fontFamily)?.label}
              {" · "}base: {baseSize}px{" · "}
              h-weight: {headingWeight}
              {" · "}
              lh: {lineHeight.toFixed(2)}
              {" · "}
              ls:{" "}
              {letterSpacing === 0
                ? "0"
                : `${letterSpacing > 0 ? "+" : ""}${letterSpacing.toFixed(3)}`}
              em
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
