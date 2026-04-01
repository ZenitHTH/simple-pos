import { invoke } from "./invoke";
import { Stock } from "../types";

export const stockApi = {
  getAll: async (key: string): Promise<Stock[]> => {
    return await invoke("get_all_stocks", { key });
  },

  getByProduct: async (key: string, product_id: number): Promise<Stock> => {
    return await invoke("get_stock", { key, product_id });
  },

  add: async (
    key: string,
    product_id: number,
    quantity: number,
  ): Promise<Stock> => {
    return await invoke("insert_stock", { key, product_id, quantity });
  },

  update: async (
    key: string,
    product_id: number,
    quantity: number,
  ): Promise<Stock> => {
    return await invoke("update_stock", { key, product_id, quantity });
  },

  remove: async (key: string, stock_id: number): Promise<number> => {
    return await invoke("remove_stock", { key, stock_id });
  },
};
