"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib";

interface ThemeCardProps {
  name: string;
  color: string;
  description: string;
  active: boolean;
  onClick: () => void;
}

export function ThemeCard({ name, color, description, active, onClick }: ThemeCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border transition-all text-left",
        active ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border bg-card hover:border-border/80"
      )}
    >
      {/* Visual Preview Area */}
      <div className="relative h-32 w-full overflow-hidden p-4" style={{ backgroundColor: color }}>
        {/* Mock POS Elements */}
        <div className="absolute top-4 left-4 h-20 w-8 rounded-md bg-white/20 backdrop-blur-sm" /> {/* Sidebar */}
        <div className="absolute top-4 left-14 right-4 h-12 rounded-lg bg-white/30 backdrop-blur-sm shadow-sm" /> {/* Card */}
        <div className="absolute bottom-4 right-4 h-6 w-12 rounded-full bg-white/40 backdrop-blur-sm" /> {/* Button */}
      </div>

      <div className="p-4">
        <h4 className="font-bold text-sm">{name}</h4>
        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold">
          {description}
        </p>
      </div>
    </motion.button>
  );
}
