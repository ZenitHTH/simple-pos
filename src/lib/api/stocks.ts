import { invoke } from "@/lib/api/invoke";
import { Stock } from "@/lib/types";

/**
 * API wrapper for product stock/inventory operations.
 */
export const stockApi = {
  /** Retrieves all stock records. */
  getAll: async (key: string): Promise<Stock[]> => {
    return await invoke("get_all_stocks", { key });
  },

  /** Retrieves the stock record for a specific product. */
  getByProduct: async (key: string, productId: number): Promise<Stock> => {
    return await invoke("get_stock", { key, productId: Number(productId) });
  },

  /** Adds a new stock record for a product. */
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

  /** Updates the quantity for an existing stock record. */
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

  /** Removes a stock record by its ID. */
  remove: async (key: string, stockId: number): Promise<number> => {
    return await invoke("remove_stock", { key, stockId: Number(stockId) });
  },

  /** Exports stock data to a file. */
  exportData: async (
    key: string,
    path: string,
    format: string,
  ): Promise<void> => {
    return await invoke("export_stock_data", { key, path, format });
  },

  /** Imports stock data from a file. */
  importData: async (
    key: string,
    path: string,
    format: string,
  ): Promise<number> => {
    return await invoke("import_stock_data", { key, path, format });
  },
};
