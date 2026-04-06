export interface RecipeList {
  id: number;
  product_id: number;
}

export interface RecipeItem {
  id: number;
  recipe_list_id: number;
  material_id: number;
  volume_use: number;
  unit: string;
  volume_use_precision: number;
}
