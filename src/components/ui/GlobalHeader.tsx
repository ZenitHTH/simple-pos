"use client";

import { useSettings } from "@/context/SettingsContext";

import { ComponentType } from "react";

interface GlobalHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ComponentType<{ className?: string }>;
  children?: React.ReactNode;
  className?: string;
}

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
      className={`flex shrink-0 flex-wrap items-center justify-between gap-4 transition-all duration-300 ${className}`}
      style={{ fontSize: `${settings.header_font_scale || 100}%` }}
    >
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
