"use client";

import {
  FaPalette,
  FaFont,
  FaMousePointer,
  FaShoppingCart,
} from "react-icons/fa";
import { NavButton } from "./NavButton";
import { GlobalStylesPanel } from "./GlobalStylesPanel";
import { ThemePresetsPanel } from "./ThemePresetsPanel";
import { CartItemStylesPanel } from "./CartItemStylesPanel";
import { ButtonStylesPanel } from "./ButtonStylesPanel";
import { AppSettings } from "@/lib";
import GlobalHeader from "@/components/ui/GlobalHeader";

export type TunerTab = "selector" | "button" | "typography" | "cart";

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
    <div className="border-border bg-card/60 flex h-full w-64 shrink-0 flex-col border-r p-4 backdrop-blur-md">
      <GlobalHeader
        title="Design Tuner"
        icon={FaPalette}
        className="mb-6 px-2"
      />
      <div className="space-y-1">
        <NavButton
          active={activeTab === "selector"}
          onClick={() => setActiveTab("selector")}
          icon={<FaMousePointer />}
          label="Selector"
        />
        <NavButton
          active={activeTab === "button"}
          onClick={() => setActiveTab("button")}
          icon={<FaMousePointer />}
          label="Buttons"
        />
        <NavButton
          active={activeTab === "typography"}
          onClick={() => setActiveTab("typography")}
          icon={<FaFont />}
          label="Typography"
        />
        <NavButton
          active={activeTab === "cart"}
          onClick={() => setActiveTab("cart")}
          icon={<FaShoppingCart />}
          label="Cart Item"
        />
      </div>

      <div
        className="mt-2 min-h-0 flex-1 space-y-2 overflow-y-auto pb-30 custom-scrollbar"
        data-lenis-prevent
      >
        <ThemePresetsPanel
          settings={settings}
          updateSettings={updateSettings}
        />

        <GlobalStylesPanel
          settings={settings}
          updateSettings={updateSettings}
          previewZoom={previewZoom}
          setPreviewZoom={setPreviewZoom}
        />

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
      </div>
    </div>
  );
}
