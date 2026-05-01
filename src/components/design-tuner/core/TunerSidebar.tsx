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
  FaColumns,
} from "react-icons/fa";
import { NavButton } from "../ui/NavButton";
import { AppSettings, DeepPartial, TunerTab } from "@/lib";
import BaseSidebarLayout from "@/components/layout/BaseSidebarLayout";

interface TunerSidebarProps {
  activeTab: TunerTab;
  setActiveTab: (tab: TunerTab) => void;
  settings: AppSettings;
  updateSettings: (updates: DeepPartial<AppSettings>) => void;
  // Local state for tuner's own preview zoom
  previewZoom: number;
  setPreviewZoom: (v: number) => void;
}

/**
 * TunerSidebar Component
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
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
      scale={settings.scaling.components.sidebar}
      fontScale={settings.scaling.fonts.sidebar}
      className="bg-card/60 backdrop-blur-md"
      style={{ transform: "translateZ(0)" } as any}
    >
      <div className="px-6 pb-6">
        {/* Navigation Group */}
        <div className="mb-6 space-y-1">
          <h3 className="text-muted-foreground/50 mb-3 px-3 text-[10px] font-black tracking-[0.25em] uppercase">
            Tune Component
          </h3>
          <div className="space-y-1.5">
            <NavButton
              active={activeTab === "global"}
              onClick={() => setActiveTab("global")}
              icon={<FaPalette className="text-sm" />}
              label="Global & Theme"
            />
            <NavButton
              active={activeTab === "selector"}
              onClick={() => setActiveTab("selector")}
              icon={<FaMousePointer className="text-sm" />}
              label="Selector"
            />
            <NavButton
              active={activeTab === "button"}
              onClick={() => setActiveTab("button")}
              icon={<FaHandPointer className="rotate-45 text-sm" />}
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
              active={activeTab === "sidebar"}
              onClick={() => setActiveTab("sidebar")}
              icon={<FaColumns className="text-sm" />}
              label="Sidebar Layout"
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
          className="custom-scrollbar mt-6 min-h-0 space-y-8"
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
              {activeTab !== "global" && (
                <div className="px-3 py-6 text-center">
                  <FaSlidersH className="text-muted-foreground/30 mx-auto mb-3 text-2xl" />
                  <p className="text-muted-foreground/60 text-xs leading-relaxed font-bold tracking-widest uppercase">
                    Interactive tuning
                    <br />
                    on the right canvas
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </BaseSidebarLayout>
  );
}
