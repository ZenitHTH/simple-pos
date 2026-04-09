import { invoke } from "@/lib/api/invoke";
import { Stock } from "@/lib/types";

export const stockApi = {
  getAll: async (key: string): Promise<Stock[]> => {
    return await invoke("get_all_stocks", { key });
  },

  getByProduct: async (key: string, productId: number): Promise<Stock> => {
    return await invoke("get_stock", { key, productId: Number(productId) });
  },

  add: async (
    key: string,
    productId: number,
    quantity: number,
  ): Promise<Stock> => {
    return await invoke("insert_stock", {
      key,
      productId: Number(productId),
      quantity: Number(quantity),
    });
  },

  update: async (
    key: string,
    productId: number,
    quantity: number,
  ): Promise<Stock> => {
    return await invoke("update_stock", {
      key,
      productId: Number(productId),
      quantity: Number(quantity),
    });
  },

  remove: async (key: string, stockId: number): Promise<number> => {
    return await invoke("remove_stock", { key, stockId: Number(stockId) });
  },
};
