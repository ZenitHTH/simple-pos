"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import VirtualNumpad from "@/components/payment/VirtualNumpad";
import { AppSettings } from "@/lib/types";
import { SidebarSlider } from "./SidebarSlider";

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

interface NumpadTunerProps {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

export function NumpadTuner({ settings, updateSettings }: NumpadTunerProps) {
  const [displayValue, setDisplayValue] = useState("");

  const handlePress = (key: string) => {
    setDisplayValue((prev) => (prev.length < 10 ? prev + key : prev));
  };

  const handleBackspace = () => {
    setDisplayValue((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setDisplayValue("");
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      <motion.div variants={item}>
        <h2 className="mb-2 text-3xl font-bold tracking-tight">Virtual Numpad</h2>
        <p className="text-muted-foreground text-lg">
          Fine-tune the Virtual Numpad appearance. Adjust button height, gaps,
          and font scales for the perfect touch experience.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-start">
        {/* Controls Panel */}
        <motion.div
          variants={item}
          className="border-border/60 bg-card/50 rounded-3xl border p-8 shadow-sm backdrop-blur-sm space-y-6"
        >
          <h3 className="text-xl font-bold mb-4">Styling Controls</h3>

          <div className="space-y-4">
            <SidebarSlider
              label="Overall Scale"
              value={settings.styling.payment.numpad_scale ?? 100}
              onChange={(v) => updateSettings({ styling: { payment: { numpad_scale: v } } })}
              min={50}
              max={150}
              unit="%"
            />

            <SidebarSlider
              label="Button Font Scale"
              value={settings.styling.payment.numpad_font_scale ?? 100}
              onChange={(v) => updateSettings({ styling: { payment: { numpad_font_scale: v } } })}
              min={50}
              max={200}
              unit="%"
            />

            <SidebarSlider
              label="Display Font Scale"
              value={settings.styling.payment.numpad_display_font_scale ?? 100}
              onChange={(v) => updateSettings({ styling: { payment: { numpad_display_font_scale: v } } })}
              min={50}
              max={200}
              unit="%"
            />

            <SidebarSlider
              label="Button Height"
              value={settings.styling.payment.numpad_button_height ?? 80}
              onChange={(v) => updateSettings({ styling: { payment: { numpad_button_height: v } } })}
              min={40}
              max={120}
              unit="px"
            />

            <SidebarSlider
              label="Button Gap"
              value={settings.styling.payment.numpad_gap ?? 12}
              onChange={(v) => updateSettings({ styling: { payment: { numpad_gap: v } } })}
              min={0}
              max={32}
              unit="px"
            />
          </div>

          <button
            onClick={() => {
              updateSettings({
                styling: {
                  payment: {
                    numpad_scale: 100,
                    numpad_font_scale: 100,
                    numpad_display_font_scale: 100,
                    numpad_button_height: 80,
                    numpad_gap: 12,
                  }
                }
              });
            }}
            className="text-muted-foreground hover:text-foreground w-full rounded-lg border border-dashed py-2 text-[10px] transition-colors uppercase tracking-wider font-semibold"
          >
            Reset Numpad Styles
          </button>
        </motion.div>

        {/* Interactive Preview */}
        <motion.div
          variants={item}
          className="border-border/60 bg-card/50 rounded-3xl border p-10 shadow-sm backdrop-blur-sm"
        >
          <div className="mb-8 flex flex-col items-center gap-4">
            <div
              className="bg-background border-border flex h-24 w-full items-center justify-end rounded-2xl border px-6 font-black tracking-widest shadow-inner overflow-hidden"
              style={{
                fontSize: `${(settings.styling.payment.numpad_display_font_scale ?? 100) * 0.36}px`, // 36px is approx 4xl
              }}
            >
              {displayValue || "0"}
            </div>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
              Interactive Preview
            </p>
          </div>

          <div
            className="rounded-3xl bg-muted/20 p-6 shadow-sm border border-border/50 transition-all origin-top"
            style={{
              transform: `scale(${(settings.styling.payment.numpad_scale ?? 100) / 100})`,
            }}
          >
            <VirtualNumpad
              onPress={handlePress}
              onBackspace={handleBackspace}
              onClear={handleClear}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
