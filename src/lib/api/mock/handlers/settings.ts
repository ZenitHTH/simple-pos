import { state } from "../state";
import { AppSettings } from "../../../types";

export const settingHandlers = {
  get_settings: () => state.mockSettings,
  save_settings: ({ settings }: { settings: AppSettings }) => {
    state.mockSettings = { ...settings };
  },
  get_db_status: () => ({ is_connected: true, is_encrypted: true }),
  check_db_password: () => true,
  check_database_exists: () => true,
  initialize_database: () => Promise.resolve(),
  get_storage_info: () => ({
    database_path: "/mock/db.sqlite",
    image_path: "/mock/images",
  }),
};
