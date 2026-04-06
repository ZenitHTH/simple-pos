"use client";

import RangeSlider from "./RangeSlider";

interface NumberSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  label?: string;
}

export default function NumberSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "%",
  label,
}: NumberSliderProps) {
  return (
    <div className="space-y-2">
      {(label || unit) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-foreground font-semibold">{label}</span>
          )}
          <span className="text-primary font-mono">
            {value}
            {unit}
          </span>
        </div>
      )}
      <RangeSlider
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}
