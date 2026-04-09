import { invoke } from "@/lib/api/invoke";
import { BackendProduct, NewProduct } from "@/lib/types";

export const productApi = {
  getAll: async (key: string): Promise<BackendProduct[]> => {
    return await invoke("get_products", { key });
  },

  create: async (key: string, product: NewProduct): Promise<BackendProduct> => {
    return await invoke("create_product", {
      key,
      title: product.title,
      categoryId: Number(product.category_id),
      satang: Number(product.satang),
      useRecipe: product.use_recipe_stock,
    });
  },

  update: async (
    key: string,
    product: BackendProduct,
  ): Promise<BackendProduct> => {
    return await invoke("update_product", {
      key,
      id: Number(product.product_id),
      title: product.title,
      categoryId: Number(product.category_id),
      satang: Number(product.satang),
    });
  },

  delete: async (key: string, id: number): Promise<void> => {
    await invoke("delete_product", { key, id: Number(id) });
  },

  setStockMode: async (
    key: string,
    id: number,
    useRecipe: boolean,
  ): Promise<void> => {
    await invoke("set_product_stock_mode", { key, id: Number(id), useRecipe });
  },
};
