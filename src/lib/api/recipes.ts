import { invoke } from "@/lib/api/invoke";
import { RecipeList, RecipeItem } from "@/lib/types";

/**
 * API wrapper for product recipe operations (material composition).
 */
export const recipeApi = {
  /** Creates a new recipe list for a product. */
  createList: async (key: string, productId: number): Promise<RecipeList> => {
    return await invoke("create_recipe_list", { key, productId });
  },

  /** Retrieves the recipe list associated with a specific product. */
  getListByProduct: async (
    key: string,
    productId: number,
  ): Promise<RecipeList | null> => {
    return await invoke("get_recipe_list_by_product", { key, productId });
  },

  /** Deletes a recipe list. */
  deleteList: async (key: string, listId: number): Promise<number> => {
    return await invoke("delete_recipe_list", { key, listId });
  },

  /** Adds a material item to a recipe list. */
  addItem: async (
    key: string,
    recipeListId: number,
    materialId: number,
    volumeUse: number,
    unit: string,
  ): Promise<RecipeItem> => {
    return await invoke("add_recipe_item", {
      key,
      recipeListId: Number(recipeListId),
      materialId: Number(materialId),
      volumeUse: Number(volumeUse),
      unit,
    });
  },

  /** Retrieves all material items in a specific recipe list. */
  getItems: async (
    key: string,
    recipeListId: number,
  ): Promise<RecipeItem[]> => {
    return await invoke("get_recipe_items", {
      key,
      recipeListId: Number(recipeListId),
    });
  },

  /** Updates a material item's usage volume and unit in a recipe. */
  updateItem: async (
    key: string,
    itemId: number,
    volumeUse: number,
    unit: string,
  ): Promise<RecipeItem> => {
    return await invoke("update_recipe_item", {
      key,
      itemId: Number(itemId),
      volumeUse: Number(volumeUse),
      unit,
    });
  },

  /** Removes a material item from a recipe. */
  deleteItem: async (key: string, itemId: number): Promise<number> => {
    return await invoke("delete_recipe_item", {
      key,
      itemId: Number(itemId),
    });
  },
};
