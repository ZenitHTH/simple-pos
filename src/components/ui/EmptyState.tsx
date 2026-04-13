import * as React from "react";
import { cn } from "@/lib";
import { FaBoxOpen } from "react-icons/fa";

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * A component that displays a message and optional icon when a collection or state is empty.
 * 
 * @param message - The text message to display.
 * @param icon - Optional React node (icon) to display above the message.
 * @param className - Additional CSS classes for custom styling.
 */
export function EmptyState({ message, icon, className }: EmptyStateProps) {
  return (
    <div className={cn("text-muted-foreground flex flex-col items-center justify-center p-8 text-center gap-3", className)}>
      {icon ? (
        <div className="text-muted-foreground/30 text-5xl mb-2">{icon}</div>
      ) : (
        <FaBoxOpen className="text-muted-foreground/20 text-5xl mb-2" />
      )}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
