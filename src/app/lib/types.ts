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
