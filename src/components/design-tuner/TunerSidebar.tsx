"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FaPalette,
  FaFont,
  FaMousePointer,
  FaHandPointer,
  FaShoppingCart,
  FaThLarge,
  FaSlidersH,
  FaCalculator,
  FaHistory,
} from "react-icons/fa";
import { NavButton } from "./NavButton";
import { GlobalStylesPanel } from "./GlobalStylesPanel";
import { ThemePresetsPanel } from "./ThemePresetsPanel";
import { CartItemStylesPanel } from "./CartItemStylesPanel";
import { ButtonStylesPanel } from "./ButtonStylesPanel";
import { AppSettings } from "@/lib";
import GridItemSize from "@/components/design-mode/GridItemSize";
import BaseSidebarLayout from "@/components/layout/BaseSidebarLayout";

export type TunerTab =
  | "selector"
  | "button"
  | "typography"
  | "cart"
  | "grid"
  | "history"
  | "numpad";

interface TunerSidebarProps {
  activeTab: TunerTab;
  setActiveTab: (tab: TunerTab) => void;
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  // Local state for tuner's own preview zoom
  previewZoom: number;
  setPreviewZoom: (v: number) => void;
}

export function TunerSidebar({
  activeTab,
  setActiveTab,
  settings,
  updateSettings,
  previewZoom,
  setPreviewZoom,
}: TunerSidebarProps) {
  return (
    <BaseSidebarLayout
      title="Design Tuner"
      headerIcon={FaPalette}
      scale={settings.sidebar_scale}
      fontScale={settings.sidebar_font_scale}
      className="backdrop-blur-xl bg-card/60"
    >
      <div className="px-6 pb-6">
        {/* Navigation Group */}
        <div className="mb-6 space-y-1">
          <h3 className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/50">
            Tune Component
          </h3>
          <div className="space-y-1.5">
            <NavButton
              active={activeTab === "selector"}
              onClick={() => setActiveTab("selector")}
              icon={<FaMousePointer className="text-sm" />}
              label="Selector"
            />
            <NavButton
              active={activeTab === "button"}
              onClick={() => setActiveTab("button")}
              icon={<FaHandPointer className="text-sm rotate-45" />}
              label="Buttons"
            />
            <NavButton
              active={activeTab === "typography"}
              onClick={() => setActiveTab("typography")}
              icon={<FaFont className="text-sm" />}
              label="Typography"
            />
            <NavButton
              active={activeTab === "cart"}
              onClick={() => setActiveTab("cart")}
              icon={<FaShoppingCart className="text-sm" />}
              label="Cart Item"
            />
            <NavButton
              active={activeTab === "grid"}
              onClick={() => setActiveTab("grid")}
              icon={<FaThLarge className="text-sm" />}
              label="Product Grid"
            />
            <NavButton
              active={activeTab === "numpad"}
              onClick={() => setActiveTab("numpad")}
              icon={<FaCalculator className="text-sm" />}
              label="Numpad"
            />
            <NavButton
              active={activeTab === "history"}
              onClick={() => setActiveTab("history")}
              icon={<FaHistory className="text-sm" />}
              label="History"
            />
          </div>
        </div>

        <div className="bg-border/50 h-px w-full shrink-0" />

        {/* Tuner Content Area */}
        <div
          className="mt-6 min-h-0 space-y-8 custom-scrollbar"
          data-lenis-prevent
        >
          {/* Dynamic Panel based on Active Tab */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {activeTab === "grid" && (
                <div className="bg-secondary/20 rounded-2xl border border-border/50 p-4 shadow-sm">
                  <GridItemSize
                    settings={settings}
                    onUpdate={updateSettings}
                  />
                </div>
              )}
              {activeTab === "cart" && (
                <CartItemStylesPanel
                  settings={settings}
                  updateSettings={updateSettings}
                />
              )}

              {activeTab === "button" && (
                <ButtonStylesPanel
                  settings={settings}
                  updateSettings={updateSettings}
                />
              )}
              
              {(activeTab === "selector" || activeTab === "typography") && (
                <div className="px-3 py-6 text-center">
                  <FaSlidersH className="mx-auto mb-3 text-muted-foreground/30 text-2xl" />
                  <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest leading-relaxed">
                    Interactive tuning<br/>on the right canvas
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Global Controls Always Visible but Grouped */}
          <div className="space-y-8 pt-4">
            <div className="bg-border/30 h-px w-full" />
            
            <div className="space-y-1">
              <h3 className="px-3 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/50">
                Theme Presets
              </h3>
              <ThemePresetsPanel
                settings={settings}
                updateSettings={updateSettings}
              />
            </div>

            <div className="space-y-1">
              <h3 className="px-3 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/50">
                Global Appearance
              </h3>
              <GlobalStylesPanel
                settings={settings}
                updateSettings={updateSettings}
                previewZoom={previewZoom}
                setPreviewZoom={setPreviewZoom}
              />
            </div>
          </div>
        </div>
      </div>
    </BaseSidebarLayout>
  );
}
