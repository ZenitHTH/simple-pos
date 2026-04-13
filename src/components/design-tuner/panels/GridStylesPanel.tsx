"use client";

import React from "react";
import { cn } from "@/lib";
import { TunerSlider } from "../ui/TunerSlider";
import { AppSettings, DeepPartial } from "@/lib";

interface GridStylesPanelProps {
  settings: AppSettings;
  onUpdate: (updates: DeepPartial<AppSettings>) => void;
  className?: string;
}

const levels = [
  { val: 50, label: "XS" },
  { val: 75, label: "S" },
  { val: 100, label: "M" },
  { val: 125, label: "L" },
  { val: 150, label: "XL" },
];

/**
 * GridStylesPanel Component
 * 
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
export function GridStylesPanel({
  settings,
  onUpdate,
  className,
}: GridStylesPanelProps) {
  const currentValue = settings.scaling.components.grid || 100;
  const currentIndex = levels.findIndex((l) => l.val === currentValue);
  const safeIndex = currentIndex === -1 ? 2 : currentIndex;
  const currentLabel = levels[safeIndex].label;

  const handlePrev = () => {
    if (safeIndex > 0) onUpdate({ scaling: { components: { grid: levels[safeIndex - 1].val } } });
  };

  const handleNext = () => {
    if (safeIndex < levels.length - 1) onUpdate({ scaling: { components: { grid: levels[safeIndex + 1].val } } });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Grid Item Size
          </span>
          <span className="text-primary font-mono text-xs font-bold">
            {currentValue}%
          </span>
        </div>
        
        <div className="flex items-center gap-3 p-1.5 bg-muted/30 rounded-2xl border border-border/50">
          <button
            onClick={handlePrev}
            disabled={safeIndex === 0}
            className="h-16 w-16 flex items-center justify-center rounded-xl bg-secondary/40 text-2xl font-black transition-all active:scale-90 disabled:opacity-20 disabled:pointer-events-none hover:bg-secondary/60"
          >
            −
          </button>
          
          <div className="flex-1 h-16 flex flex-col items-center justify-center bg-background/50 rounded-xl border border-border/30 shadow-inner">
            <span className="text-xl font-black tracking-tighter text-foreground">
              {currentLabel}
            </span>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-50">
              Size
            </span>
          </div>

          <button
            onClick={handleNext}
            disabled={safeIndex === levels.length - 1}
            className="h-16 w-16 flex items-center justify-center rounded-xl bg-primary text-primary-foreground text-2xl font-black shadow-lg shadow-primary/20 transition-all active:scale-90 disabled:opacity-20 disabled:pointer-events-none hover:brightness-110"
          >
            +
          </button>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border/50">
        <TunerSlider
          label="Padding"
          value={settings.styling.grid.item_padding ?? 16}
          onChange={(v) => onUpdate({ styling: { grid: { item_padding: v } } })}
          min={0}
          max={40}
          unit="px"
        />
        <TunerSlider
          label="Corner Radius"
          value={settings.styling.grid.item_radius ?? 24}
          onChange={(v) => onUpdate({ styling: { grid: { item_radius: v } } })}
          min={0}
          max={60}
          unit="px"
        />
        <TunerSlider
          label="Name Size"
          value={settings.styling.grid.item_title_font_size ?? 100}
          onChange={(v) => onUpdate({ styling: { grid: { item_title_font_size: v } } })}
          min={50}
          max={200}
          unit="%"
        />
        <TunerSlider
          label="Price Size"
          value={settings.styling.grid.item_price_font_size ?? 100}
          onChange={(v) => onUpdate({ styling: { grid: { item_price_font_size: v } } })}
          min={50}
          max={200}
          unit="%"
        />
        <TunerSlider
          label="Grid Spacing"
          value={settings.styling.grid.gap ?? 20}
          onChange={(v) => onUpdate({ styling: { grid: { gap: v } } })}
          min={0}
          max={60}
          unit="px"
        />
        <TunerSlider
          label="Shadow Depth"
          value={settings.styling.grid.item_shadow ?? 10}
          onChange={(v) => onUpdate({ styling: { grid: { item_shadow: v } } })}
          min={0}
          max={100}
          unit="%"
        />
        <TunerSlider
          label="Border Width"
          value={settings.styling.grid.item_border_width ?? 1}
          onChange={(v) => onUpdate({ styling: { grid: { item_border_width: v } } })}
          min={0}
          max={8}
          unit="px"
        />
        <TunerSlider
          label="Hover Pop"
          value={settings.styling.grid.item_hover_scale ?? 102}
          onChange={(v) => onUpdate({ styling: { grid: { item_hover_scale: v } } })}
          min={100}
          max={115}
          step={0.5}
          unit="%"
        />
        <TunerSlider
          label="Glass Opacity"
          value={settings.styling.grid.item_bg_opacity ?? 100}
          onChange={(v) => onUpdate({ styling: { grid: { item_bg_opacity: v } } })}
          min={0}
          max={100}
          unit="%"
        />

        <div className="pt-2">
          <button
            onClick={() => onUpdate({
              styling: {
                grid: {
                  item_padding: 16,
                  item_radius: 24,
                  item_title_font_size: 100,
                  item_price_font_size: 100,
                  gap: 20,
                  item_shadow: 10,
                  item_border_width: 1,
                  item_hover_scale: 102,
                  item_bg_opacity: 100,
                }
              },
              scaling: {
                components: {
                  grid: 100
                },
                fonts: {
                  grid: 100
                }
              }
            })}
            className="text-muted-foreground hover:text-foreground w-full rounded-lg border border-dashed py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors"
          >
            Reset Grid Styles
          </button>
        </div>
      </div>
    </div>
  );
}
