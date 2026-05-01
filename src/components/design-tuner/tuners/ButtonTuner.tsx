"use client";

import { Button } from "@/components/ui/Button";
import {
  FaPalette,
  FaPlus,
  FaTrash,
  FaCheck,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { AppSettings, DeepPartial } from "@/lib/types/settings";
import { ButtonStylesPanel } from "../panels/ButtonStylesPanel";

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

interface ButtonTunerProps {
  settings: AppSettings;
  updateSettings: (updates: DeepPartial<AppSettings>) => void;
}

/**
 * ButtonTuner Component
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
export function ButtonTuner({ settings, updateSettings }: ButtonTunerProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-10 lg:grid-cols-3"
    >
      {/* Left Column: Styles Panel */}
      <div className="lg:col-span-1">
        <div className="sticky top-10 space-y-6">
          <motion.div variants={item}>
            <h2 className="mb-2 text-3xl font-bold tracking-tight">Buttons</h2>
            <p className="text-muted-foreground text-lg">
              Explore and preview the button system including variants, sizes,
              and states.
            </p>
          </motion.div>
          <ButtonStylesPanel
            settings={settings}
            updateSettings={updateSettings}
          />
        </div>
      </div>

      {/* Right Column: Previews */}
      <div
        className="space-y-12 lg:col-span-2"
        style={
          {
            "--button-scale": (settings.scaling.components.button ?? 100) / 100,
            "--button-font-scale": (settings.scaling.fonts.button ?? 100) / 100,
          } as React.CSSProperties
        }
      >
        <div className="grid gap-8">
          {/* Basic Variants */}
          <motion.section
            variants={item}
            className="border-border/60 bg-card/50 space-y-8 rounded-3xl border p-10 shadow-sm backdrop-blur-sm"
          >
            <header>
              <h3 className="text-xl font-bold">Variants</h3>
              <p className="text-muted-foreground">
                Different visual styles for various contexts.
              </p>
            </header>

            <div className="flex flex-wrap items-center gap-6">
              <div className="group flex flex-col items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="default">Primary</Button>
                </motion.div>
                <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase opacity-0 transition-opacity group-hover:opacity-100">
                  Default
                </span>
              </div>
              <div className="group flex flex-col items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="secondary">Secondary</Button>
                </motion.div>
                <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase opacity-0 transition-opacity group-hover:opacity-100">
                  Secondary
                </span>
              </div>
              <div className="group flex flex-col items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline">Outline</Button>
                </motion.div>
                <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase opacity-0 transition-opacity group-hover:opacity-100">
                  Outline
                </span>
              </div>
              <div className="group flex flex-col items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost">Ghost</Button>
                </motion.div>
                <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase opacity-0 transition-opacity group-hover:opacity-100">
                  Ghost
                </span>
              </div>
              <div className="group flex flex-col items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="destructive">Destructive</Button>
                </motion.div>
                <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase opacity-0 transition-opacity group-hover:opacity-100">
                  Destructive
                </span>
              </div>
            </div>
          </motion.section>

          {/* Sizes */}
          <motion.section
            variants={item}
            className="border-border/60 bg-card/50 space-y-8 rounded-3xl border p-10 shadow-sm backdrop-blur-sm"
          >
            <header>
              <h3 className="text-xl font-bold">Sizes</h3>
              <p className="text-muted-foreground">
                Scaled versions of buttons for different layouts.
              </p>
            </header>

            <div className="flex flex-wrap items-end gap-8">
              <div className="group flex flex-col items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="sm">Small</Button>
                </motion.div>
                <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase opacity-0 transition-opacity group-hover:opacity-100">
                  sm
                </span>
              </div>
              <div className="group flex flex-col items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="default">Default Size</Button>
                </motion.div>
                <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase opacity-0 transition-opacity group-hover:opacity-100">
                  default
                </span>
              </div>
              <div className="group flex flex-col items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg">Large Scale</Button>
                </motion.div>
                <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase opacity-0 transition-opacity group-hover:opacity-100">
                  lg
                </span>
              </div>
              <div className="group flex flex-col items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="icon" aria-label="Icon">
                    <FaPalette className="text-sm" />
                  </Button>
                </motion.div>
                <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase opacity-0 transition-opacity group-hover:opacity-100">
                  icon
                </span>
              </div>
            </div>
          </motion.section>

          {/* Combinations & States */}
          <motion.section
            variants={item}
            className="border-border/60 bg-card/50 space-y-8 rounded-3xl border p-10 shadow-sm backdrop-blur-sm"
          >
            <header>
              <h3 className="text-xl font-bold">States & Icons</h3>
              <p className="text-muted-foreground">
                Buttons with icons and interactive states.
              </p>
            </header>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-6">
                <h4 className="text-muted-foreground/60 text-xs font-bold tracking-[0.2em] uppercase">
                  With Icons
                </h4>
                <div className="flex flex-col gap-4">
                  <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Button className="h-12 w-full justify-between">
                      Continue <FaArrowRight className="text-xs" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button variant="secondary" className="h-12 w-full gap-3">
                      <FaPlus className="text-xs" /> Add Item
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button variant="outline" className="h-12 w-full gap-3">
                      <FaCheck className="text-success text-xs" /> Completed
                    </Button>
                  </motion.div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-muted-foreground/60 text-xs font-bold tracking-[0.2em] uppercase">
                  States
                </h4>
                <div className="flex flex-col gap-4">
                  <Button disabled className="h-12 w-full">
                    Disabled Button
                  </Button>
                  <Button variant="outline" disabled className="h-12 w-full">
                    Disabled Outline
                  </Button>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button variant="destructive" className="h-12 w-full gap-3">
                      <FaTrash className="text-xs" /> Delete Order
                    </Button>
                  </motion.div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-muted-foreground/60 text-xs font-bold tracking-[0.2em] uppercase">
                  Icon Groups
                </h4>
                <div className="flex flex-wrap gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-full shadow-sm"
                    >
                      <FaPlus />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-full shadow-sm"
                    >
                      <FaCheck />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="icon"
                      variant="destructive"
                      className="rounded-full shadow-sm"
                    >
                      <FaTrash />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -10 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full shadow-sm"
                    >
                      <FaPalette />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
}
