import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaPalette, FaMoon, FaSun } from "react-icons/fa";
import { ThemeCard } from "../previews/ThemeCard";
import { CURATED_THEMES } from "@/context/settings/constants";
import { AppSettings, DeepPartial } from "@/lib/types";
import { useTheme } from "next-themes";

interface ThemeExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  updateSettings: (updates: DeepPartial<AppSettings>) => void;
}

/**
 * ThemeExplorerModal Component
 * 
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
export function ThemeExplorerModal({
  isOpen,
  onClose,
  settings,
  updateSettings,
}: ThemeExplorerModalProps) {
  const currentPrimary = settings.theme.theme_primary_color;
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectTheme = useCallback(
    (color: string) => {
      updateSettings({ theme: { theme_primary_color: color } });
    },
    [updateSettings],
  );

  // Keyboard accessibility
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md lg:p-12"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background border-border relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-[2.5rem] border shadow-2xl"
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-border/50 px-6 py-6 md:px-10 md:py-8">
              <div className="flex-1">
                <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight md:text-3xl">
                  <FaPalette className="text-primary" />
                  Theme Library
                </h2>
                <p className="text-muted-foreground text-sm font-medium md:text-base">
                  Choose a curated palette or create your own.
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                {mounted && (
                  <div className="bg-secondary/30 flex items-center gap-1 rounded-full p-1 border border-border/50">
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                        theme === "light"
                          ? "bg-background text-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      title="Light Mode"
                    >
                      <FaSun size={14} />
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                        theme === "dark"
                          ? "bg-background text-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      title="Dark Mode"
                    >
                      <FaMoon size={14} />
                    </button>
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="bg-secondary/50 hover:bg-secondary text-muted-foreground flex h-10 w-10 items-center justify-center rounded-full transition-colors md:h-12 md:w-12"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </header>

            {/* Content */}
            <div className="custom-scrollbar flex-1 overflow-y-auto p-6 md:p-10">
              {/* Curated Grid */}
              <section className="mb-12">
                <h3 className="text-muted-foreground/60 mb-6 px-2 text-xs font-black uppercase tracking-[0.2em]">
                  Curated Palettes
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                <h3 className="text-muted-foreground/60 mb-6 px-2 text-xs font-black uppercase tracking-[0.2em]">
                  Advanced Palette Generator
                </h3>
                <div className="bg-muted/30 border-border/50 flex flex-col items-center gap-8 rounded-3xl border p-6 md:flex-row md:p-8">
                  <div
                    className="h-20 w-20 shrink-0 rounded-2xl shadow-xl md:h-24 md:w-24"
                    style={{ backgroundColor: currentPrimary || "#3b82f6" }}
                  />
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <p className="text-sm font-medium">
                      Input any hex code. The system will automatically
                      generate all matching shades using <code>color-mix()</code>
                      .
                    </p>
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
            <footer className="bg-muted/20 border-t border-border/50 px-6 py-4 flex justify-end md:px-10 md:py-6">
              <button
                onClick={onClose}
                className="bg-primary text-primary-foreground shadow-primary/20 rounded-2xl px-8 py-3 font-black uppercase tracking-widest shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                Done
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
