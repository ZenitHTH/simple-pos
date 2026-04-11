"use client";

import { useMockup } from "@/context/MockupContext";
import { useSettings } from "@/context/settings/SettingsContext";
import { cn } from "@/lib";
import { motion, PanInfo } from "framer-motion";
import { useState, useRef } from "react";

interface SelectableOverlayProps {
  id: string;
  className?: string;
}

export default function SelectableOverlay({
  id,
  className = "",
}: SelectableOverlayProps) {
  const { isMockupMode, selectedElementId, selectElement } = useMockup();
  const { settings, updateSettings } = useSettings();
  const [isDragging, setIsDragging] = useState(false);
  const startScaleRef = useRef<number>(100);

  if (!isMockupMode) return null;

  const isSelected = selectedElementId === id;
  const rawScale = settings[id as keyof typeof settings];
  const currentScale = typeof rawScale === "number" ? rawScale : 100;

  const handleDragStart = () => {
    setIsDragging(true);
    startScaleRef.current = currentScale;
  };

  const handleDrag = (_: any, info: PanInfo, direction: "nw" | "ne" | "sw" | "se") => {
    const sensitivity = 0.5;
    let delta = 0;

    // Logic: 
    // Pulling away from center increases scale.
    // Pushing towards center decreases scale.
    switch (direction) {
      case "se": // Bottom-right: +x, +y increases scale
        delta = (info.offset.x + info.offset.y) * sensitivity;
        break;
      case "nw": // Top-left: -x, -y increases scale
        delta = (-info.offset.x - info.offset.y) * sensitivity;
        break;
      case "ne": // Top-right: +x, -y increases scale
        delta = (info.offset.x - info.offset.y) * sensitivity;
        break;
      case "sw": // Bottom-left: -x, +y increases scale
        delta = (-info.offset.x + info.offset.y) * sensitivity;
        break;
    }

    const newScale = Math.min(Math.max(startScaleRef.current + delta, 50), 200);
    updateSettings({ [id]: newScale });
  };

  const renderHandle = (direction: "nw" | "ne" | "sw" | "se") => {
    const positionClasses = {
      nw: "-top-3 -left-3 cursor-nw-resize",
      ne: "-top-3 -right-3 cursor-ne-resize",
      sw: "-bottom-3 -left-3 cursor-sw-resize",
      se: "-bottom-3 -right-3 cursor-se-resize",
    };

    return (
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0}
        onDragStart={handleDragStart}
        onDrag={(e, info) => handleDrag(e, info, direction)}
        onDragEnd={() => setIsDragging(false)}
        whileHover={{ scale: 1.2, backgroundColor: "var(--primary)" }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "absolute h-6 w-6 rounded-full bg-primary border-4 border-background shadow-xl z-50 flex items-center justify-center transition-all",
          positionClasses[direction]
        )}
        style={{ x: 0, y: 0 }}
      />
    );
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
        e.preventDefault();
        e.stopPropagation();
        selectElement(isSelected ? null : id);
      }}
      title={id}
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

          {/* Four Corner Drag Handles */}
          {renderHandle("nw")}
          {renderHandle("ne")}
          {renderHandle("sw")}
          {renderHandle("se")}
        </>
      )}
    </div>
  );
}
