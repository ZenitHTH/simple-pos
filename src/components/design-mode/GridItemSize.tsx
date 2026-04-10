"use client";

import React from "react";
import { cn } from "@/lib";

interface GridItemSizeProps {
  currentValue: number;
  onChange: (val: number) => void;
  className?: string;
}

const levels = [
  { val: 50, label: "XS" },
  { val: 75, label: "S" },
  { val: 100, label: "M" },
  { val: 125, label: "L" },
  { val: 150, label: "XL" },
];

export default function GridItemSize({
  currentValue,
  onChange,
  className,
}: GridItemSizeProps) {
  const currentIndex = levels.findIndex((l) => l.val === currentValue);
  const safeIndex = currentIndex === -1 ? 2 : currentIndex;
  const currentLabel = levels[safeIndex].label;

  const handlePrev = () => {
    if (safeIndex > 0) onChange(levels[safeIndex - 1].val);
  };

  const handleNext = () => {
    if (safeIndex < levels.length - 1) onChange(levels[safeIndex + 1].val);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
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
  );
}
