"use client";

import { useState } from "react";
import { NumpadStylesPanel } from "./NumpadStylesPanel";
import VirtualNumpad from "@/components/payment/VirtualNumpad";
import { AppSettings } from "@/lib/types";

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
      className="grid grid-cols-1 gap-10 lg:grid-cols-2"
    >
      {/* Left Column: Controls */}
      <div className="lg:col-span-1">
        <div className="sticky top-10 space-y-6">
          <motion.div variants={item}>
            <h2 className="mb-2 text-3xl font-bold tracking-tight">Numpad</h2>
            <p className="text-muted-foreground text-lg">
              Fine-tune the virtual numpad for the best touch checkout experience.
            </p>
          </motion.div>
          <NumpadStylesPanel settings={settings} updateSettings={updateSettings} />
          
          <motion.div variants={item} className="bg-primary/5 rounded-2xl border border-primary/10 p-4 text-xs text-muted-foreground leading-relaxed">
            <strong>Tip:</strong> Button height and gap are critical for usability. Test the interactive preview on your target device.
          </motion.div>
        </div>
      </div>

      {/* Right Column: Live Preview */}
      <motion.div
        variants={item}
        className="space-y-6"
      >
        <div className="border-border/60 bg-card/50 rounded-3xl border p-10 shadow-sm backdrop-blur-sm">
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
        </div>
      </motion.div>
    </motion.div>
  );
}
