"use client";

import { useState } from "react";
import { cn } from "@/lib";

// --- Types ---
interface TypographySettings {
  fontFamily: string;
  baseSize: number; // px (root font size)
  headingWeight: number; // 400–900
  bodyWeight: number; // 300–700
  lineHeight: number; // 1.0–2.5
  letterSpacing: number; // -0.05 to 0.15 em
}

interface TypographyTunerProps {
  baseFontSize?: number;
  setBaseFontSize?: (v: number) => void;
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
  baseFontSize = 16,
  setBaseFontSize,
}: TypographyTunerProps) {
  const [settings, setSettings] = useState<TypographySettings>({
    fontFamily: FONT_FAMILIES[0].value,
    baseSize: baseFontSize,
    headingWeight: 700,
    bodyWeight: 400,
    lineHeight: 1.6,
    letterSpacing: 0,
  });

  const update = (patch: Partial<TypographySettings>) => {
    setSettings((s) => {
      const next = { ...s, ...patch };
      // Sync with page-level base size if handler provided
      if (patch.baseSize !== undefined && setBaseFontSize) {
        setBaseFontSize(patch.baseSize);
      }
      return next;
    });
  };

  const previewStyle = {
    fontFamily: settings.fontFamily,
    lineHeight: settings.lineHeight,
    letterSpacing: `${settings.letterSpacing}em`,
    fontSize: `${settings.baseSize}px`,
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
      {/* Header */}
      <div>
        <h2 className="mb-1 text-3xl font-bold">Typography</h2>
        <p className="text-muted-foreground text-sm">
          Live-tune font family, sizes, weights, and spacing.
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
                  onClick={() => update({ fontFamily: f.value })}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    settings.fontFamily === f.value
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
            value={settings.baseSize}
            min={12}
            max={24}
            step={1}
            unit="px"
            onChange={(v) => update({ baseSize: v })}
          />

          {/* Heading Weight */}
          <div className="space-y-2">
            <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Heading Weight
            </label>
            <WeightPills
              value={settings.headingWeight}
              onChange={(v) => update({ headingWeight: v })}
              options={WEIGHT_OPTIONS.filter((o) => o.value >= 500)}
            />
          </div>

          {/* Body Weight */}
          <div className="space-y-2">
            <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Body Weight
            </label>
            <WeightPills
              value={settings.bodyWeight}
              onChange={(v) => update({ bodyWeight: v })}
              options={WEIGHT_OPTIONS.filter((o) => o.value <= 600)}
            />
          </div>

          {/* Line Height */}
          <SliderRow
            label="Line Height"
            value={settings.lineHeight}
            min={1.0}
            max={2.5}
            step={0.05}
            onChange={(v) => update({ lineHeight: v })}
            formatDisplay={(v) => v.toFixed(2)}
          />

          {/* Letter Spacing */}
          <SliderRow
            label="Letter Spacing"
            value={settings.letterSpacing}
            min={-0.05}
            max={0.15}
            step={0.005}
            unit="em"
            onChange={(v) =>
              update({ letterSpacing: parseFloat(v.toFixed(3)) })
            }
            formatDisplay={(v) =>
              v === 0 ? "0em" : `${v > 0 ? "+" : ""}${v.toFixed(3)}em`
            }
          />

          {/* Reset */}
          <button
            onClick={() =>
              update({
                fontFamily: FONT_FAMILIES[0].value,
                baseSize: 16,
                headingWeight: 700,
                bodyWeight: 400,
                lineHeight: 1.6,
                letterSpacing: 0,
              })
            }
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
              fontSize: `${settings.baseSize * 2.5}px`,
              fontWeight: settings.headingWeight,
            }}
            className="leading-tight tracking-tight"
          >
            Heading 1
          </div>

          <div
            style={{
              fontSize: `${settings.baseSize * 1.875}px`,
              fontWeight: settings.headingWeight,
            }}
          >
            Heading 2
          </div>

          <div
            style={{
              fontSize: `${settings.baseSize * 1.5}px`,
              fontWeight: settings.headingWeight,
            }}
          >
            Heading 3
          </div>

          <div className="border-border border-t pt-4">
            <p
              style={{
                fontWeight: settings.bodyWeight,
                fontSize: `${settings.baseSize}px`,
              }}
            >
              The quick brown fox jumps over the lazy dog. This is body text
              styled for readability at your current settings.
            </p>
          </div>

          <p
            className="text-muted-foreground"
            style={{
              fontSize: `${settings.baseSize * 0.875}px`,
              fontWeight: settings.bodyWeight,
            }}
          >
            Small text for captions, timestamps, or secondary info.
          </p>

          <div className="border-border bg-muted/30 mt-4 rounded-xl border p-3">
            <p
              className="font-mono text-xs"
              style={{ fontFamily: "ui-monospace, monospace" }}
            >
              family:{" "}
              {
                FONT_FAMILIES.find((f) => f.value === settings.fontFamily)
                  ?.label
              }
              {" · "}base: {settings.baseSize}px{" · "}
              h-weight: {settings.headingWeight}
              {" · "}
              lh: {settings.lineHeight.toFixed(2)}
              {" · "}
              ls:{" "}
              {settings.letterSpacing === 0
                ? "0"
                : `${settings.letterSpacing > 0 ? "+" : ""}${settings.letterSpacing.toFixed(3)}`}
              em
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
