"use client";

import { useMockup } from "@/context/MockupContext";
import { useSettings } from "@/context/settings/SettingsContext";
import { cn } from "@/lib";
import { motion } from "framer-motion";
import { useState } from "react";

interface SelectableOverlayProps {
  id: string;
  className?: string; // Additional classes if needed
}

export default function SelectableOverlay({
  id,
  className = "",
}: SelectableOverlayProps) {
  const { isMockupMode, selectedElementId, selectElement } = useMockup();
  const { settings, updateSettings } = useSettings();
  const [isDragging, setIsDragging] = useState(false);

  if (!isMockupMode) return null;

  const isSelected = selectedElementId === id;
  const rawScale = settings[id as keyof typeof settings];
  const currentScale = typeof rawScale === "number" ? rawScale : 100;

  const handleDrag = (_: any, info: any) => {
    // Map movement to scale change
    // sensitivity: 0.5% per pixel
    const sensitivity = 0.5;
    // Use the maximum displacement to determine intended scaling direction
    const delta = (Math.abs(info.delta.x) > Math.abs(info.delta.y) ? info.delta.x : info.delta.y) * sensitivity;
    const newScale = Math.min(Math.max(currentScale + delta, 50), 200);
    
    updateSettings({ [id]: newScale });
  };

  return (
    <div
      data-selectable-id={id}
      className={cn(
        "pointer-events-auto absolute inset-0 z-10 cursor-pointer rounded-xl transition-all duration-200",
        isSelected
          ? "border-4 border-primary bg-primary/10"
          : "border-2 border-transparent hover:border-primary/50 hover:bg-primary/5",
        isDragging && "opacity-50",
        className,
      )}
      onClick={(e) => {
        // Prevent click from triggering underlying elements
        e.preventDefault();
        e.stopPropagation();
        selectElement(isSelected ? null : id);
      }}
      title={id} // Show ID on hover tooltip
    >
      {isSelected && (
        <>
          {/* Ghost Outline (Reference to 100% scale) */}
          <motion.div 
            initial={false}
            animate={{ 
              transform: `scale(${100 / currentScale})`,
            }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 -z-1 border-2 border-dashed border-muted-foreground/30 pointer-events-none opacity-50" 
            style={{ 
              transformOrigin: 'top left' 
            }} 
          />

          {/* Bottom-Right Drag Handle */}
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            onDragStart={() => setIsDragging(true)}
            onDrag={handleDrag}
            onDragEnd={() => setIsDragging(false)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="absolute -bottom-3 -right-3 h-6 w-6 rounded-full bg-primary border-4 border-background shadow-xl cursor-nwse-resize z-50 flex items-center justify-center transition-shadow hover:shadow-primary/50"
            // Reset position after drag to keep it anchored relative to the growing/shrinking parent
            style={{ x: 0, y: 0 }}
          />
        </>
      )}
    </div>
  );
}
