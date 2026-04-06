"use client";

import { AppSettings } from "@/lib";

import NumberStepper from "@/components/ui/NumberStepper";
import NumberSlider from "@/components/ui/NumberSlider";

export default function ComponentScaleControls({
  selectedId,
  settings,
  updateSettings,
}: {
  selectedId: string | null;
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
}) {
  if (!selectedId) {
    return (
      <div className="text-muted flex h-full flex-1 flex-col items-center justify-center">
        <span className="font-medium">Select a component to resize</span>
        <span className="text-xs opacity-70">
          (Sidebar, Grid, Cart, or Tables)
        </span>
      </div>
    );
  }

  const currentValue =
    (settings[selectedId as keyof AppSettings] as number) || 100;
  const fontScaleKey =
    `${selectedId.replace("_scale", "")}_font_scale` as keyof AppSettings;
  const currentFontScale = (settings[fontScaleKey] as number) || 100;

  const label = getLabel(selectedId);
  const hasFontControl = [
    "sidebar_scale",
    "cart_scale",
    "grid_scale",
    "manage_table_scale",
    "category_table_scale",
    "setting_page_scale",
    "payment_modal_scale",
  ].includes(selectedId);

  return (
    <div className="flex flex-1 gap-8">
      {/* Layout Scale */}
      <div className="flex-1 space-y-2">
        {selectedId === "grid_scale" ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-foreground font-semibold">{label}</span>
              <span className="text-primary font-mono">
                {currentValue.toFixed(0)}%
              </span>
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
        <div className="border-border flex-1 space-y-2 border-l pl-8">
          <div className="flex items-center justify-between">
            <span className="text-foreground font-semibold">Font Size</span>
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

function GridScaleButtons({
  currentValue,
  onChange,
}: {
  currentValue: number;
  onChange: (val: number) => void;
}) {
  const levels = [
    { val: 50, label: "XS" },
    { val: 75, label: "S" },
    { val: 100, label: "M" },
    { val: 125, label: "L" },
    { val: 150, label: "XL" },
  ];

  return (
    <div className="flex gap-1">
      {levels.map(({ val, label }) => (
        <button
          key={val}
          onClick={() => onChange(val)}
          className={`flex-1 rounded-lg px-1 py-1.5 text-xs font-bold transition-all ${
            currentValue === val
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
    case "sidebar_scale":
      return "Sidebar Width";
    case "cart_scale":
      return "Cart Width";
    case "grid_scale":
      return "Grid Item Size";
    case "manage_table_scale":
      return "Product Table";
    case "category_table_scale":
      return "Category Table";
    case "setting_page_scale":
      return "Settings Page";
    case "payment_modal_scale":
      return "Modal Scale";
    default:
      return "Component Size";
  }
}
