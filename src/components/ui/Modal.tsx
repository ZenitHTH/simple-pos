import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import { cn } from "@/lib";

/**
 * Props for the Modal component.
 * @interface ModalProps
 */
interface ModalProps {
  /** Whether the modal is currently open. */
  isOpen: boolean;
  /** Callback triggered when the modal should close (e.g., clicking overlay or close button). */
  onClose: () => void;
  /** Title text or element displayed in the modal header. */
  title: React.ReactNode;
  /** Content to be rendered inside the modal body. */
  children: React.ReactNode;
  /** Optional CSS class for the modal container. */
  className?: string;
  /** Optional inline styles for the modal container. */
  style?: React.CSSProperties;
  /** Optional CSS class for the modal content area. */
  contentClassName?: string;
}

/**
 * A centered modal dialog component that renders into a portal at the end of the document body.
 * Supports a title, close button, and backdrop blur.
 *
 * @param {ModalProps} props - The component props.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  style,
  contentClassName,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) setVisible(true);
    else setTimeout(() => setVisible(false), 200);
  }, [isOpen]);

  if (!mounted) return null;
  if (!visible && !isOpen) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-card text-card-foreground border-border flex max-h-[90vh] w-full max-w-md transform flex-col rounded-2xl border shadow-2xl ring-1 ring-black/10 transition-[transform,opacity,box-shadow] duration-200 dark:ring-white/10",
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
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl p-2 transition-[background-color,color]"
          >
            <FaTimes size={14} />
          </button>
        </div>
        <div className={cn("flex-1 overflow-y-auto p-6", contentClassName)}>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
