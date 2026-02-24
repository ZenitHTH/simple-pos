"use client";

import { useMemo } from "react";

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (value: number) => string;
}

export default function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  formatValue,
}: NumberStepperProps) {
  const displayValue = useMemo(() => {
    if (formatValue) return formatValue(value);
    return value.toString();
  }, [value, formatValue]);

  const handleDecrement = () => {
    onChange(Math.max(min, value - step));
  };

  const handleIncrement = () => {
    onChange(Math.min(max, value + step));
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleDecrement}
        className="bg-secondary hover:bg-secondary/80 flex h-10 w-10 items-center justify-center rounded-lg font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        disabled={value <= min}
      >
        -
      </button>
      <span className="flex-1 text-center font-mono font-medium">
        {displayValue}
      </span>
      <button
        onClick={handleIncrement}
        className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-10 w-10 items-center justify-center rounded-lg font-bold shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}
