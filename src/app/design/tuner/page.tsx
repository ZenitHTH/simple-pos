"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SelectorTuner } from "@/components/design-tuner/tuners/SelectorTuner";
import { ButtonTuner } from "@/components/design-tuner/tuners/ButtonTuner";
import { TypographyTuner } from "@/components/design-tuner/tuners/TypographyTuner";
import { CartItemTuner } from "@/components/design-tuner/tuners/CartItemTuner";
import { GridTuner } from "@/components/design-tuner/tuners/GridTuner";
import { SidebarTuner } from "@/components/design-tuner/tuners/SidebarTuner";
import { HistoryTuner } from "@/components/design-tuner/tuners/HistoryTuner";
import { NumpadTuner } from "@/components/design-tuner/tuners/NumpadTuner";
import { GlobalTuner } from "@/components/design-tuner/tuners/GlobalTuner";
import { TunerSidebar } from "@/components/design-tuner/core/TunerSidebar";
import { TunerTab } from "@/lib";
import { useSettings } from "@/context/settings/SettingsContext";
import { FaSave, FaUndo } from "react-icons/fa";

export default function DesignTunerPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TunerTab>("global");
  const { settings, updateSettings, save, resetToCheckpoint, setAutoSave } =
    useSettings();

  // Disable auto-save when entering this page
  useEffect(() => {
    setAutoSave(false);
    return () => setAutoSave(true);
  }, [setAutoSave]);

  // Local state for tuning preview zoom (doesn't affect actual app scale)
  const [previewZoom, setPreviewZoom] = useState(16);

  const handleDiscard = async () => {
    await resetToCheckpoint();
    router.push("/");
  };

  const handleSave = async () => {
    await save();
    router.push("/");
  };

  return (
    <div className="bg-background text-foreground selection:bg-primary/30 flex h-screen overflow-hidden antialiased transition-colors duration-300">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="bg-primary/10 absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
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
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <div
          className="bg-card/50 custom-scrollbar flex-1 overflow-y-auto p-8 backdrop-blur-md"
          data-lenis-prevent
          style={{
            transform: `scale(${previewZoom / 16})`,
            transformOrigin: "top left",
            width: `calc(100% / (${previewZoom / 16}))`,
            height: `calc(100% / (${previewZoom / 16}))`,
            willChange: "transform",
          }}
        >
          <div className="mx-auto max-w-4xl pb-24">
            {activeTab === "global" && (
              <GlobalTuner
                settings={settings}
                updateSettings={updateSettings}
                previewZoom={previewZoom}
                setPreviewZoom={setPreviewZoom}
              />
            )}
            {activeTab === "selector" && <SelectorTuner />}
            {activeTab === "button" && (
              <ButtonTuner
                settings={settings}
                updateSettings={updateSettings}
              />
            )}
            {activeTab === "typography" && (
              <TypographyTuner
                settings={settings}
                updateSettings={updateSettings}
              />
            )}
            {activeTab === "cart" && (
              <CartItemTuner
                settings={settings}
                updateSettings={updateSettings}
              />
            )}
            {activeTab === "grid" && (
              <GridTuner settings={settings} updateSettings={updateSettings} />
            )}
            {activeTab === "sidebar" && (
              <SidebarTuner
                settings={settings}
                updateSettings={updateSettings}
              />
            )}
            {activeTab === "numpad" && (
              <NumpadTuner
                settings={settings}
                updateSettings={updateSettings}
              />
            )}
            {activeTab === "history" && (
              <HistoryTuner
                settings={settings}
                updateSettings={updateSettings}
              />
            )}
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="hover:shadow-primary/20 absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-6 rounded-3xl border border-white/10 bg-zinc-900/80 px-8 py-5 shadow-2xl backdrop-blur-md transition-all">
          <div className="flex flex-col border-r border-white/10 pr-6">
            <span className="text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase">
              Design Mode
            </span>
            <span className="text-xs font-bold text-zinc-200">
              Changes apply live
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleDiscard}
              className="flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-black text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white active:scale-95"
            >
              <FaUndo className="text-xs" />
              Discard
            </button>
            <button
              onClick={handleSave}
              className="bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 flex items-center gap-3 rounded-2xl px-8 py-3 text-sm font-black shadow-lg transition-all hover:scale-105 active:scale-95"
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
