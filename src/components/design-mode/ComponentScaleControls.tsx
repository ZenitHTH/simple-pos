"use client";

import { AppSettings, DeepPartial } from "@/lib";

import NumberStepper from "@/components/ui/NumberStepper";
import NumberSlider from "@/components/ui/NumberSlider";
import { GridStylesPanel } from "../design-tuner/panels/GridStylesPanel";

export default function ComponentScaleControls({
  selectedId,
  settings,
  updateSettings,
}: {
  selectedId: string | null;
  settings: AppSettings;
  updateSettings: (s: DeepPartial<AppSettings>) => void;
}) {
  if (!selectedId) {
    return (
      <div className="text-muted flex h-full flex-1 flex-col items-center justify-center border-l border-border pl-8">
        <span className="text-xs font-black uppercase tracking-widest opacity-50">Select Component</span>
        <span className="text-[10px] opacity-40">Sidebar, Grid, Cart, or Tables</span>
      </div>
    );
  }

  const getScaleValues = (id: string) => {
    switch (id) {
      case "sidebar_scale":
        return {
          scale: settings.scaling.components.sidebar,
          fontScale: settings.scaling.fonts.sidebar,
          fontKey: "sidebar_font_scale",
        };
      case "cart_scale":
        return {
          scale: settings.scaling.components.cart,
          fontScale: settings.styling.cart.font_size ?? 100,
          fontKey: "cart_font_scale",
        };
      case "grid_scale":
        return {
          scale: settings.scaling.components.grid,
          fontScale: settings.scaling.fonts.grid,
          fontKey: "grid_font_scale",
        };
      case "manage_table_scale":
        return {
          scale: settings.scaling.components.manage_table,
          fontScale: settings.scaling.fonts.manage_table,
          fontKey: "manage_table_font_scale",
        };
      case "category_table_scale":
        return {
          scale: settings.scaling.components.category_table,
          fontScale: settings.scaling.fonts.category_table,
          fontKey: "category_table_font_scale",
        };
      case "setting_page_scale":
        return {
          scale: settings.scaling.components.setting_page,
          fontScale: settings.scaling.fonts.setting_page,
          fontKey: "setting_page_font_scale",
        };
      case "payment_modal_scale":
        return {
          scale: settings.scaling.components.payment_modal,
          fontScale: settings.scaling.fonts.payment_modal,
          fontKey: "payment_modal_font_scale",
        };
      default:
        return { scale: 100, fontScale: 100, fontKey: null };
    }
  };

  const updateNestedScale = (id: string, val: number) => {
    switch (id) {
      case "sidebar_scale": updateSettings({ scaling: { components: { sidebar: val } } }); break;
      case "cart_scale": updateSettings({ scaling: { components: { cart: val } } }); break;
      case "grid_scale": updateSettings({ scaling: { components: { grid: val } } }); break;
      case "manage_table_scale": updateSettings({ scaling: { components: { manage_table: val } } }); break;
      case "category_table_scale": updateSettings({ scaling: { components: { category_table: val } } }); break;
      case "setting_page_scale": updateSettings({ scaling: { components: { setting_page: val } } }); break;
      case "payment_modal_scale": updateSettings({ scaling: { components: { payment_modal: val } } }); break;
    }
  };

  const updateNestedFontScale = (id: string, val: number) => {
    switch (id) {
      case "sidebar_scale": updateSettings({ scaling: { fonts: { sidebar: val } } }); break;
      case "cart_scale": updateSettings({ styling: { cart: { font_size: val } } }); break;
      case "grid_scale": updateSettings({ scaling: { fonts: { grid: val } } }); break;
      case "manage_table_scale": updateSettings({ scaling: { fonts: { manage_table: val } } }); break;
      case "category_table_scale": updateSettings({ scaling: { fonts: { category_table: val } } }); break;
      case "setting_page_scale": updateSettings({ scaling: { fonts: { setting_page: val } } }); break;
      case "payment_modal_scale": updateSettings({ scaling: { fonts: { payment_modal: val } } }); break;
    }
  };

  const { scale: currentValue, fontScale: currentFontScale } = getScaleValues(selectedId);

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
          <GridStylesPanel
            settings={settings}
            onUpdate={updateSettings}
          />
        ) : (
          <NumberSlider
            label={label}
            min={50}
            max={150}
            step={1}
            value={currentValue}
            onChange={(val) => updateNestedScale(selectedId, val)}
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
            onChange={(val) => updateNestedFontScale(selectedId, val)}
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
