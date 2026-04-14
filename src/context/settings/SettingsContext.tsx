"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  use,
  useRef,
  ReactNode,
} from "react";
import { AppSettings, settingsApi, deepMerge, DeepPartial } from "@/lib";
import { logger } from "@/lib/logger";
import { DEFAULT_SETTINGS, THEME_PRESETS } from "./constants";
import { useApplySettings } from "./hooks";

interface SettingsContextType {
  settings: AppSettings;
  loading: boolean;
  updateSettings: (updates: DeepPartial<AppSettings>) => void;
  save: () => Promise<void>;
  resetToCheckpoint: () => void;
  resetToDefault: () => void;
  setAutoSave: (enabled: boolean) => void;
  undo: () => void;
  redo: () => void;
  commitHistory: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [past, setPast] = useState<AppSettings[]>([]);
  const [future, setFuture] = useState<AppSettings[]>([]);
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
      setSettings(deepMerge<AppSettings>(DEFAULT_SETTINGS, data));
      setTimeout(() => setIsInitialized(true), 100);
    } catch (error) {
      logger.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const commitHistory = () => {
    setPast((prev) => [...prev.slice(-19), settings]);
    setFuture([]); // Clear future on new action
  };

  const undo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);

    setFuture((prev) => [settings, ...prev]);
    setPast(newPast);
    setSettings(previous);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);

    setPast((prev) => [...prev, settings]);
    setFuture(newFuture);
    setSettings(next);
  };

  const updateSettings = (updates: DeepPartial<AppSettings>) => {
    setSettings((prev) => {
      let next = deepMerge<AppSettings>(prev, updates);

      if (updates.theme?.theme_preset && updates.theme.theme_preset !== "custom") {
        const preset =
          THEME_PRESETS[updates.theme.theme_preset as keyof typeof THEME_PRESETS];
        if (preset) {
          next = deepMerge<AppSettings>(next, preset);
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
    <SettingsContext
      value={{
        settings,
        loading,
        updateSettings,
        save,
        resetToCheckpoint,
        resetToDefault,
        setAutoSave: setAutoSaveEnabled,
        undo,
        redo,
        commitHistory,
        canUndo: past.length > 0,
        canRedo: future.length > 0,
      }}
    >
      {children}
    </SettingsContext>
  );
}

export function useSettings() {
  const context = use(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
