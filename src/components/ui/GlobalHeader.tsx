"use client";

import { useSettings } from "@/context/settings/SettingsContext";
import SelectableOverlay from "@/components/design-mode/SelectableOverlay";

import { ComponentType } from "react";

/**
 * Props for the GlobalHeader component.
 */
interface GlobalHeaderProps {
  /** The main title of the page. */
  title: string;
  /** Optional subtitle text below the main title. */
  subtitle?: string;
  /** Optional React component (icon) to display next to the title. */
  icon?: ComponentType<{ className?: string }>;
  /** Optional elements to display on the right side of the header. */
  children?: React.ReactNode;
  /** Additional CSS classes. */
  className?: string;
}

/**
 * A shared header component used across different pages of the application.
 * 
 * @param title - The main title of the page.
 * @param subtitle - Optional subtitle text below the main title.
 * @param icon - Optional React component (icon) to display next to the title.
 * @param children - Optional elements to display on the right side of the header.
 * @param className - Additional CSS classes.
 */
export default function GlobalHeader({
  title,
  subtitle,
  icon: Icon,
  children,
  className = "",
}: GlobalHeaderProps) {
  const { settings } = useSettings();

  return (
    <header
      className={`relative flex shrink-0 flex-wrap items-center justify-between gap-4 transition-all duration-300 ${className}`}
      style={{ fontSize: `${settings.scaling.fonts.header || 100}%` }}
    >
      <SelectableOverlay id="header_font_scale" />
      <div className="flex-1">
        <h1
          className="text-foreground mb-1 flex items-center gap-2 text-2xl font-bold"
          style={{ fontSize: "1.5em" }}
        >
          {Icon && <Icon className="text-primary" />}
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-muted-foreground text-sm"
            style={{ fontSize: "0.875em" }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </header>
  );
}
