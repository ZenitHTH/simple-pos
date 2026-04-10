"use client";

import { useState, useEffect } from "react";
import { SelectorTuner } from "@/components/design-tuner/SelectorTuner";
import { ButtonTuner } from "@/components/design-tuner/ButtonTuner";
import { TypographyTuner } from "@/components/design-tuner/TypographyTuner";
import { CartItemTuner } from "@/components/design-tuner/CartItemTuner";
import { GridTuner } from "@/components/design-tuner/GridTuner";
import { SidebarTuner } from "@/components/design-tuner/SidebarTuner";
import { HistoryTuner } from "@/components/design-tuner/HistoryTuner";
import { NumpadTuner } from "@/components/design-tuner/NumpadTuner";
import { TunerSidebar, TunerTab } from "@/components/design-tuner/TunerSidebar";
import { useSettings } from "@/context/settings/SettingsContext";
import { FaSave, FaUndo } from "react-icons/fa";

export default function DesignTunerPage() {
  const [activeTab, setActiveTab] = useState<TunerTab>("selector");
  const { settings, updateSettings, save, resetToCheckpoint, setAutoSave } =
    useSettings();

  // Disable auto-save when entering this page
  useEffect(() => {
    setAutoSave(false);
    return () => setAutoSave(true);
  }, [setAutoSave]);

  // Local state for tuning preview zoom (doesn't affect actual app scale)
  const [previewZoom, setPreviewZoom] = useState(16);

  return (
    <div className="bg-zinc-950 text-foreground flex h-screen overflow-hidden antialiased selection:bg-primary/30">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <TunerSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        updateSettings={updateSettings}
        previewZoom={previewZoom}
        setPreviewZoom={setPreviewZoom}
      />

      {/* Main Content */}
      <div className="relative flex-1 overflow-hidden flex flex-col z-10">
        <div
          className="bg-zinc-900/50 flex-1 overflow-y-auto p-8 custom-scrollbar backdrop-blur-3xl"
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
            {activeTab === "grid" && (
              <GridTuner settings={settings} updateSettings={updateSettings} />
            )}
            {activeTab === "sidebar" && (
              <SidebarTuner settings={settings} updateSettings={updateSettings} />
            )}
            {activeTab === "numpad" && (
              <NumpadTuner settings={settings} updateSettings={updateSettings} />
            )}
            {activeTab === "history" && (
              <HistoryTuner settings={settings} updateSettings={updateSettings} />
            )}
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="border-white/10 bg-zinc-900/80 absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 rounded-3xl border px-8 py-5 shadow-2xl backdrop-blur-md transition-all hover:shadow-primary/20">
          <div className="flex flex-col pr-6 border-r border-white/10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              Design Mode
            </span>
            <span className="text-xs font-bold text-zinc-200">Changes apply live</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={resetToCheckpoint}
              className="flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-black transition-all hover:bg-zinc-800 text-zinc-400 hover:text-white active:scale-95"
            >
              <FaUndo className="text-xs" />
              Discard
            </button>
            <button
              onClick={() => save()}
              className="bg-primary text-primary-foreground flex items-center gap-3 rounded-2xl px-8 py-3 text-sm font-black shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/90 active:scale-95"
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
