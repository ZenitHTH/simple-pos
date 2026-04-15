"use client";

import { cn } from "@/lib";

/**
 * Represents a single option in a PillGroup.
 * @interface PillOption
 * @template T
 */
interface PillOption<T> {
  /** The display label for the pill. */
  label: string;
  /** The internal value associated with this pill. */
  value: T;
}

/**
 * Props for the PillGroup component.
 * @interface PillGroupProps
 * @template T
 */
interface PillGroupProps<T> {
  /** The currently selected value. */
  value: T;
  /** Array of available pill options. */
  options: PillOption<T>[];
  /** Callback triggered when a pill is clicked. */
  onChange: (value: T) => void;
  /** Optional CSS class for the container. */
  className?: string;
  /** Optional CSS class for each individual pill button. */
  pillClassName?: string;
  /** Optional CSS class applied to the active pill. */
  activeClassName?: string;
  /** Optional function to apply dynamic styles to an active pill. */
  styleInActive?: (option: PillOption<T>) => React.CSSProperties;
}

/**
 * A group of toggle-button "pills" used for single-choice selection.
 * Often used for filtering or switching between small sets of options.
 *
 * @template T - The type of the value (string or number).
 * @param {PillGroupProps<T>} props - The component props.
 */
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
