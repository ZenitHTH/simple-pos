export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string; // URL to image
    color?: string; // Optional background color for placeholder
}

export interface CartItem extends Product {
    quantity: number;
}
