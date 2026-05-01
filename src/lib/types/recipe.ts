import { BackendProduct } from "./product";
import { Material } from "./material";

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

export interface RecipeRow {
  product: BackendProduct;
  list: RecipeList;
  items: RecipeItem[];
  materials: Material[];
}

export interface SimpleRecipeItem {
  material_id: number;
  name: string;
  volume_use: number;
  unit: string;
}
