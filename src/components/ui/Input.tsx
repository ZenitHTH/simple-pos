import React from "react";
import { cn } from "@/lib";

/**
 * Props for the Input component.
 * @interface InputProps
 * @extends {React.InputHTMLAttributes<HTMLInputElement>}
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional label text to display above the input. */
  label?: string;
  /** Optional error message to display below the input. */
  error?: string;
}

/**
 * Standard text input component with support for labels and error messages.
 * Styled to match the application's design system.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="text-foreground mb-1.5 block text-sm font-semibold">
            {label}
          </label>
        )}
        <input
          className={cn(
            "border-border bg-background placeholder:text-muted-foreground/60 focus-visible:ring-primary/50 flex h-11 w-full rounded-xl border px-3 py-2 text-sm transition-shadow file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive/50",
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-destructive mt-1.5 text-xs font-medium">{error}</p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
