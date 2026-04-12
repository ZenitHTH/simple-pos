"use client";

import { TunerSlider } from "../ui/TunerSlider";
import { AppSettings, DeepPartial } from "@/lib";
import { Select } from "@/components/ui/Select";

interface CartItemStylesPanelProps {
  settings: AppSettings;
  updateSettings: (updates: DeepPartial<AppSettings>) => void;
}

export function CartItemStylesPanel({
  settings,
  updateSettings,
}: CartItemStylesPanelProps) {
  const handleReset = () => {
    updateSettings({
      styling: {
        cart: {
          font_size: 100,
          header_font_size: 100,
          price_font_size: 100,
          padding: 10,
          margin: 8,
          image_size: 48,
          gap: 12,
          border_style: "solid",
          bg_opacity: 0,
        }
      }
    });
  };

  return (
    <div className="border-border mt-6 border-t px-2 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <h2 className="text-foreground/80 mb-4 text-sm font-semibold">
        Cart Item Styles
      </h2>
      <div className="space-y-4">
        <TunerSlider
          label="Font Size"
          value={settings.styling.cart.font_size ?? 100}
          onChange={(v) => updateSettings({ styling: { cart: { font_size: v } } })}
          min={50}
          max={200}
          unit="%"
        />
        <TunerSlider
          label="Header Font"
          value={settings.styling.cart.header_font_size ?? 100}
          onChange={(v) => updateSettings({ styling: { cart: { header_font_size: v } } })}
          min={50}
          max={200}
          unit="%"
        />
        <TunerSlider
          label="Price Font"
          value={settings.styling.cart.price_font_size ?? 100}
          onChange={(v) => updateSettings({ styling: { cart: { price_font_size: v } } })}
          min={50}
          max={200}
          unit="%"
        />
        <TunerSlider
          label="Padding"
          value={settings.styling.cart.padding ?? 10}
          onChange={(update) => updateSettings({ styling: { cart: { padding: update } } })}
          min={0}
          max={32}
          unit="px"
        />
        <TunerSlider
          label="Margin"
          value={settings.styling.cart.margin ?? 8}
          onChange={(v) => updateSettings({ styling: { cart: { margin: v } } })}
          min={0}
          max={24}
          unit="px"
        />
        <TunerSlider
          label="Image Size"
          value={settings.styling.cart.image_size ?? 48}
          onChange={(v) => updateSettings({ styling: { cart: { image_size: v } } })}
          min={32}
          max={96}
          unit="px"
        />
        <TunerSlider
          label="Inner Gap"
          value={settings.styling.cart.gap ?? 12}
          onChange={(v) => updateSettings({ styling: { cart: { gap: v } } })}
          min={0}
          max={24}
          unit="px"
        />

        <Select
          label="Border Style"
          value={settings.styling.cart.border_style ?? "solid"}
          onChange={(v) => updateSettings({ styling: { cart: { border_style: v as any } } })}
          options={[
            { value: "solid", label: "Solid" },
            { value: "dashed", label: "Dashed" },
            { value: "none", label: "None" },
          ]}
        />

        <TunerSlider
          label="Glass Opacity"
          value={settings.styling.cart.bg_opacity ?? 0}
          onChange={(v) => updateSettings({ styling: { cart: { bg_opacity: v } } })}
          min={0}
          max={100}
          unit="%"
        />

        <div className="pt-2">
          <button
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground w-full rounded-lg border border-dashed py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors"
          >
            Reset Cart Styles
          </button>
        </div>
      </div>
    </div>
  );
}
