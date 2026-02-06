import { invoke } from '@tauri-apps/api/core';

export interface AppSettings {
    currency_symbol: string;
    tax_enabled: boolean;
    tax_rate: number;
    display_scale: number;
    sidebar_scale: number;
    cart_scale: number;
    grid_scale: number;
}

export async function getSettings(): Promise<AppSettings> {
    return await invoke('get_settings');
}

export async function saveSettings(settings: AppSettings): Promise<void> {
    await invoke('save_settings', { settings });
}
