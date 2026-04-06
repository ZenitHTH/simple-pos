import * as React from "react";
import { cn } from "@/lib";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        style={{
          "--scale": "var(--button-scale, 1)",
          "--font-scale": "var(--button-font-scale, 1)",
        } as React.CSSProperties}
        className={cn(
          "focus-visible:ring-ring inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
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
            "h-[calc(2.75rem*var(--scale))] px-[calc(1.5rem*var(--scale))] py-2 text-[calc(0.875rem*var(--font-scale))]":
              size === "default",
            "h-[calc(2.25rem*var(--scale))] rounded-lg px-[calc(1rem*var(--scale))] text-[calc(0.75rem*var(--font-scale))]":
              size === "sm",
            "h-[calc(3rem*var(--scale))] rounded-xl px-[calc(2.5rem*var(--scale))] text-[calc(1rem*var(--font-scale))]":
              size === "lg",
            "h-[calc(2.75rem*var(--scale))] w-[calc(2.75rem*var(--scale))]":
              size === "icon",
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
