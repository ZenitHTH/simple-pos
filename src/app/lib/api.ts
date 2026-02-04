import { invoke } from "@tauri-apps/api/core";
import { BackendProduct, NewProduct } from "./types";

export const productApi = {
    getAll: async (): Promise<BackendProduct[]> => {
        return await invoke("get_products");
    },

    create: async (product: NewProduct): Promise<BackendProduct> => {
        return await invoke("create_product", {
            title: product.title,
            catagory: product.catagory,
            satang: product.satang,
        });
    },

    update: async (product: BackendProduct): Promise<BackendProduct> => {
        return await invoke("update_product", {
            id: product.product_id,
            title: product.title,
            catagory: product.catagory,
            satang: product.satang,
        });
    },

    delete: async (id: number): Promise<void> => {
        await invoke("delete_product", { id });
    },
};
