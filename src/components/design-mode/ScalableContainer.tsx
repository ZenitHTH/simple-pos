"use client";

import { useSettings } from "@/context/SettingsContext";
import { AppSettings } from "@/lib";
import SelectableOverlay from "./SelectableOverlay";
import { ReactNode } from "react";

interface ScalableContainerProps {
  settingKey: keyof AppSettings;
  children: ReactNode;
  className?: string;
}

export default function ScalableContainer({
  settingKey,
  children,
  className = "",
}: ScalableContainerProps) {
  const { settings } = useSettings();

  // Dynamically get the scale values
  const scale = (settings[settingKey] as number) || 100;

  // Construct the font scale key dynamically
  // Assumes convention: "xxxx_scale" -> "xxxx_font_scale"
  const fontScaleKey =
    `${String(settingKey).replace("_scale", "")}_font_scale` as keyof AppSettings;
  const fontScale = (settings[fontScaleKey] as number) || 100;

  return (
    <div
      className={`group relative origin-top transition-transform duration-200 ease-out ${className}`}
      style={{
        transform: `scale(${scale / 100})`,
        marginBottom: `${(scale - 100) * 0.5}%`,
        fontSize: `${fontScale}%`,
      }}
    >
      <SelectableOverlay id={String(settingKey)} />
      {children}
    </div>
  );
}
