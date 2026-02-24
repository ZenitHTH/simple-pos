import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { cn } from "@/lib";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  contentClassName?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  style,
  contentClassName,
}: ModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) setVisible(true);
    else setTimeout(() => setVisible(false), 200);
  }, [isOpen]);

  if (!visible && !isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-card text-card-foreground border-border w-full max-w-md transform overflow-hidden rounded-2xl border shadow-2xl ring-1 ring-black/10 transition-all duration-200 dark:ring-white/10",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0",
          className,
        )}
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-border bg-muted/20 flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl p-2 transition-all"
          >
            <FaTimes size={14} />
          </button>
        </div>
        <div className={cn("p-6", contentClassName)}>{children}</div>
      </div>
    </div>
  );
}
