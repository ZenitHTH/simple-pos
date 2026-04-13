import * as React from "react";
import { cn } from "@/lib";

/**
 * Props for the TableActionButton component.
 */
interface TableActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The styling variant of the button. Defaults to "default". */
  variant?: "default" | "destructive";
  /** The icon to display inside the button. */
  icon: React.ReactNode;
}

/**
 * A reusable action button specifically designed for use within tables.
 * Provides hover effects and color schemes for common actions like editing or deleting.
 * 
 * @param props - The table action button props.
 * @returns A styled button for table actions.
 */
export function TableActionButton({
  className,
  variant = "default",
  icon,
  title,
  ...props
}: TableActionButtonProps) {
  return (
    <button
      title={title}
      className={cn(
        "rounded-lg p-2 transition-colors",
        {
          "text-muted-foreground hover:text-primary hover:bg-primary/10": variant === "default",
          "text-muted-foreground hover:text-destructive hover:bg-destructive/10": variant === "destructive",
        },
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
}
