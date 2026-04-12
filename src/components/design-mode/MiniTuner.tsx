"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Draggable from "react-draggable";
import { FaLayerGroup, FaMagic, FaCheckCircle, FaTextHeight } from "react-icons/fa";
import { useColorSampler } from "@/hooks/useColorSampler";
import { useMockup } from "@/context/MockupContext";
import { useSettings } from "@/context/settings/SettingsContext";
import { cn } from "@/lib";
import { GridStylesPanel } from "../design-tuner/panels/GridStylesPanel";
import { TunerSlider } from "../design-tuner/ui/TunerSlider";
import NumberStepper from "@/components/ui/NumberStepper";

type Tab = "layout" | "style";

export default function MiniTuner() {
  const { selectedElementId } = useMockup();
  const { settings, updateSettings } = useSettings();
  const [mounted, setMounted] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, flip: false });
  const [activeTab, setActiveTab] = useState<Tab>("layout");
  const menuRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  
  // Color Sampler
  const { colors, sampleImage, isSampling } = useColorSampler();
  const [previewColor, setPreviewColor] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    let root = document.getElementById("portal-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "portal-root";
      document.body.appendChild(root);
    }
    setPortalRoot(root);
  }, []);

  // Effect to sample image when selection changes
  useEffect(() => {
    if (!selectedElementId) return;

    // Reset preview when selection changes
    setPreviewColor(null);

    // Try to find an image within the selected element's parent (since overlay is absolute inset-0)
    const el = document.querySelector(`[data-selectable-id="${selectedElementId}"]`);
    const parent = el?.parentElement;
    const img = parent?.querySelector("img");
    
    if (img) {
      if (img.complete) {
        sampleImage(img);
      } else {
        img.onload = () => sampleImage(img);
      }
    }
  }, [selectedElementId, sampleImage]);

  // Apply preview color to the live DOM for instant feedback (via CSS variable)
  useEffect(() => {
    if (previewColor) {
      document.documentElement.style.setProperty("--primary", previewColor);
    } else {
      // Revert to settings color if no preview is active
      const themeColor = settings.theme.theme_primary_color;
      if (themeColor) {
        document.documentElement.style.setProperty("--primary", themeColor);
      } else {
        document.documentElement.style.removeProperty("--primary");
      }
    }
  }, [previewColor, settings.theme.theme_primary_color]);

  useEffect(() => {
    const updatePosition = () => {
      if (!selectedElementId) return;

      const el = document.querySelector(`[data-selectable-id="${selectedElementId}"]`);
      if (!el) return;

      // We need to wait a tiny bit for the tuner to measure itself if it just mounted
      const menuEl = menuRef.current;
      const rect = el.getBoundingClientRect();
      const menuWidth = 288; // w-72 = 18rem = 288px
      const menuHeight = menuEl?.offsetHeight || 380; // Estimated height if not yet measured
      
      // Calculate center position
      let top = rect.top - menuHeight - 20;
      let left = rect.left + (rect.width / 2) - (menuWidth / 2);
      let flip = false;

      // Check if top edge overflows screen
      if (top < 20) {
        top = rect.bottom + 20;
        flip = true;
      }

      // Keep within horizontal screen bounds
      const padding = 20;
      left = Math.max(padding, Math.min(left, window.innerWidth - menuWidth - padding));

      // Keep within vertical screen bounds (protect the bottom edge)
      if (top + menuHeight > window.innerHeight - padding) {
        top = window.innerHeight - menuHeight - padding;
      }

      // Ensure we don't get pushed off the top if the window is extremely short
      if (top < padding) {
        top = padding;
      }

      setPosition({ top, left, flip });
    };

    if (selectedElementId) {
      updatePosition();
      
      // Call again shortly after to handle any layout shifts
      const timer = setTimeout(updatePosition, 100);

      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("scroll", updatePosition);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [selectedElementId]);

  if (!mounted || !portalRoot || !selectedElementId) return null;

  // Mapping for dynamic access to nested settings
  const getNestedValue = (id: string): number => {
    switch (id) {
      case "grid_scale": return settings.scaling.components.grid;
      case "numpad_scale": return settings.styling.payment.numpad_scale ?? 100;
      case "cart_scale": return settings.scaling.components.cart;
      case "sidebar_scale": return settings.scaling.components.sidebar;
      case "button_scale": return settings.scaling.components.button;
      case "header_font_scale": return settings.scaling.fonts.header;
      case "history_font_scale": return settings.scaling.fonts.history;
      case "sidebar_font_scale": return settings.scaling.fonts.sidebar;
      default: return 100;
    }
  };

  const getFontScaleValue = (id: string): number => {
    switch (id) {
      case "grid_scale": return settings.scaling.fonts.grid;
      case "cart_scale": return settings.styling.cart.font_size ?? 100;
      case "sidebar_scale": return settings.scaling.fonts.sidebar;
      case "button_scale": return settings.scaling.fonts.button;
      case "numpad_scale": return settings.styling.payment.numpad_font_scale ?? 100;
      default: return 100;
    }
  };

  const updateNestedValue = (id: string, val: number) => {
    switch (id) {
      case "grid_scale": updateSettings({ scaling: { components: { grid: val } } }); break;
      case "numpad_scale": updateSettings({ styling: { payment: { numpad_scale: val } } }); break;
      case "cart_scale": updateSettings({ scaling: { components: { cart: val } } }); break;
      case "sidebar_scale": updateSettings({ scaling: { components: { sidebar: val } } }); break;
      case "button_scale": updateSettings({ scaling: { components: { button: val } } }); break;
      case "header_font_scale": updateSettings({ scaling: { fonts: { header: val } } }); break;
      case "history_font_scale": updateSettings({ scaling: { fonts: { history: val } } }); break;
      case "sidebar_font_scale": updateSettings({ scaling: { fonts: { sidebar: val } } }); break;
    }
  };

  const updateFontScaleValue = (id: string, val: number) => {
    switch (id) {
      case "grid_scale": updateSettings({ scaling: { fonts: { grid: val } } }); break;
      case "cart_scale": updateSettings({ styling: { cart: { font_size: val } } }); break;
      case "sidebar_scale": updateSettings({ scaling: { fonts: { sidebar: val } } }); break;
      case "button_scale": updateSettings({ scaling: { fonts: { button: val } } }); break;
      case "numpad_scale": updateSettings({ styling: { payment: { numpad_font_scale: val } } }); break;
    }
  };

  const currentScale = getNestedValue(selectedElementId);
  const currentFontScale = getFontScaleValue(selectedElementId);

  const handleApplyColor = () => {
    if (previewColor) {
      updateSettings({ theme: { theme_primary_color: previewColor } });
      setPreviewColor(null);
    }
  };

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[60]">
      <Draggable
        nodeRef={nodeRef}
        key={selectedElementId}
        handle=".drag-handle"
        defaultPosition={{ x: position.left, y: position.top }}
        onStart={(e) => {
          // Prevent drag from starting if clicking internal buttons
          if ((e.target as HTMLElement).closest('button')) return false;
        }}
      >
        <div ref={nodeRef} className="pointer-events-auto absolute flex w-72 flex-col rounded-xl border border-border bg-card/80 shadow-2xl backdrop-blur-md">
          <AnimatePresence>
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="flex flex-col"
              id="minituner-portal"
            >
              {/* Add a visible drag handle at the top */}
              <div className="drag-handle h-6 flex items-center justify-center cursor-grab active:cursor-grabbing w-full">
                <div className="h-1.5 w-12 bg-border/50 rounded-full" />
              </div>
              
              {/* Header & Tabs */}
              <div className="flex border-b border-border p-1">
                <button
                  onClick={() => setActiveTab("layout")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                    activeTab === "layout"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <FaLayerGroup size={12} />
                  Layout
                </button>
                <button
                  onClick={() => setActiveTab("style")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                    activeTab === "style"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <FaMagic size={12} />
                  Style
                </button>
              </div>

              <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {selectedElementId.replace(/_/g, " ")}
                  </h3>
                  <div className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === "layout" ? (
                    <motion.div
                      key="layout"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 5 }}
                      className="space-y-4"
                    >
                      {selectedElementId === "grid_scale" ? (
                        <GridStylesPanel settings={settings} onUpdate={updateSettings} />
                      ) : selectedElementId === "numpad_scale" ? (
                        <div className="flex flex-col gap-4">
                          <TunerSlider
                            label="Numpad Scale"
                            value={settings.styling.payment.numpad_scale ?? 100}
                            onChange={(v) => updateSettings({ styling: { payment: { numpad_scale: v } } })}
                            min={50}
                            max={150}
                            unit="%"
                          />

                          <div className="space-y-4 border-t border-border/50 pt-4">
                            <TunerSlider
                              label="Button Font"
                              value={settings.styling.payment.numpad_font_scale ?? 100}
                              onChange={(v) => updateSettings({ styling: { payment: { numpad_font_scale: v } } })}
                              min={50}
                              max={200}
                              unit="%"
                            />
                            <TunerSlider
                              label="Display Font"
                              value={settings.styling.payment.numpad_display_font_scale ?? 100}
                              onChange={(v) => updateSettings({ styling: { payment: { numpad_display_font_scale: v } } })}
                              min={50}
                              max={200}
                              unit="%"
                            />
                            <TunerSlider
                              label="Button Height"
                              value={settings.styling.payment.numpad_button_height ?? 80}
                              onChange={(v) => updateSettings({ styling: { payment: { numpad_button_height: v } } })}
                              min={40}
                              max={120}
                              unit="px"
                            />
                            <TunerSlider
                              label="Button Gap"
                              value={settings.styling.payment.numpad_gap ?? 12}
                              onChange={(v) => updateSettings({ styling: { payment: { numpad_gap: v } } })}
                              min={0}
                              max={32}
                              unit="px"
                            />
                          </div>
                        </div>
                      ) : selectedElementId === "cart_scale" ? (
                        <div className="flex flex-col gap-4">
                          <TunerSlider
                            label="Cart Width"
                            value={settings.scaling.components.cart ?? 100}
                            onChange={(v) => updateSettings({ scaling: { components: { cart: v } } })}
                            min={50}
                            max={200}
                            unit="%"
                          />
                          <div className="space-y-4 border-t border-border/50 pt-4">
                            <TunerSlider
                              label="Font Size"
                              value={settings.styling.cart.font_size ?? 100}
                              onChange={(v) => updateSettings({ styling: { cart: { font_size: v } } })}
                              min={50}
                              max={200}
                              unit="%"
                            />
                            <TunerSlider
                              label="Header Font"
                              value={settings.styling.cart.header_font_size ?? 100}
                              onChange={(v) => updateSettings({ styling: { cart: { header_font_size: v } } })}
                              min={50}
                              max={200}
                              unit="%"
                            />
                            <TunerSlider
                              label="Price Font"
                              value={settings.styling.cart.price_font_size ?? 100}
                              onChange={(v) => updateSettings({ styling: { cart: { price_font_size: v } } })}
                              min={50}
                              max={200}
                              unit="%"
                            />
                            <TunerSlider
                              label="Padding"
                              value={settings.styling.cart.padding ?? 10}
                              onChange={(v) => updateSettings({ styling: { cart: { padding: v } } })}
                              min={0}
                              max={32}
                              unit="px"
                            />
                            <TunerSlider
                              label="Margin"
                              value={settings.styling.cart.margin ?? 8}
                              onChange={(v) => updateSettings({ styling: { cart: { margin: v } } })}
                              min={0}
                              max={24}
                              unit="px"
                            />
                          </div>
                        </div>
                      ) : selectedElementId === "button_scale" ? (
                        <div className="flex flex-col gap-4">
                          <TunerSlider
                            label="Button Scale"
                            value={settings.scaling.components.button ?? 100}
                            onChange={(v) => updateSettings({ scaling: { components: { button: v } } })}
                            min={50}
                            max={200}
                            unit="%"
                          />
                          <TunerSlider
                            label="Font Scale"
                            value={settings.scaling.fonts.button ?? 100}
                            onChange={(v) => updateSettings({ scaling: { fonts: { button: v } } })}
                            min={50}
                            max={200}
                            unit="%"
                          />
                        </div>
                      ) : selectedElementId === "sidebar_scale" ? (
                        <div className="flex flex-col gap-4">
                          <TunerSlider
                            label="Sidebar Width"
                            value={settings.scaling.components.sidebar ?? 100}
                            onChange={(v) => updateSettings({ scaling: { components: { sidebar: v } } })}
                            min={50}
                            max={150}
                            unit="%"
                          />
                          <div className="space-y-4 border-t border-border/50 pt-4">
                            <TunerSlider
                              label="Font Size"
                              value={settings.scaling.fonts.sidebar ?? 100}
                              onChange={(v) => updateSettings({ scaling: { fonts: { sidebar: v } } })}
                              min={50}
                              max={150}
                              unit="%"
                            />
                          </div>
                        </div>
                      ) : selectedElementId === "header_font_scale" ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                            <span>Header Font</span>
                            <span>{settings.scaling.fonts.header || 100}%</span>
                          </div>
                          <NumberStepper
                            min={50}
                            max={150}
                            step={5}
                            value={settings.scaling.fonts.header || 100}
                            onChange={(val) => updateSettings({ scaling: { fonts: { header: val } } })}
                          />
                        </div>
                      ) : selectedElementId === "history_font_scale" ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                            <span>History Font</span>
                            <span>{settings.scaling.fonts.history || 100}%</span>
                          </div>
                          <NumberStepper
                            min={50}
                            max={150}
                            step={5}
                            value={settings.scaling.fonts.history || 100}
                            onChange={(val) => updateSettings({ scaling: { fonts: { history: val } } })}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                            <span>Scale</span>
                            <span>{currentScale}%</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="200"
                            value={currentScale}
                            onChange={(e) =>
                              updateNestedValue(selectedElementId, Number(e.target.value))
                            }
                            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-primary"
                          />
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="style"
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="space-y-4"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <FaTextHeight size={10} />
                            FontSize
                          </div>
                          <span className="text-primary font-mono text-xs font-bold">
                            {currentFontScale}%
                          </span>
                        </div>
                        {selectedElementId && (
                          <NumberStepper
                            min={50}
                            max={200}
                            step={5}
                            value={currentFontScale}
                            onChange={(val) => updateFontScaleValue(selectedElementId, val)}
                          />
                        )}
                      </div>

                      <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">
                          Color Sampler
                        </label>
                        <div className="flex items-center gap-3">
                          {isSampling ? (
                            <div className="flex h-8 w-8 animate-spin items-center justify-center rounded-full border-2 border-primary border-t-transparent" />
                          ) : colors.length > 0 ? (
                            colors.map((color, index) => (
                              <button
                                key={index}
                                onClick={() => setPreviewColor(color)}
                                className={cn(
                                  "h-8 w-8 rounded-full border-2 shadow-sm transition-all hover:scale-110 active:scale-95",
                                  previewColor === color ? "border-white ring-2 ring-primary" : "border-transparent"
                                )}
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))
                          ) : (
                            <p className="text-[9px] text-muted-foreground">No image found to sample colors from.</p>
                          )}
                        </div>

                        {previewColor && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 rounded-lg bg-primary/10 p-3"
                          >
                            <p className="mb-2 text-[10px] font-medium text-primary">
                              Previewing color: <span className="font-bold">{previewColor}</span>
                            </p>
                            <button
                              onClick={handleApplyColor}
                              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2 text-[10px] font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-95"
                            >
                              <FaCheckCircle />
                              Apply to Global Theme
                            </button>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <p className="mt-4 text-[9px] italic text-muted-foreground border-t border-border pt-3">
                  Canvas handles and precision sliders are synchronized in real-time.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Draggable>
    </div>,
    portalRoot
  );
}
