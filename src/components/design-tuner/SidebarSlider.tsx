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
    <div className="space-y-1.5">
      <div className="flex items-center justify-between px-0.5">
        <label className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
          {label}
        </label>
        <span className="text-primary bg-primary/10 rounded px-1.5 py-0.5 text-[10px] font-mono font-bold">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="accent-primary h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary transition-all hover:bg-secondary/80"
      />
    </div>
  );
}
