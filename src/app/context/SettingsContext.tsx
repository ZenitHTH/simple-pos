"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings, getSettings, saveSettings } from '@/lib/settings';

interface SettingsContextType {
    settings: AppSettings;
    loading: boolean;
    updateSettings: (updates: Partial<AppSettings>) => void;
    save: () => Promise<void>;
    resetToCheckpoint: () => void; // Reverts to last saved state
    resetToDefault: () => void; // Reverts to hardcoded defaults
}

const DEFAULT_SETTINGS: AppSettings = {
    currency_symbol: '$',
    tax_enabled: true,
    tax_rate: 7.0,
    display_scale: 100.0,
    sidebar_scale: 100.0,
    cart_scale: 100.0,
    grid_scale: 100.0,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, []);

    // Apply scaling whenever settings.display_scale changes
    useEffect(() => {
        if (settings.display_scale) {
            document.documentElement.style.fontSize = `${settings.display_scale}%`;
        }
    }, [settings.display_scale]);

    const load = async () => {
        try {
            const data = await getSettings();
            // Ensure display_scale exists (migration for old saves)
            setSettings({ ...DEFAULT_SETTINGS, ...data });
        } catch (error) {
            console.error("Failed to load settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = (updates: Partial<AppSettings>) => {
        setSettings(prev => ({ ...prev, ...updates }));
    };

    const save = async () => {
        try {
            await saveSettings(settings);
            // Optionally fetch again or just assume success
        } catch (error) {
            console.error("Failed to save settings:", error);
            throw error;
        }
    };

    const resetToCheckpoint = async () => {
        setLoading(true);
        await load();
    };

    const resetToDefault = () => {
        setSettings(DEFAULT_SETTINGS);
        // Note: we don't save immediately, user must click Save.
        // Or should we? "Reset to Default" usually implies action.
        // Let's leave it as state change, user clicks Save to confirm.
        // But the button says "Reset to Default" which feels immediate.
        // If "Reset" is a destructive action (clearing all "cookies" equivalent), maybe it should save.
        // However, the new flow is "click Save to persist".
        // Let's treating it as just updating the form.
    };

    return (
        <SettingsContext.Provider value={{
            settings,
            loading,
            updateSettings,
            save,
            resetToCheckpoint,
            resetToDefault
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
