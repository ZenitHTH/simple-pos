import { invoke } from "@tauri-apps/api/core";
import { BackendProduct, NewProduct, Category, NewCategory, ReceiptList, Receipt } from "./types";

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

export const categoryApi = {
    getAll: async (): Promise<Category[]> => {
        return await invoke("get_categories");
    },

    create: async (name: string): Promise<Category> => {
        return await invoke("create_category", { name });
    },

    update: async (category: Category): Promise<Category> => {
        return await invoke("update_category", {
            id: category.id,
            name: category.name,
        });
    },

    delete: async (id: number): Promise<void> => {
        await invoke("delete_category", { id });
    },
};

export const receiptApi = {
    createInvoice: async (): Promise<ReceiptList> => {
        return await invoke("create_invoice");
    },

    addInvoiceItem: async (receiptId: number, productId: number, quantity: number): Promise<Receipt> => {
        return await invoke("add_invoice_item", {
            receiptId: receiptId,
            productId: productId,
            quantity,
        });
    },

    getInvoiceDetail: async (receiptId: number): Promise<[ReceiptList, Receipt[]]> => {
        return await invoke('get_invoice_detail', { receiptId });
    },
    getInvoicesByDate: async (startDate: number, endDate: number): Promise<ReceiptList[]> => {
        return await invoke('get_invoices_by_date', { startUnix: startDate, endUnix: endDate });
    },
    exportReceipts: async (exportPath: String, format: String, startDate: number, endDate: number): Promise<string> => {
        return await invoke('export_receipts', { exportPath, format, startDate: startDate, endDate: endDate });
    }
};
