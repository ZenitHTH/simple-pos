import { invoke } from "./invoke";
import { RecipeList, RecipeItem } from "../types";

export const recipeApi = {
  createList: async (key: string, productId: number): Promise<RecipeList> => {
    return await invoke("create_recipe_list", { key, productId });
  },

  getListByProduct: async (
    key: string,
    productId: number,
  ): Promise<RecipeList | null> => {
    return await invoke("get_recipe_list_by_product", { key, productId });
  },

  deleteList: async (key: string, listId: number): Promise<number> => {
    return await invoke("delete_recipe_list", { key, listId });
  },

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

  getItems: async (
    key: string,
    recipeListId: number,
  ): Promise<RecipeItem[]> => {
    return await invoke("get_recipe_items", {
      key,
      recipeListId: Number(recipeListId),
    });
  },

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

  deleteItem: async (key: string, itemId: number): Promise<number> => {
    return await invoke("delete_recipe_item", {
      key,
      itemId: Number(itemId),
    });
  },
};
