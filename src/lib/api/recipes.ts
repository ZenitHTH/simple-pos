import { invoke } from "./invoke";
import { RecipeList, RecipeItem } from "../types";

export const recipeApi = {
  createList: async (key: string, product_id: number): Promise<RecipeList> => {
    return await invoke("create_recipe_list", { key, product_id });
  },

  getListByProduct: async (
    key: string,
    product_id: number,
  ): Promise<RecipeList | null> => {
    return await invoke("get_recipe_list_by_product", { key, product_id });
  },

  deleteList: async (key: string, list_id: number): Promise<number> => {
    return await invoke("delete_recipe_list", { key, list_id });
  },

  addItem: async (
    key: string,
    recipe_list_id: number,
    material_id: number,
    volume_use: number,
    unit: string,
  ): Promise<RecipeItem> => {
    return await invoke("add_recipe_item", {
      key,
      recipe_list_id,
      material_id,
      volume_use,
      unit,
    });
  },

  getItems: async (
    key: string,
    recipe_list_id: number,
  ): Promise<RecipeItem[]> => {
    return await invoke("get_recipe_items", { key, recipe_list_id });
  },

  updateItem: async (
    key: string,
    item_id: number,
    volume_use: number,
    unit: string,
  ): Promise<RecipeItem> => {
    return await invoke("update_recipe_item", {
      key,
      item_id,
      volume_use,
      unit,
    });
  },

  deleteItem: async (key: string, item_id: number): Promise<number> => {
    return await invoke("delete_recipe_item", { key, item_id });
  },
};
