"use client";

import { motion } from "framer-motion";
import { SidebarSlider } from "./SidebarSlider";
import { AppSettings } from "@/lib/types";
import BaseSidebarLayout from "@/components/layout/BaseSidebarLayout";
import { FaHome, FaCog } from "react-icons/fa";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

interface SidebarTunerProps {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

export function SidebarTuner({ settings, updateSettings }: SidebarTunerProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      <motion.div variants={item}>
        <h2 className="mb-2 text-3xl font-bold tracking-tight">Sidebar Layout</h2>
        <p className="text-muted-foreground text-lg">
          Adjust the width and typography of the main navigation sidebar.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Controls */}
        <motion.div
          variants={item}
          className="border-border/60 bg-card/50 h-fit space-y-8 rounded-3xl border p-8 shadow-sm backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold">Layout Tuning</h3>
          <div className="space-y-6">
            <SidebarSlider
              label="Button Scale"
              value={settings.sidebar_button_scale ?? 100}
              onChange={(v) => updateSettings({ sidebar_button_scale: v })}
              min={50}
              max={200}
              unit="%"
            />
            <SidebarSlider
              label="Font Size"
              value={settings.sidebar_font_scale ?? 100}
              onChange={(v) => updateSettings({ sidebar_font_scale: v })}
              min={50}
              max={150}
              unit="%"
            />
          </div>
          <div className="bg-primary/5 rounded-2xl border border-primary/10 p-4 text-xs text-muted-foreground leading-relaxed">
            <strong>Tip:</strong> The Sidebar Width is now exclusively tuned on the main display using Design Mode (on-canvas MiniTuner).
          </div>
        </motion.div>

        {/* Live Preview */}
        <motion.div
          variants={item}
          className="lg:col-span-2 space-y-6"
        >
          <div className="border-border/60 bg-card/30 rounded-3xl border shadow-xl backdrop-blur-sm relative overflow-hidden h-[500px] flex">
             
             {/* Mock Sidebar */}
             <div 
                className="h-full border-r border-border bg-card"
                style={{ "--sidebar-button-scale": (settings.sidebar_button_scale ?? 100) / 100 } as any}
             >
                <BaseSidebarLayout
                    title="POS System"
                    isOpen={true}
                    scale={settings.sidebar_scale || 100}
                    fontScale={settings.sidebar_font_scale || 100}
                    className="relative lg:static translate-x-0"
                    showMobileClose={false}
                >
                    <nav className="flex-1 space-y-2 p-4">
                        <div className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 bg-primary text-primary-foreground font-bold">
                            <FaHome size={20} />
                            <span>Main Page</span>
                        </div>
                        <div className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-muted-foreground font-medium">
                            <FaCog size={20} />
                            <span>Settings</span>
                        </div>
                    </nav>
                </BaseSidebarLayout>
             </div>

             {/* Mock Main Content */}
             <div className="flex-1 p-8 bg-background">
                <div className="h-8 w-1/3 bg-muted rounded-lg mb-6" />
                <div className="space-y-4">
                    <div className="h-32 w-full bg-card border border-border rounded-2xl" />
                    <div className="h-32 w-full bg-card border border-border rounded-2xl" />
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
