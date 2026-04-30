import { invoke } from "@/lib/api/invoke";
import { AppSettings, StorageInfo, AppInitialState } from "@/lib/types";

/**
 * API wrapper for application settings and system info.
 */
export const settingsApi = {
  /** Retrieves the consolidated initial state for the application. */
  getAppInitialState: async (): Promise<AppInitialState> => {
    return await invoke("get_app_initial_state");
  },

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

  /** Retrieves the full database state (Backdoor for E2E Truth verification). */
  getDbTruth: async (): Promise<any> => {
    return await invoke("get_db_truth");
  },

  /** Moves the image storage directory to a new location. */
  migrateImageDirectory: async (
    key: string,
    newPath: string,
  ): Promise<void> => {
    await invoke("migrate_image_directory", { key, newPath });
  },
};

// Expose globally for E2E testing
if (typeof window !== 'undefined') {
  (window as any).settingsApi = settingsApi;
  // We'll also allow components to attach the router here
}
