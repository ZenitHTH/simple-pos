"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast = ({
  id,
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300); // Wait for fade-out animation
  };

  const icons = {
    success: <FaCheckCircle className="text-success h-5 w-5" />,
    error: <FaExclamationCircle className="text-destructive h-5 w-5" />,
    info: <FaCheckCircle className="text-primary h-5 w-5" />,
  };

  const bgColors = {
    success: "bg-success/10 border-success/20",
    error: "bg-destructive/10 border-destructive/20",
    info: "bg-primary/10 border-primary/20",
  };

  return (
    <div
      className={cn(
        "flex max-w-md min-w-[300px] items-center gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out",
        bgColors[type],
        isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100",
        "animate-in slide-in-from-right-full",
      )}
    >
      <div className="shrink-0">{icons[type]}</div>
      <div className="text-foreground flex-1 text-sm font-medium">
        {message}
      </div>
      <button
        onClick={handleClose}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <FaTimes size={14} />
      </button>
    </div>
  );
};
