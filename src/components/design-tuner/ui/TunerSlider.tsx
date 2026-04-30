"use client";

import { useState, useEffect, useRef } from "react";
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
  variant?: "default" | "compact"; 
}
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
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleLocalChange = (newVal: number) => {
    setLocalValue(newVal);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange(newVal);
    }, 100);
  };

  const display = formatDisplay
    ? formatDisplay(localValue)
    : `${localValue}${unit}`;

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
          value={localValue}
          min={min}
          max={max}
          step={step}
          onChange={handleLocalChange}
          onPointerDown={() => commitHistory()}
        />
      </div>
    </div>
  );
}

