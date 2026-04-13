import { invoke } from "@/lib/api/invoke";
import { AppSettings, StorageInfo } from "@/lib/types";

/**
 * API wrapper for application settings and system info.
 */
export const settingsApi = {
  /** Retrieves all application settings from the configuration file. */
  getSettings: async (): Promise<AppSettings> => {
    return await invoke("get_settings");
  },

  /** Saves application settings to the configuration file. */
  saveSettings: async (settings: AppSettings): Promise<void> => {
    await invoke("save_settings", { settings });
  },

  /** Retrieves information about system storage paths. */
  getStorageInfo: async (): Promise<StorageInfo> => {
    return await invoke("get_storage_info");
  },

  /** Moves the image storage directory to a new location. */
  migrateImageDirectory: async (
    key: string,
    newPath: string,
  ): Promise<void> => {
    await invoke("migrate_image_directory", { key, newPath });
  },
};

