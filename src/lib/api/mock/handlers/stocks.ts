import { state } from "../state";
import { Stock } from "../../../types";

export const stockHandlers = {
  get_all_stocks: () => state.stocks,
  get_stock: ({ productId }: { productId: number }) => {
    return state.stocks.find((s) => s.product_id === productId) || null;
  },
  insert_stock: ({
    productId,
    quantity,
  }: {
    productId: number;
    quantity: number;
  }) => {
    const existing = state.stocks.find((s) => s.product_id === productId);
    if (existing) {
      existing.quantity += quantity;
      return existing;
    }
    const newStock: Stock = {
      stock_id: Math.max(0, ...state.stocks.map((s) => s.stock_id)) + 1,
      product_id: productId,
      quantity,
    };
    state.stocks.push(newStock);
    return newStock;
  },
  update_stock: ({
    productId,
    quantity,
  }: {
    productId: number;
    quantity: number;
  }) => {
    const existing = state.stocks.find((s) => s.product_id === productId);
    if (existing) {
      existing.quantity = quantity;
      return existing;
    }
    const newStock: Stock = {
      stock_id: Math.max(0, ...state.stocks.map((s) => s.stock_id)) + 1,
      product_id: productId,
      quantity,
    };
    state.stocks.push(newStock);
    return newStock;
  },
  remove_stock: ({ stockId }: { stockId: number }) => {
    const count = state.stocks.length;
    state.stocks = state.stocks.filter((s) => s.stock_id !== stockId);
    return count - state.stocks.length;
  },
};
