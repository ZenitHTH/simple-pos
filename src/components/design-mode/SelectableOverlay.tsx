"use client";

import { useMockup } from "@/context/MockupContext";
import { useSettings } from "@/context/settings/SettingsContext";
import { updateStyleVariable } from "@/context/settings/hooks";
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
  const currentScaleRef = useRef<number>(100);

  if (!isMockupMode) return null;

  const getScaleValue = (id: string): number => {
    switch (id) {
      case "grid_scale": return settings.scaling.components.grid;
      case "numpad_scale": return settings.styling.payment.numpad_scale ?? 100;
      case "cart_scale": return settings.scaling.components.cart;
      case "sidebar_scale": return settings.scaling.components.sidebar;
      case "button_scale": return settings.scaling.components.button;
      case "manage_table_scale": return settings.scaling.components.manage_table;
      case "stock_table_scale": return settings.scaling.components.stock_table;
      case "material_table_scale": return settings.scaling.components.material_table;
      case "category_table_scale": return settings.scaling.components.category_table;
      case "setting_page_scale": return settings.scaling.components.setting_page;
      case "payment_modal_scale": return settings.scaling.components.payment_modal;
      default: return 100;
    }
  };

  const cssVarMap: Record<string, string> = {
    grid_scale: "--grid-scale",
    numpad_scale: "--numpad-scale",
    cart_scale: "--cart-scale",
    sidebar_scale: "--sidebar-scale",
    button_scale: "--button-scale",
  };

  const updateScaleValue = (id: string, val: number) => {
    switch (id) {
      case "grid_scale": updateSettings({ scaling: { components: { grid: val } } }); break;
      case "numpad_scale": updateSettings({ styling: { payment: { numpad_scale: val } } }); break;
      case "cart_scale": updateSettings({ scaling: { components: { cart: val } } }); break;
      case "sidebar_scale": updateSettings({ scaling: { components: { sidebar: val } } }); break;
      case "button_scale": updateSettings({ scaling: { components: { button: val } } }); break;
      case "manage_table_scale": updateSettings({ scaling: { components: { manage_table: val } } }); break;
      case "stock_table_scale": updateSettings({ scaling: { components: { stock_table: val } } }); break;
      case "material_table_scale": updateSettings({ scaling: { components: { material_table: val } } }); break;
      case "category_table_scale": updateSettings({ scaling: { components: { category_table: val } } }); break;
      case "setting_page_scale": updateSettings({ scaling: { components: { setting_page: val } } }); break;
      case "payment_modal_scale": updateSettings({ scaling: { components: { payment_modal: val } } }); break;
    }
  };

  const isSelected = selectedElementId === id;
  const currentScale = getScaleValue(id);

  const handleDragStart = () => {
    setIsDragging(true);
    startScaleRef.current = currentScale;
    currentScaleRef.current = currentScale;
  };

  const handleDrag = (_: any, info: PanInfo, direction: "nw" | "ne" | "sw" | "se") => {
    const sensitivity = 0.5;
    let delta = 0;

    switch (direction) {
      case "se": delta = (info.offset.x + info.offset.y) * sensitivity; break;
      case "nw": delta = (-info.offset.x - info.offset.y) * sensitivity; break;
      case "ne": delta = (info.offset.x - info.offset.y) * sensitivity; break;
      case "sw": delta = (-info.offset.x + info.offset.y) * sensitivity; break;
    }

    const newScale = Math.min(Math.max(startScaleRef.current + delta, 50), 200);
    currentScaleRef.current = newScale;

    // Fast Path: Direct DOM Update
    const varName = cssVarMap[id];
    if (varName) {
      updateStyleVariable(varName, `${newScale / 100}`);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // Slow Path: Commit to State
    updateScaleValue(id, currentScaleRef.current);
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
        onDragEnd={handleDragEnd}
        whileHover={{ scale: 1.2, backgroundColor: "var(--primary)" }}
        whileTap={{ scale: 0.9 }}
        data-handle-direction={direction}
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
        "pointer-events-auto absolute inset-0 z-10 cursor-pointer rounded-xl transition-[border-color,background-color,opacity] duration-200",
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
