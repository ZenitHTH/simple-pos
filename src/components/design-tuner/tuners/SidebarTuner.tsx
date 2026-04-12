"use client";

import { SidebarStylesPanel } from "../panels/SidebarStylesPanel";
import { AppSettings, DeepPartial } from "@/lib/types";
import { FaHome, FaCog, FaBoxOpen, FaTags } from "react-icons/fa";
import { SidebarItem } from "@/components/layout/sidebar/SidebarItem";
import { SidebarGroup } from "@/components/layout/sidebar/SidebarGroup";

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
  updateSettings: (updates: DeepPartial<AppSettings>) => void;
}

export function SidebarTuner({ settings, updateSettings }: SidebarTunerProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-10 lg:grid-cols-3"
    >
      {/* Left Column: Controls */}
      <div className="lg:col-span-1">
        <div className="sticky top-10 space-y-6">
          <motion.div variants={item}>
            <h2 className="mb-2 text-3xl font-bold tracking-tight">Sidebar</h2>
            <p className="text-muted-foreground text-lg">
              Adjust the layout, spacing, and typography of the main navigation sidebar.
            </p>
          </motion.div>
          <SidebarStylesPanel settings={settings} updateSettings={updateSettings} />
          
          <motion.div variants={item} className="bg-primary/5 rounded-2xl border border-primary/10 p-4 text-xs text-muted-foreground leading-relaxed">
            <strong>Tip:</strong> The width scale affects the overall sidebar footprint, while icon size and spacing fine-tune the internal item density.
          </motion.div>
        </div>
      </div>

      {/* Right Column: Live Preview */}
      <motion.div
        variants={item}
        className="lg:col-span-2 space-y-6"
      >
        <div className="border-border/60 bg-card/30 rounded-3xl border shadow-xl backdrop-blur-sm relative overflow-hidden h-[600px] flex">
           
           {/* Mock Sidebar Container */}
           <div 
              className="h-full border-r border-border bg-card flex flex-col transition-all duration-300"
              style={{ 
                width: `${256 * ((settings.scaling.components.sidebar || 100) / 100)}px`,
                fontSize: `${settings.scaling.fonts.sidebar || 100}%`
              }}
           >
              <div className="p-6">
                <div className="h-8 w-24 bg-primary/20 rounded-lg" />
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
    </motion.div>
  );
}
