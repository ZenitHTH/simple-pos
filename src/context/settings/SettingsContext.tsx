"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { AppSettings, settingsApi } from "@/lib";
import { logger } from "@/lib/logger";
import { DEFAULT_SETTINGS, THEME_PRESETS } from "./constants";
import { useApplySettings } from "./hooks";

interface SettingsContextType {
  settings: AppSettings;
  loading: boolean;
  updateSettings: (updates: Partial<AppSettings>) => void;
  save: () => Promise<void>;
  resetToCheckpoint: () => void;
  resetToDefault: () => void;
  setAutoSave: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstLoadAfterInit = useRef(true);

  // Apply CSS custom properties via custom hook
  useApplySettings(settings);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await settingsApi.getSettings();
      setSettings({ ...DEFAULT_SETTINGS, ...data });
      setTimeout(() => setIsInitialized(true), 100);
    } catch (error) {
      logger.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => {
      let next = { ...prev, ...updates };

      if (updates.theme_preset && updates.theme_preset !== "custom") {
        const preset =
          THEME_PRESETS[updates.theme_preset as keyof typeof THEME_PRESETS];
        if (preset) {
          next = { ...next, ...preset };
        }
      }

      return next;
    });
  };

  const save = async () => {
    try {
      await settingsApi.saveSettings(settings);
    } catch (error) {
      logger.error("Failed to save settings:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (!isInitialized || !autoSaveEnabled) return;

    if (isFirstLoadAfterInit.current) {
      isFirstLoadAfterInit.current = false;
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      save().catch((err) => logger.error("Auto-save failed:", err));
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [settings, isInitialized, autoSaveEnabled]);

  const resetToCheckpoint = async () => {
    setLoading(true);
    await load();
  };

  const resetToDefault = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        updateSettings,
        save,
        resetToCheckpoint,
        resetToDefault,
        setAutoSave: setAutoSaveEnabled,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
