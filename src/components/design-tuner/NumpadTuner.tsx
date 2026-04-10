"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
}

export function NumpadTuner({ settings }: NumpadTunerProps) {
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
          Preview the Virtual Numpad styling. It automatically adapts to your
          global Theme Presets, Primary Color, and Radius settings.
        </p>
      </motion.div>

      <motion.div
        variants={item}
        className="border-border/60 bg-card/50 mx-auto max-w-lg rounded-3xl border p-10 shadow-sm backdrop-blur-sm"
      >
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="bg-background border-border flex h-20 w-full items-center justify-end rounded-2xl border px-6 text-4xl font-black tracking-widest shadow-inner">
            {displayValue || "0"}
          </div>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
            Interactive Preview
          </p>
        </div>

        <div
          className="rounded-3xl bg-muted/20 p-6 shadow-sm border border-border/50"
        >
          <VirtualNumpad
            onPress={handlePress}
            onBackspace={handleBackspace}
            onClear={handleClear}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
