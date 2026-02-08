"use client";

import { AppSettings } from "@/lib/settings";

import NumberStepper from "@/app/components/ui/NumberStepper";
import NumberSlider from "@/app/components/ui/NumberSlider";

export default function ComponentScaleControls({ selectedId, settings, updateSettings }: { selectedId: string | null, settings: AppSettings, updateSettings: any }) {
    if (!selectedId) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-full text-muted">
                <span className="font-medium">Select a component to resize</span>
                <span className="text-xs opacity-70">(Sidebar, Grid, Cart, or Tables)</span>
            </div>
        );
    }

    const currentValue = settings[selectedId as keyof AppSettings] as number || 100;
    const fontScaleKey = `${selectedId.replace('_scale', '')}_font_scale` as keyof AppSettings;
    const currentFontScale = settings[fontScaleKey] as number || 100;

    const label = getLabel(selectedId);
    const hasFontControl = ['sidebar_scale', 'cart_scale', 'grid_scale', 'manage_table_scale', 'category_table_scale'].includes(selectedId);

    return (
        <div className="flex-1 flex gap-8">
            {/* Layout Scale */}
            <div className="flex-1 space-y-2">
                {selectedId === 'grid_scale' ? (
                    <>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-foreground">{label}</span>
                            <span className="text-primary font-mono">{currentValue.toFixed(0)}%</span>
                        </div>
                        <GridScaleButtons
                            currentValue={currentValue}
                            onChange={(val) => updateSettings({ grid_scale: val })}
                        />
                    </>
                ) : (
                    <NumberSlider
                        label={label}
                        min={50}
                        max={150}
                        step={1}
                        value={currentValue}
                        onChange={(val) => updateSettings({ [selectedId]: val })}
                    />
                )}
            </div>

            {/* Font Scale */}
            {hasFontControl && (
                <div className="flex-1 space-y-2 border-l border-border pl-8">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-foreground">Font Size</span>

                    </div>
                    <NumberStepper
                        min={75}
                        max={150}
                        step={5}
                        value={currentFontScale}
                        onChange={(val) => updateSettings({ [fontScaleKey]: val })}
                    />
                </div>
            )}
        </div>
    );
}

function GridScaleButtons({ currentValue, onChange }: { currentValue: number, onChange: (val: number) => void }) {
    const levels = [
        { val: 50, label: 'XS' },
        { val: 75, label: 'S' },
        { val: 100, label: 'M' },
        { val: 125, label: 'L' },
        { val: 150, label: 'XL' }
    ];

    return (
        <div className="flex gap-1">
            {levels.map(({ val, label }) => (
                <button
                    key={val}
                    onClick={() => onChange(val)}
                    className={`flex-1 py-1.5 px-1 rounded-lg text-xs font-bold transition-all ${currentValue === val
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

function getLabel(id: string) {
    switch (id) {
        case 'sidebar_scale': return 'Sidebar Width';
        case 'cart_scale': return 'Cart Width';
        case 'grid_scale': return 'Grid Item Size';
        case 'manage_table_scale': return 'Table Scale';
        case 'category_table_scale': return 'Table Scale';
        default: return 'Component Size';
    }
}
