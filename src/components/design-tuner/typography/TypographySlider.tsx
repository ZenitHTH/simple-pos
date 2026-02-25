"use client";

interface TypographySliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
  formatDisplay?: (v: number) => string;
}

export function TypographySlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  formatDisplay,
}: TypographySliderProps) {
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
