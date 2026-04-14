"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

/** Supported types of toast notifications. */
export type ToastType = "success" | "error" | "info";

/**
 * Props for the Toast component.
 */
export interface ToastProps {
  /** Unique identifier for the toast. */
  id: string;
  /** The message to display. */
  message: string;
  /** The type of notification. Defaults to "info". */
  type?: ToastType;
  /** Auto-close duration in milliseconds. Defaults to 3000. */
  duration?: number;
  /** Callback triggered when the toast is closed. */
  onClose: (id: string) => void;
}

/**
 * A notification component that slides in and auto-closes.
 * Features different themes for success, error, and informational messages.
 * 
 * @param props - The toast props.
 * @returns A notification element.
 */
export const Toast = ({
  id,
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => handleClose(), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300);
  };

  const configs = {
    success: {
      icon: <FaCheckCircle size={16} />,
      bg: "bg-card/95 border-border",
      accent: "bg-success",
      text: "text-success",
    },
    error: {
      icon: <FaExclamationCircle size={16} />,
      bg: "bg-card/95 border-border",
      accent: "bg-destructive",
      text: "text-destructive",
    },
    info: {
      icon: <FaInfoCircle size={16} />,
      bg: "bg-card/95 border-border",
      accent: "bg-primary",
      text: "text-primary",
    },
  };

  const { icon, bg, accent, text } = configs[type];

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex max-w-md min-w-[300px] overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-300 ease-in-out",
        bg,
        isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100",
        "animate-in slide-in-from-right-full",
      )}
    >
      {/* Left accent bar */}
      <div className={cn("w-1 shrink-0", accent)} />

      <div className="flex flex-1 items-center gap-3 px-4 py-3.5">
        <span className={cn("shrink-0", text)}>{icon}</span>
        <p className="text-foreground flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={handleClose}
          className="text-muted-foreground hover:text-foreground shrink-0 rounded-lg p-1 transition-colors"
        >
          <FaTimes size={12} />
        </button>
      </div>
    </div>
  );
};
