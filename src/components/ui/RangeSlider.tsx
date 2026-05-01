"use client";

/**
 * Props for the RangeSlider component.
 */
interface RangeSliderProps {
  /** The current value of the slider. */
  value: number;
  /** Callback function triggered when the slider value changes. */
  onChange: (value: number) => void;
  /** Optional callback function triggered when the user releases the slider thumb. */
  onPointerUp?: () => void;
  /** Optional callback function triggered when the user presses the slider thumb. */
  onPointerDown?: () => void;
  /** The minimum value of the slider. Defaults to 0. */
  min?: number;
  /** The maximum value of the slider. Defaults to 100. */
  max?: number;
  /** The step increment of the slider. Defaults to 1. */
  step?: number;
}

/**
 * A custom-styled range slider input component.
 * Features a touch-friendly thumb and uses primary/secondary theme colors.
 *
 * @param props - The range slider props.
 * @returns A styled range input element.
 */
export default function RangeSlider({
  value,
  onChange,
  onPointerUp,
  onPointerDown,
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
      onPointerUp={onPointerUp}
      onPointerDown={onPointerDown}
      className="bg-secondary accent-primary focus-visible:ring-primary/30 [&::-webkit-slider-thumb]:bg-primary h-2 w-full transform-gpu cursor-pointer appearance-none rounded-full focus-visible:ring-2 focus-visible:outline-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
    />
  );
}
