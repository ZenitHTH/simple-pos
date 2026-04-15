"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { AppSettings, DeepPartial } from "@/lib/types";
import { ThemePresetsPanel } from "../panels/ThemePresetsPanel";
import { GlobalStylesPanel } from "../panels/GlobalStylesPanel";
import { ThemeExplorerModal } from "../core/ThemeExplorerModal";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

interface GlobalTunerProps {
  settings: AppSettings;
  updateSettings: (updates: DeepPartial<AppSettings>) => void;
  previewZoom: number;
  setPreviewZoom: (v: number) => void;
}

/**
 * GlobalTuner Component
 * 
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
export function GlobalTuner({
  settings,
  updateSettings,
  previewZoom,
  setPreviewZoom,
}: GlobalTunerProps) {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      <motion.div variants={item} className="mb-8">
        <h2 className="text-3xl font-black tracking-tight">Global Tuner</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl text-base">
          Customize the core aesthetics of your POS system. These settings affect
          all screens and components universally.
        </p>
      </motion.div>

      {/* Panels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Presets Column */}
        <motion.div
          variants={item}
          className="border-border/60 bg-card/50 h-fit rounded-3xl border p-8 shadow-sm backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold">Theme Presets</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Quickly switch between predefined layout styles.
          </p>
          <ThemePresetsPanel 
            settings={settings} 
            updateSettings={updateSettings} 
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        </motion.div>

        {/* Global Styles Column */}
        <motion.div variants={item}>
          <GlobalStylesPanel
            settings={settings}
            updateSettings={updateSettings}
            previewZoom={previewZoom}
            setPreviewZoom={setPreviewZoom}
          />
        </motion.div>
      </div>

      <ThemeExplorerModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        settings={settings}
        updateSettings={updateSettings}
      />
    </motion.div>
  );
}
