"use client";

import { useMemo } from "react";

interface NumberStepperProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    formatValue?: (value: number) => string;
}

export default function NumberStepper({
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    formatValue
}: NumberStepperProps) {

    const displayValue = useMemo(() => {
        if (formatValue) return formatValue(value);
        return value.toString();
    }, [value, formatValue]);

    const handleDecrement = () => {
        onChange(Math.max(min, value - step));
    };

    const handleIncrement = () => {
        onChange(Math.min(max, value + step));
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleDecrement}
                className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={value <= min}
            >
                -
            </button>
            <span className="flex-1 text-center font-mono font-medium">{displayValue}</span>
            <button
                onClick={handleIncrement}
                className="w-8 h-8 rounded-lg bg-primary text-primary-foreground hover:bg-blue-600 flex items-center justify-center font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={value >= max}
            >
                +
            </button>
        </div>
    );
}
