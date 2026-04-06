"use client";

import React from "react";
import { cn } from "@/lib";
import { FaTableColumns, FaRotateLeft } from "react-icons/fa6";

interface DualColumnTunerProps {
  split: number;
  onSplitChange: (v: number) => void;
  defaultSplit?: number;
}

const PRESETS = [
  { label: "25/75", value: 25 },
  { label: "50/50", value: 50 },
  { label: "75/25", value: 75 },
];

export default function DualColumnTuner({
  split,
  onSplitChange,
  defaultSplit = 50,
}: DualColumnTunerProps) {
  const left = Math.round(split);
  const right = 100 - left;

  return (
    <div className="flex items-center gap-6">
      {/* Icon + Label */}
      <div className="text-muted-foreground flex items-center gap-2">
        <FaTableColumns size={15} />
        <span className="text-xs font-bold tracking-wider uppercase">
          Column Split
        </span>
      </div>

      {/* Slider */}
      <div className="flex min-w-[180px] flex-col gap-1.5">
        <input
          type="range"
          min={20}
          max={80}
          step={1}
          value={split}
          onChange={(e) => onSplitChange(Number(e.target.value))}
          className="accent-primary h-2 w-full cursor-pointer rounded-full"
        />
        <div className="text-muted-foreground flex justify-between font-mono text-[10px]">
          <span className="text-primary font-bold">{left}%</span>
          <span>/</span>
          <span className="font-bold">{right}%</span>
        </div>
      </div>

      {/* Snap Presets */}
      <div className="flex gap-1">
        {PRESETS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => onSplitChange(value)}
            className={cn(
              "rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all",
              split === value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/70",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Reset */}
      <button
        onClick={() => onSplitChange(defaultSplit)}
        disabled={split === defaultSplit}
        className="text-muted-foreground hover:text-foreground rounded-lg p-1.5 transition-all disabled:opacity-30"
        title="Reset to default"
      >
        <FaRotateLeft size={13} />
      </button>
    </div>
  );
}
