"use client";

interface RangeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export default function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}: RangeSliderProps) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="bg-secondary accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 [&::-webkit-slider-thumb]:bg-primary h-2 w-full cursor-pointer appearance-none rounded-lg [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full"
    />
  );
}
