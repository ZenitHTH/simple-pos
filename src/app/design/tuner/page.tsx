"use client";

import { useState } from "react";
import { SelectorTuner } from "@/components/design-tuner/SelectorTuner";
import { ButtonTuner } from "@/components/design-tuner/ButtonTuner";
import { TypographyTuner } from "@/components/design-tuner/TypographyTuner";
import { CartItemTuner } from "@/components/design-tuner/CartItemTuner";
import { TunerSidebar, TunerTab } from "@/components/design-tuner/TunerSidebar";
import { useSettings } from "@/context/SettingsContext";
import { FaSave, FaUndo } from "react-icons/fa";

export default function DesignTunerPage() {
  const [activeTab, setActiveTab] = useState<TunerTab>("selector");
  const { settings, updateSettings, save, resetToCheckpoint } = useSettings();

  // Local state for tuning preview zoom (doesn't affect actual app scale)
  const [previewZoom, setPreviewZoom] = useState(16);

  return (
    <div className="bg-background text-foreground flex h-screen overflow-hidden">
      <TunerSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        updateSettings={updateSettings}
        previewZoom={previewZoom}
        setPreviewZoom={setPreviewZoom}
      />

      {/* Main Content */}
      <div className="relative flex-1 overflow-hidden flex flex-col">
        <div
          className="bg-background/50 flex-1 overflow-y-auto p-8 custom-scrollbar"
          data-lenis-prevent
          style={{
            zoom: previewZoom / 16,
          }}
        >
          <div className="mx-auto max-w-4xl pb-24">
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

        {/* Global Action Bar */}
        <div className="border-border bg-card/80 absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 rounded-2xl border px-6 py-3 shadow-2xl backdrop-blur-md transition-all hover:shadow-primary/10">
          <div className="flex flex-col pr-4 border-r border-border">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Design Mode
            </span>
            <span className="text-xs font-medium">Changes apply live</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetToCheckpoint}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:bg-secondary text-muted-foreground hover:text-foreground"
            >
              <FaUndo className="text-xs" />
              Discard
            </button>
            <button
              onClick={() => save()}
              className="bg-primary text-primary-foreground flex items-center gap-2 rounded-xl px-6 py-2 text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/90 active:scale-95"
            >
              <FaSave className="text-xs" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
