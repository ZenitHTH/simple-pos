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
import {
  AppSettings,
  settingsApi,
  deepMerge,
  DeepPartial,
  StorageInfo,
} from "@/lib";
import { logger } from "@/lib/utils/logger";
import { DEFAULT_SETTINGS, THEME_PRESETS } from "./constants";
import { useApplySettings } from "./hooks";

interface SettingsContextType {
  settings: AppSettings;
  loading: boolean;
  isSaving: boolean; // Added
  hasUnsavedChanges: boolean; // Added
  storageInfo: StorageInfo | null;
  databaseExists: boolean | null;
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
  const [diskSettings, setDiskSettings] =
    useState<AppSettings>(DEFAULT_SETTINGS); // Track what is actually on disk
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [databaseExists, setDatabaseExists] = useState<boolean | null>(null);
  const [past, setPast] = useState<AppSettings[]>([]);
  const [future, setFuture] = useState<AppSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false); // Default to false now

  // Apply CSS custom properties via custom hook
  useApplySettings(settings);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await settingsApi.getAppInitialState();
      const loadedSettings = deepMerge<AppSettings>(
        DEFAULT_SETTINGS,
        data.settings,
      );
      setSettings(loadedSettings);
      setDiskSettings(loadedSettings); // Sync disk state
      setHasUnsavedChanges(false);
      setStorageInfo(data.storage_info);
      setDatabaseExists(data.database_exists);
    } catch (error) {
      logger.error("Failed to load initial app state:", error);
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
    setHasUnsavedChanges(true); // Undo is an unsaved change
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);

    setPast((prev) => [...prev, settings]);
    setFuture(newFuture);
    setSettings(next);
    setHasUnsavedChanges(true); // Redo is an unsaved change
  };

  const updateSettings = (updates: DeepPartial<AppSettings>) => {
    setSettings((prev) => {
      let toApply = updates;

      if (
        updates.theme?.theme_preset &&
        updates.theme.theme_preset !== "custom"
      ) {
        const preset =
          THEME_PRESETS[
            updates.theme.theme_preset as keyof typeof THEME_PRESETS
          ];
        if (preset) {
          // Merge preset first, then apply user overrides on top of it
          toApply = deepMerge(preset, updates);
        }
      }

      setHasUnsavedChanges(true); // Mark as unsaved on any update
      return deepMerge<AppSettings>(prev, toApply);
    });
  };

  const save = async () => {
    if (!hasUnsavedChanges) return;

    setIsSaving(true);
    try {
      await settingsApi.saveSettings(settings);
      setDiskSettings(settings); // Sync disk state
      setHasUnsavedChanges(false);
      logger.info("Settings manually saved to disk.");
    } catch (error) {
      logger.error("Failed to save settings:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const resetToCheckpoint = async () => {
    // Revert to what is on the disk (Memory Card style)
    setSettings(diskSettings);
    setHasUnsavedChanges(false);
    setPast([]);
    setFuture([]);
  };

  const resetToDefault = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext
      value={{
        settings,
        loading,
        isSaving,
        hasUnsavedChanges,
        storageInfo,
        databaseExists,
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
