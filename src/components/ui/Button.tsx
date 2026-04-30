import * as React from "react";
import { cn } from "@/lib";

/**
 * Props for the Button component.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant.
   */
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  /**
   * Predefined sizes.
   */
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * A reusable button component that supports multiple variants and sizes.
 */
const Button = ({
  className,
  variant = "default",
  size = "default",
  ref,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
    return (
      <button
        className={cn(
          "focus-visible:ring-ring inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm":
              variant === "default",
            "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm":
              variant === "destructive",
            "border-input bg-background hover:bg-accent hover:text-accent-foreground border":
              variant === "outline",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80":
              variant === "secondary",
            "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
            "text-primary underline-offset-4 hover:underline":
              variant === "link",
            "h-11 px-6 py-2": size === "default",
            "h-9 rounded-lg px-4 text-xs": size === "sm",
            "h-12 rounded-xl px-10 text-base": size === "lg",
            "h-11 w-11": size === "icon",
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  };
Button.displayName = "Button";

export { Button };
