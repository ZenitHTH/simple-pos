export interface BackendProduct {
    product_id: number;
    title: string;
    catagory: string;
    satang: number;
}

export type NewProduct = Omit<BackendProduct, 'product_id'>;

export interface Category {
    id: number;
    name: string;
}

export type NewCategory = Omit<Category, 'id'>;

export interface ReceiptList {
    receipt_id: number;
    datetime_unix: number;
}

export interface Receipt {
    id: number;
    receipt_id: number;
    product_id: number;
    quantity: number;
}

export interface NewReceipt {
    receipt_id: number;
    product_id: number;
    quantity: number;
}
