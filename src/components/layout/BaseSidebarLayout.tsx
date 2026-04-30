"use client";

import { ReactNode } from "react";
import { IconType } from "react-icons";
import { FaTimes } from "react-icons/fa";
import { cn } from "@/lib";
import SelectableOverlay from "@/components/design-mode/SelectableOverlay";

import { useSettings } from "@/context/settings/SettingsContext";

interface BaseSidebarLayoutProps {
  children: ReactNode;
  title: string;
  headerIcon?: IconType;
  isOpen?: boolean;
  onClose?: () => void;
  scale?: number;
  fontScale?: number;
  className?: string;
  style?: React.CSSProperties;
  side?: "left" | "right";
  showMobileClose?: boolean;
}

/**
 * BaseSidebarLayout Component
 * 
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
export default function BaseSidebarLayout({
  children,
  title,
  headerIcon,
  isOpen,
  onClose,
  scale = 100,
  fontScale = 100,
  className = "",
  style: extraStyle,
  side = "left",
  showMobileClose = true,
}: BaseSidebarLayoutProps) {
  const { settings } = useSettings();
  
  // Calculate dynamic width (base 16rem = 256px)
  const baseWidth = 256;
  const dynamicWidth = `${baseWidth * (scale / 100)}px`;
  const buttonScale = (settings.scaling.components.button ?? 100) / 100;

  return (
    <aside
      style={{ 
        width: dynamicWidth,
        "--sidebar-button-scale": buttonScale,
        fontSize: `${fontScale}%`,
        ...extraStyle
      } as any}
      className={cn(
        "fixed inset-y-0 z-50 lg:static flex flex-col transition-transform duration-300 ease-in-out h-full transform-gpu",
        "bg-card text-card-foreground border-border border-r shadow-2xl lg:shadow-none",
        side === "left" ? "left-0" : "right-0 border-l border-r-0",
        isOpen ? "translate-x-0" : (side === "left" ? "-translate-x-full lg:translate-x-0" : "translate-x-full lg:translate-x-0"),
        className
      )}
    >
      <div className="flex items-center justify-between p-6 lg:block">
        <div className="flex items-center gap-2">
          {headerIcon && <headerIcon className="text-primary text-xl" />}
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        </div>
        {showMobileClose && onClose && (
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground p-2 transition-colors lg:hidden"
          >
            <FaTimes size={24} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-hidden">
        {children}
      </nav>

      <SelectableOverlay id="sidebar_scale" />
    </aside>
  );
}
