import * as React from "react";
import { cn } from "@/lib";
import { FaBoxOpen } from "react-icons/fa";

/**
 * Props for the EmptyState component.
 */
interface EmptyStateProps {
  /** The text message to display. */
  message: string;
  /** Optional React node (icon) to display above the message. */
  icon?: React.ReactNode;
  /** Additional CSS classes for custom styling. */
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
    <div
      className={cn(
        "text-muted-foreground flex flex-col items-center justify-center gap-3 p-8 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="text-muted-foreground/30 mb-2 text-5xl">{icon}</div>
      ) : (
        <FaBoxOpen className="text-muted-foreground/20 mb-2 text-5xl" />
      )}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
