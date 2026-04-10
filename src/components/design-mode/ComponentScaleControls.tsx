"use client";

import { AppSettings } from "@/lib";

import NumberStepper from "@/components/ui/NumberStepper";
import NumberSlider from "@/components/ui/NumberSlider";
import GridItemSize from "./GridItemSize";

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
      <div className="text-muted flex h-full flex-1 flex-col items-center justify-center border-l border-border pl-8">
        <span className="text-xs font-black uppercase tracking-widest opacity-50">Select Component</span>
        <span className="text-[10px] opacity-40">Sidebar, Grid, Cart, or Tables</span>
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
    <div className="flex flex-1 gap-8 items-center border-l border-border pl-8">
      {/* Layout Scale */}
      <div className="flex-1">
        {selectedId === "grid_scale" ? (
          <GridItemSize
            currentValue={currentValue}
            onChange={(val) => updateSettings({ grid_scale: val })}
          />
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
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">FontSize</span>
            <span className="text-primary font-mono text-xs font-bold">
              {currentFontScale}%
            </span>
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
