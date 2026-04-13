import * as React from "react";
import { cn } from "@/lib";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "primary-subtle";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "bg-primary text-primary-foreground": variant === "default",
          "bg-secondary text-secondary-foreground": variant === "secondary",
          "bg-destructive text-destructive-foreground": variant === "destructive",
          "text-foreground border border-input": variant === "outline",
          "bg-primary/10 text-primary": variant === "primary-subtle",
        },
        className
      )}
      {...props}
    />
  );
}
