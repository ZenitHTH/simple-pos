import { state } from "@/lib/api/mock/state";
import { BackendProduct } from "@/lib/types";

export const productHandlers = {
  get_products: () => state.products,
  create_product: ({
    title,
    categoryId,
    satang,
  }: {
    title: string;
    categoryId: number;
    satang: number;
  }) => {
    const newId = Math.max(0, ...state.products.map((p) => p.product_id)) + 1;
    const newProduct: BackendProduct = {
      product_id: newId,
      title,
      category_id: categoryId,
      satang,
      use_recipe_stock: false,
    };
    state.products.push(newProduct);
    // Also create initial empty stock
    state.stocks.push({
      stock_id: Math.max(0, ...state.stocks.map((s) => s.stock_id)) + 1,
      product_id: newId,
      quantity: 0,
    });
    return newProduct;
  },
  update_product: ({
    id,
    title,
    categoryId,
    satang,
  }: {
    id: number;
    title: string;
    categoryId: number;
    satang: number;
  }) => {
    const product = state.products.find((p) => p.product_id === id);
    if (product) {
      product.title = title;
      product.category_id = categoryId;
      product.satang = satang;
    }
    return product;
  },
  delete_product: ({ id }: { id: number }) => {
    // Check if product is in any receipts
    const hasReceipts = state.receipts.some((r) => r.product_id === id);
    if (hasReceipts) {
      throw new Error(
        "Cannot delete product: it is currently referenced in past receipts. Try archiving instead.",
      );
    }

    state.products = state.products.filter((p) => p.product_id !== id);
    state.stocks = state.stocks.filter((s) => s.product_id !== id);
    state.productImages = state.productImages.filter((pi) => pi.product_id !== id);
  },
  set_product_stock_mode: ({
    id,
    useRecipe,
  }: {
    id: number;
    useRecipe: boolean;
  }) => {
    const product = state.products.find((p) => p.product_id === id);
    if (product) product.use_recipe_stock = useRecipe;
  },
};
