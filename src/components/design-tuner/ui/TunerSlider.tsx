"use client";

import RangeSlider from "@/components/ui/RangeSlider";
import { cn } from "@/lib";
import { useSettings } from "@/context/settings/SettingsContext";

interface TunerSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  formatDisplay?: (v: number) => string;
  variant?: "default" | "compact"; // To handle slight visual differences if needed, default covers both
}

/**
 * TunerSlider Component
 * 
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
export function TunerSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  formatDisplay,
  variant = "default",
}: TunerSliderProps) {
  const { commitHistory } = useSettings();
  const display = formatDisplay
    ? formatDisplay(value)
    : `${value}${unit}`;

  return (
    <div className={cn("space-y-1.5", variant === "compact" && "py-1")}>
      <div className="flex items-center justify-between px-1">
        <label
          className={cn(
            "text-muted-foreground uppercase",
            variant === "compact"
              ? "text-[10px] font-black tracking-[0.1em]"
              : "text-xs font-semibold tracking-wider"
          )}
        >
          {label}
        </label>
        <span
          className={cn(
            "text-primary font-mono",
            variant === "compact"
              ? "bg-primary/10 rounded px-2 py-1 text-[10px] font-black border border-primary/20"
              : "text-xs font-bold"
          )}
        >
          {display}
        </span>
      </div>
      <div className="flex items-center h-8">
        <RangeSlider
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          onPointerDown={() => commitHistory()}
        />
      </div>
    </div>
  );
}
