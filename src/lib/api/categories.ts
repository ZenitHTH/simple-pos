import { invoke } from "@/lib/api/invoke";
import { Category } from "@/lib/types";

/**
 * API wrapper for category-related operations.
 */
export const categoryApi = {
  /** Retrieves all categories from the database. */
  getAll: async (key: string): Promise<Category[]> => {
    return await invoke("get_categories", { key });
  },

  /** Creates a new category. */
  create: async (key: string, name: string): Promise<Category> => {
    return await invoke("create_category", { key, name });
  },

  /** Updates an existing category's information. */
  update: async (key: string, category: Category): Promise<Category> => {
    return await invoke("update_category", {
      key,
      id: category.id,
      name: category.name,
    });
  },

  /** Deletes a category by its ID. */
  delete: async (key: string, id: number): Promise<void> => {
    await invoke("delete_category", { key, id });
  },
};
