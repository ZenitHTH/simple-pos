import * as React from "react";
import { cn } from "@/lib";

interface TableActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive";
  icon: React.ReactNode;
}

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
