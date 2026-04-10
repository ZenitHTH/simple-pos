"use client";

interface SidebarSliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
}

export function SidebarSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
}: SidebarSliderProps) {
  return (
    <div className="space-y-2 py-1">
      <div className="flex items-center justify-between px-1">
        <label className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.1em]">
          {label}
        </label>
        <span className="text-primary bg-primary/10 rounded px-2 py-1 text-[10px] font-mono font-black border border-primary/20">
          {value}{unit}
        </span>
      </div>
      <div className="relative flex items-center h-8">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="accent-primary h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary transition-all hover:bg-secondary/80 focus:ring-2 focus:ring-primary/30"
        />
      </div>
    </div>
  );
}
