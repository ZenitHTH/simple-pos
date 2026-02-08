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
    step = 1
}: RangeSliderProps) {
    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        />
    );
}
