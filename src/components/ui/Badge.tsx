import * as React from "react";
import { cn } from "@/lib";

/**
 * Props for the Badge component.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The visual style variant of the badge.
   */
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "primary-subtle";
}

/**
 * A small status indicator or tag.
 *
 * @param className - Additional CSS classes.
 * @param variant - Visual variant (default, secondary, destructive, etc.).
 * @param props - Other standard span attributes.
 */
export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "focus:ring-ring inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none",
        {
          "bg-primary text-primary-foreground": variant === "default",
          "bg-secondary text-secondary-foreground": variant === "secondary",
          "bg-destructive text-destructive-foreground":
            variant === "destructive",
          "text-foreground border-input border": variant === "outline",
          "bg-primary/10 text-primary": variant === "primary-subtle",
        },
        className,
      )}
      {...props}
    />
  );
}
