import { invoke } from "@/lib/api/invoke";
import { BackendProduct, NewProduct } from "@/lib/types";

/**
 * API wrapper for product-related operations.
 */
export const productApi = {
  /** Retrieves all products from the database. */
  getAll: async (key: string): Promise<BackendProduct[]> => {
    return await invoke("get_products", { key });
  },

  /** Creates a new product record. */
  create: async (key: string, product: NewProduct): Promise<BackendProduct> => {
    return await invoke("create_product", {
      key,
      title: product.title,
      categoryId: Number(product.category_id),
      satang: Number(product.satang),
      useRecipe: product.use_recipe_stock,
    });
  },

  /** Updates an existing product's title, category, and price. */
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

  /** Deletes a product by its ID. */
  delete: async (key: string, id: number): Promise<void> => {
    await invoke("delete_product", { key, id: Number(id) });
  },

  /** Toggles a product's stock tracking mode (Normal vs. Recipe-based). */
  setStockMode: async (
    key: string,
    id: number,
    useRecipe: boolean,
  ): Promise<void> => {
    await invoke("set_product_stock_mode", { key, id: Number(id), useRecipe });
  },
};

// Expose globally for E2E testing
if (typeof window !== 'undefined') {
  (window as any).productApi = productApi;
}
