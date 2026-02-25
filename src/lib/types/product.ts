export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string; // URL to image
  color?: string; // Optional background color for placeholder
}

export interface CartItem extends Product {
  quantity: number;
}

export interface BackendProduct {
  product_id: number;
  title: string;
  category_id: number;
  satang: number;
  image_path?: string;
  use_recipe_stock: boolean;
}

export type NewProduct = Omit<BackendProduct, "product_id">;
