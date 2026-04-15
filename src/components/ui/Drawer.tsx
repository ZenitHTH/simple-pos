import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { cn } from "@/lib";

/**
 * Props for the Drawer component.
 * @interface DrawerProps
 * @property {boolean} isOpen - Whether the drawer is currently visible.
 * @property {() => void} onClose - Callback function to close the drawer.
 * @property {React.ReactNode} title - The title displayed in the drawer header.
 * @property {React.ReactNode} children - The content to be rendered inside the drawer.
 * @property {string} [className] - Optional CSS class for the drawer container.
 * @property {React.CSSProperties} [style] - Optional inline styles for the drawer container.
 */
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Drawer component that slides in from the right side of the screen.
 * Used for supplementary content, filters, or detail views.
 *
 * @param {DrawerProps} props - The component props.
 * @returns {JSX.Element | null} The rendered drawer or null if not visible.
 */
export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  className,
  style,
}: DrawerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) setVisible(true);
    else {
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible && !isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-card text-card-foreground border-border h-full w-full max-w-sm transform overflow-hidden border-l shadow-2xl ring-1 ring-black/10 transition-transform duration-300 ease-in-out dark:ring-white/10",
          isOpen ? "translate-x-0" : "translate-x-full",
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
        <div className="h-[calc(100%-65px)] overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
