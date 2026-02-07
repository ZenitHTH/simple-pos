"use client";

export default function GlobalScaleControls({ value, onChange }: { value: number, onChange: (val: number) => void }) {
    return (
        <div className="flex-1 space-y-2 border-r border-border pr-8">
            <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Global Font Size</span>
                <span className="text-primary font-mono">{value.toFixed(0)}%</span>
            </div>
            <input
                type="range" min="75" max="125" step="1"
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
        </div>
    );
}
