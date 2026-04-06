import { invoke } from "./invoke";
import { Category } from "../types";

export const categoryApi = {
  getAll: async (key: string): Promise<Category[]> => {
    return await invoke("get_categories", { key });
  },

  create: async (key: string, name: string): Promise<Category> => {
    return await invoke("create_category", { key, name });
  },

  update: async (key: string, category: Category): Promise<Category> => {
    return await invoke("update_category", {
      key,
      id: category.id,
      name: category.name,
    });
  },

  delete: async (key: string, id: number): Promise<void> => {
    await invoke("delete_category", { key, id });
  },
};
