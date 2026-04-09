import { invoke } from "@/lib/api/invoke";

export const databaseApi = {
  initializeDatabase: async (key: string): Promise<void> => {
    await invoke("initialize_database", { key });
  },

  checkDatabaseExists: async (): Promise<boolean> => {
    return await invoke("check_database_exists");
  },
};
