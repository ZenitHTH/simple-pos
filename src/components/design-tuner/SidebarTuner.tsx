"use client";

import { motion } from "framer-motion";
import { SidebarSlider } from "./SidebarSlider";
import { AppSettings } from "@/lib/types";
import { FaHome, FaCog, FaBoxOpen, FaTags } from "react-icons/fa";
import { SidebarItem } from "../layout/sidebar/SidebarItem";
import { SidebarGroup } from "../layout/sidebar/SidebarGroup";

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
          <h3 className="text-xl font-bold">Layout & Style</h3>
          <div className="space-y-6">
            <SidebarSlider
              label="Icon Size"
              value={settings.styling.sidebar.icon_size ?? 20}
              onChange={(v) => updateSettings({ styling: { sidebar: { icon_size: v } } })}
              min={12}
              max={32}
              unit="px"
            />
            <SidebarSlider
              label="Item Spacing"
              value={settings.styling.sidebar.item_spacing ?? 8}
              onChange={(v) => updateSettings({ styling: { sidebar: { item_spacing: v } } })}
              min={0}
              max={24}
              unit="px"
            />
            <SidebarSlider
              label="Corner Radius"
              value={settings.styling.sidebar.item_radius ?? 12}
              onChange={(v) => updateSettings({ styling: { sidebar: { item_radius: v } } })}
              min={0}
              max={24}
              unit="px"
            />
            <SidebarSlider
              label="Active Opacity"
              value={settings.styling.sidebar.active_bg_opacity ?? 10}
              onChange={(v) => updateSettings({ styling: { sidebar: { active_bg_opacity: v } } })}
              min={0}
              max={100}
              unit="%"
            />
            <SidebarSlider
              label="Font Size"
              value={settings.scaling.fonts.sidebar ?? 100}
              onChange={(v) => updateSettings({ scaling: { fonts: { sidebar: v } } })}
              min={50}
              max={150}
              unit="%"
            />
          </div>
          <div className="bg-primary/5 rounded-2xl border border-primary/10 p-4 text-xs text-muted-foreground leading-relaxed">
            <strong>Tip:</strong> Sidebar Width can be tuned in the <strong>Layout</strong> tab.
          </div>
        </motion.div>

        {/* Live Preview */}
        <motion.div
          variants={item}
          className="lg:col-span-2 space-y-6"
        >
          <div className="border-border/60 bg-card/30 rounded-3xl border shadow-xl backdrop-blur-sm relative overflow-hidden h-[500px] flex">
             
             {/* Mock Sidebar Container */}
             <div 
                className="h-full border-r border-border bg-card flex flex-col"
                style={{ 
                  width: `${256 * ((settings.scaling.components.sidebar || 100) / 100)}px`,
                  fontSize: `${settings.scaling.fonts.sidebar || 100}%`
                }}
             >
                <div className="p-6">
                  <div className="h-8 w-24 bg-primary/20 rounded-lg animate-pulse" />
                </div>
                <nav className="flex-1 space-y-1 p-4">
                  <SidebarItem 
                    name="Dashboard" 
                    path="#" 
                    icon={<FaHome />} 
                    isActive={true} 
                  />
                  <SidebarGroup 
                    name="Management" 
                    icon={<FaBoxOpen />} 
                    isExpanded={true} 
                    onToggle={() => {}} 
                    currentPath="/manage" 
                    children={[
                      { name: "Products", path: "/manage", icon: <FaBoxOpen /> },
                      { name: "Categories", path: "/categories", icon: <FaTags /> },
                    ]}
                  />
                  <SidebarItem 
                    name="Settings" 
                    path="/settings" 
                    icon={<FaCog />} 
                    isActive={false} 
                  />
                </nav>
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
