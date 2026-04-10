"use client";

import { useMemo } from "react";
import { cn } from "@/lib";

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export default function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  formatValue,
  className,
}: NumberStepperProps) {
  const displayValue = useMemo(() => {
    if (formatValue) return formatValue(value);
    return value.toString();
  }, [value, formatValue]);

  const handleDecrement = () => onChange(Math.max(min, value - step));
  const handleIncrement = () => onChange(Math.min(max, value + step));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={handleDecrement}
        className="bg-secondary hover:bg-secondary/80 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={value <= min}
      >
        −
      </button>
      <div className="bg-muted/30 border-border flex h-12 min-w-16 flex-1 items-center justify-center rounded-xl border font-mono text-base font-bold">
        {displayValue}
      </div>
      <button
        onClick={handleIncrement}
        className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold shadow-md transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}
