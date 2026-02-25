"use client";

import { useState, useEffect } from "react";
import { SelectorTuner } from "@/components/design-tuner/SelectorTuner";
import { ButtonTuner } from "@/components/design-tuner/ButtonTuner";
import { TypographyTuner } from "@/components/design-tuner/TypographyTuner";
import { CartItemTuner } from "@/components/design-tuner/CartItemTuner";
import { TunerSidebar, TunerTab } from "@/components/design-tuner/TunerSidebar";
import { useSettings } from "@/context/SettingsContext";

export default function DesignTunerPage() {
  const [activeTab, setActiveTab] = useState<TunerTab>("selector");
  const { settings, updateSettings, save } = useSettings();

  // State for tuning variables
  const [radius, setRadius] = useState(0.5);
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [baseFontSize, setBaseFontSize] = useState(16);

  useEffect(() => {
    document.documentElement.style.setProperty("--radius", `${radius}rem`);
  }, [radius]);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", primaryColor);
  }, [primaryColor]);

  return (
    <div className="bg-background text-foreground flex h-screen overflow-hidden">
      <TunerSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        radius={radius}
        setRadius={setRadius}
        baseFontSize={baseFontSize}
        setBaseFontSize={setBaseFontSize}
        primaryColor={primaryColor}
        setPrimaryColor={setPrimaryColor}
        settings={settings}
        updateSettings={updateSettings}
      />

      {/* Main Content */}
      <div
        className="bg-background/50 flex-1 overflow-y-auto p-8"
        data-lenis-prevent
        style={{
          zoom: baseFontSize / 16,
        }}
      >
        <div className="mx-auto max-w-4xl">
          {activeTab === "selector" && <SelectorTuner />}
          {activeTab === "button" && <ButtonTuner />}
          {activeTab === "typography" && (
            <TypographyTuner
              settings={settings}
              updateSettings={updateSettings}
            />
          )}
          {activeTab === "cart" && (
            <CartItemTuner
              itemFontSize={settings.cart_item_font_size ?? 100}
              headerFontSize={settings.cart_item_header_font_size ?? 100}
              priceFontSize={settings.cart_item_price_font_size ?? 100}
              padding={settings.cart_item_padding ?? 10}
              margin={settings.cart_item_margin ?? 8}
            />
          )}
        </div>
      </div>

      {/* Save Changes Bar */}
      {activeTab === "typography" && (
        <div className="border-border bg-card fixed right-0 bottom-0 left-64 flex items-center justify-between border-t px-8 py-3 shadow-lg">
          <p className="text-muted-foreground text-xs">
            Typography changes are applied live. Save to persist across
            sessions.
          </p>
          <button
            onClick={save}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-5 py-2 text-sm font-semibold transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
