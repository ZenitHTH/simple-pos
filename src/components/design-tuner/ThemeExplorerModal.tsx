"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaPalette } from "react-icons/fa";
import { ThemeCard } from "./ThemeCard";
import { CURATED_THEMES } from "@/context/settings/constants";
import { AppSettings } from "@/lib/types";

interface ThemeExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  updateSettings: (updates: any) => void;
}

export function ThemeExplorerModal({ isOpen, onClose, settings, updateSettings }: ThemeExplorerModalProps) {
  const currentPrimary = settings.theme.theme_primary_color;

  const handleSelectTheme = (color: string) => {
    updateSettings({ theme: { theme_primary_color: color } });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6 lg:p-12"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-background border-border relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-[2.5rem] border shadow-2xl"
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-border/50 px-10 py-8">
              <div>
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                  <FaPalette className="text-primary" />
                  Theme Library
                </h2>
                <p className="text-muted-foreground font-medium">Choose a curated palette or create your own.</p>
              </div>
              <button onClick={onClose} className="bg-secondary/50 hover:bg-secondary text-muted-foreground flex h-12 w-12 items-center justify-center rounded-full transition-colors">
                <FaTimes size={20} />
              </button>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              {/* Curated Grid */}
              <section className="mb-12">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-6 px-2">Curated Palettes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {CURATED_THEMES.map((theme) => (
                    <ThemeCard
                      key={theme.id}
                      name={theme.name}
                      color={theme.color}
                      description={theme.description}
                      active={currentPrimary === theme.color}
                      onClick={() => handleSelectTheme(theme.color)}
                    />
                  ))}
                </div>
              </section>

              {/* Advanced Generator */}
              <section className="border-t border-border/50 pt-12">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-6 px-2">Advanced Palette Generator</h3>
                <div className="bg-muted/30 rounded-3xl p-8 border border-border/50 flex flex-col md:flex-row items-center gap-8">
                  <div className="h-24 w-24 rounded-2xl shadow-xl shrink-0" style={{ backgroundColor: currentPrimary || "#3b82f6" }} />
                  <div className="flex-1 space-y-4">
                    <p className="text-sm font-medium">Input any hex code. The system will automatically generate all matching shades using <code>color-mix()</code>.</p>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={currentPrimary || "#3b82f6"}
                        onChange={(e) => handleSelectTheme(e.target.value)}
                        className="h-12 w-12 cursor-pointer rounded-xl border-0 p-0 overflow-hidden shadow-sm"
                      />
                      <input
                        type="text"
                        value={currentPrimary || "#3b82f6"}
                        onChange={(e) => handleSelectTheme(e.target.value)}
                        placeholder="#HEXCODE"
                        className="bg-background border-border flex-1 rounded-xl border px-4 py-2 font-mono font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <footer className="bg-muted/20 border-t border-border/50 px-10 py-6 flex justify-end">
              <button onClick={onClose} className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                Done
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
