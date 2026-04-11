"use client";

import { motion } from "framer-motion";
import { AppSettings } from "@/lib/types";
import { ThemePresetsPanel } from "./ThemePresetsPanel";
import { GlobalStylesPanel } from "./GlobalStylesPanel";

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
  updateSettings: (updates: Partial<AppSettings>) => void;
  previewZoom: number;
  setPreviewZoom: (v: number) => void;
}

export function GlobalTuner({
  settings,
  updateSettings,
  previewZoom,
  setPreviewZoom,
}: GlobalTunerProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      {/* Header section */}
      <motion.div variants={item}>
        <h2 className="mb-2 text-3xl font-bold tracking-tight">Global & Theme</h2>
        <p className="text-muted-foreground text-lg">
          Tune the overall look and feel of the application, including color palettes, corner radius, and app-wide presets.
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
          <ThemePresetsPanel settings={settings} updateSettings={updateSettings} />
        </motion.div>

        {/* Global Styles Column */}
        <motion.div
          variants={item}
          className="border-border/60 bg-card/50 h-fit rounded-3xl border p-8 shadow-sm backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold">Global Appearance</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Fine-tune primary colors, border radiuses, and editor zoom level.
          </p>
          {/* Note: GlobalStylesPanel has its own margin-top border-t inside, we might want to tweak its styling later */}
          <div className="tuner-panels-no-margin-top">
            <GlobalStylesPanel 
              settings={settings} 
              updateSettings={updateSettings} 
              previewZoom={previewZoom} 
              setPreviewZoom={setPreviewZoom} 
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
