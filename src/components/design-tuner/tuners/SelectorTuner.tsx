"use client";

import { useState } from "react";
import { Select } from "@/components/ui/Select";
import { motion } from "framer-motion";
import { FaInfoCircle, FaCheckCircle } from "react-icons/fa";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

/**
 * SelectorTuner Component
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
export function SelectorTuner() {
  const [val, setVal] = useState<string | number>("");
  const options = [
    { value: "1", label: "Vanilla Latte" },
    { value: "2", label: "Caramel Macchiato" },
    { value: "3", label: "Dark Chocolate Mocha" },
    { value: "4", label: "Iced Green Tea" },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      <motion.div variants={item}>
        <h2 className="mb-2 text-3xl font-bold tracking-tight">Selector</h2>
        <p className="text-muted-foreground text-lg">
          The Select component provides a sleek dropdown interface for choosing
          from multiple options.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Interactive Preview */}
        <motion.div
          variants={item}
          className="border-border/60 bg-card/50 flex flex-col overflow-hidden rounded-3xl border shadow-sm backdrop-blur-sm"
        >
          <div className="space-y-10 p-10">
            <header>
              <h3 className="text-xl font-bold">Interactive Preview</h3>
              <p className="text-muted-foreground">
                Test the dropdown behavior and styling.
              </p>
            </header>

            <div className="bg-background/40 border-border/40 rounded-2xl border p-6 shadow-inner">
              <Select
                label="Product Category"
                options={options}
                value={val}
                onChange={setVal}
                placeholder="Select a category..."
              />
            </div>

            <motion.div
              initial={false}
              animate={{
                backgroundColor: val
                  ? "var(--primary-fade, rgba(var(--primary), 0.1))"
                  : "rgba(var(--muted), 0.3)",
                borderColor: val
                  ? "rgba(var(--primary), 0.2)"
                  : "rgba(var(--border), 0.5)",
              }}
              className="flex items-center justify-between rounded-2xl border p-5 text-sm transition-colors"
            >
              <div className="flex items-center gap-3">
                {val ? (
                  <FaCheckCircle className="text-primary text-lg" />
                ) : (
                  <FaInfoCircle className="text-muted-foreground text-lg" />
                )}
                <span className="text-muted-foreground font-semibold">
                  Selected Value
                </span>
              </div>
              <code className="bg-background text-primary border-primary/20 rounded-xl border px-4 py-2 font-mono font-bold shadow-sm">
                {val || "(null)"}
              </code>
            </motion.div>
          </div>

          <div className="bg-muted/10 border-border/60 border-t p-5">
            <p className="text-muted-foreground/60 text-center text-[10px] font-bold tracking-[0.25em] uppercase">
              Standard usage with label
            </p>
          </div>
        </motion.div>

        {/* States Showcase */}
        <div className="space-y-8">
          <motion.div
            variants={item}
            className="border-border/60 bg-card/50 rounded-3xl border p-10 shadow-sm backdrop-blur-sm"
          >
            <h3 className="mb-8 text-xl font-bold">Static States</h3>
            <div className="space-y-8">
              <div>
                <label className="text-muted-foreground/60 mb-2.5 block text-[10px] font-bold tracking-[0.2em] uppercase">
                  Without Label
                </label>
                <Select
                  options={options}
                  value="1"
                  onChange={() => {}}
                  placeholder="Minimal version"
                />
              </div>

              <div className="pointer-events-none opacity-50 grayscale">
                <label className="text-muted-foreground/60 mb-2.5 block text-[10px] font-bold tracking-[0.2em] uppercase">
                  Disabled State
                </label>
                <Select
                  options={options}
                  value=""
                  onChange={() => {}}
                  placeholder="Locked Selection"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="bg-primary/[0.03] border-primary/20 rounded-3xl border p-8 shadow-sm"
          >
            <h4 className="text-primary mb-3 flex items-center gap-2 text-base font-bold">
              <FaInfoCircle /> Design Tip
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The Select component uses <strong>SQLCipher</strong> safely under
              the hood when fetching real data. Visually, it respects the{" "}
              <code>--radius</code> and <code>--primary</code> CSS variables
              tuned in the sidebar.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
