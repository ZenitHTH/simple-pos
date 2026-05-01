"use client";

import { useState, useEffect, useRef } from "react";
import RangeSlider from "./RangeSlider";

/**
 * Props for the NumberSlider component.
 * @interface NumberSliderProps
 */
interface NumberSliderProps {
  /** The current numeric value. */
  value: number;
  /** Callback triggered when the value changes. */
  onChange: (value: number) => void;
  /** Minimum allowable value (default: 0). */
  min?: number;
  /** Maximum allowable value (default: 100). */
  max?: number;
  /** Step increment for the slider (default: 1). */
  step?: number;
  /** Unit string to display next to the value (e.g., "%", "px"). */
  unit?: string;
  /** Label to display above the slider. */
  label?: string;
}

/**
 * A composite slider component that displays a label, the current value with units,
 * and a range input for adjustment.
 *
 * @param {NumberSliderProps} props - The component props.
 */
export default function NumberSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "%",
  label,
}: NumberSliderProps) {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync internal state when external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleLocalChange = (newVal: number) => {
    setLocalValue(newVal);

    // Debounce external change to keep main thread and IPC channel clear
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange(newVal);
    }, 100);
  };

  return (
    <div className="space-y-2">
      {(label || unit) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-foreground font-semibold">{label}</span>
          )}
          <span className="text-primary font-mono">
            {localValue}
            {unit}
          </span>
        </div>
      )}
      <RangeSlider
        value={localValue}
        onChange={handleLocalChange}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}
