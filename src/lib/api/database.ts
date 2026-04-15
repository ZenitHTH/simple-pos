import { invoke } from "@/lib/api/invoke";

/**
 * API wrapper for database management operations.
 */
export const databaseApi = {
  /** Initializes the encrypted database with the provided key. */
  initializeDatabase: async (key: string): Promise<void> => {
    await invoke("initialize_database", { key });
  },

  /** Checks if a database file already exists on the system. */
  checkDatabaseExists: async (): Promise<boolean> => {
    return await invoke("check_database_exists");
  },
};
