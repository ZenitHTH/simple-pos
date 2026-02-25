import * as React from "react";
import { cn } from "@/lib";

const Switch = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> & { checked?: boolean }
>(({ className, checked, ...props }, ref) => (
  <button
    type="button"
    className={cn(
      "peer focus-visible:ring-ring focus-visible:ring-offset-background inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      checked
        ? "bg-primary ring-primary/30 ring-2 ring-offset-1"
        : "bg-input shadow-inner",
      className,
    )}
    ref={ref}
    role="switch"
    aria-checked={checked}
    {...props}
  >
    <span
      className={cn(
        "bg-background pointer-events-none block h-6 w-6 rounded-full shadow-md ring-0 transition-transform duration-300",
        checked ? "translate-x-5" : "translate-x-0",
      )}
    />
  </button>
));
Switch.displayName = "Switch";

export { Switch };
