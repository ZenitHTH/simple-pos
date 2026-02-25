"use client";

import { cn } from "@/lib";

interface PillOption<T> {
  label: string;
  value: T;
}

interface PillGroupProps<T> {
  value: T;
  options: PillOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  pillClassName?: string;
  activeClassName?: string;
  styleInActive?: (option: PillOption<T>) => React.CSSProperties;
}

export function PillGroup<T extends string | number>({
  value,
  options,
  onChange,
  className,
  pillClassName,
  activeClassName,
  styleInActive,
}: PillGroupProps<T>) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-lg px-2.5 py-1 text-xs transition-all",
            pillClassName,
            value === opt.value
              ? cn(
                  "bg-primary text-primary-foreground font-bold shadow-sm",
                  activeClassName,
                )
              : "bg-secondary text-secondary-foreground hover:bg-secondary/70",
          )}
          style={styleInActive ? styleInActive(opt) : undefined}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
