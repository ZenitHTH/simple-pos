import { state } from "../state";
import { RecipeList, RecipeItem } from "../../../types";

export const recipeHandlers = {
  get_recipe_list_by_product: ({ productId }: { productId: number }) => {
    return state.recipeLists.find((l) => l.product_id === productId) || null;
  },
  create_recipe_list: ({ productId }: { productId: number }) => {
    const newList: RecipeList = {
      id: Math.max(0, ...state.recipeLists.map((l) => l.id)) + 1,
      product_id: productId,
    };
    state.recipeLists.push(newList);
    return newList;
  },
  delete_recipe_list: ({ listId }: { listId: number }) => {
    const count = state.recipeLists.length;
    state.recipeLists = state.recipeLists.filter((l) => l.id !== listId);
    state.recipeItems = state.recipeItems.filter((i) => i.recipe_list_id !== listId);
    return count - state.recipeLists.length;
  },
  get_recipe_items: ({ recipeListId }: { recipeListId: number }) => {
    return state.recipeItems.filter((i) => i.recipe_list_id === recipeListId);
  },
  add_recipe_item: ({
    recipeListId,
    materialId,
    volumeUse,
    unit,
  }: {
    recipeListId: number;
    materialId: number;
    volumeUse: number;
    unit: string;
  }) => {
    const newItem: RecipeItem = {
      id: Math.max(0, ...state.recipeItems.map((i) => i.id)) + 1,
      recipe_list_id: recipeListId,
      material_id: materialId,
      volume_use: volumeUse,
      volume_use_precision: 4,
      unit,
    };
    state.recipeItems.push(newItem);
    return newItem;
  },
  update_recipe_item: ({
    itemId,
    volumeUse,
    unit,
  }: {
    itemId: number;
    volumeUse: number;
    unit: string;
  }) => {
    const item = state.recipeItems.find((i) => i.id === itemId);
    if (item) {
      item.volume_use = volumeUse;
      item.unit = unit;
    }
    return item;
  },
  delete_recipe_item: ({ itemId }: { itemId: number }) => {
    const count = state.recipeItems.length;
    state.recipeItems = state.recipeItems.filter((i) => i.id !== itemId);
    return count - state.recipeItems.length;
  },
};
