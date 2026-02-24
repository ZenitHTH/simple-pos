import * as React from "react";
import { cn } from "@/lib";

const Switch = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> & { checked?: boolean }
>(({ className, checked, ...props }, ref) => (
  <button
    className={cn(
      "peer focus-visible:ring-ring focus-visible:ring-offset-background inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      checked ? "bg-primary" : "bg-input shadow-sm",
      className,
    )}
    ref={ref}
    role="switch"
    aria-checked={checked}
    {...props}
  >
    <span
      className={cn(
        "bg-background pointer-events-none block h-6 w-6 rounded-full shadow-lg ring-0 transition-transform",
        checked ? "translate-x-5" : "translate-x-0",
      )}
    />
  </button>
));
Switch.displayName = "Switch";

export { Switch };
