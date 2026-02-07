import { Product } from '@/app/types';

export const exampleProducts: Product[] = [
    { id: 1, name: "Iced Americano", price: 4.50, category: "Coffee", image: "", color: "#78350f" },
    { id: 2, name: "Cappuccino", price: 5.00, category: "Coffee", image: "", color: "#d97706" },
    { id: 3, name: "Latte", price: 5.25, category: "Coffee", image: "", color: "#b45309" },
    { id: 4, name: "Espresso", price: 3.50, category: "Coffee", image: "", color: "#451a03" },
    { id: 5, name: "Mocha", price: 5.50, category: "Coffee", image: "", color: "#92400e" },
    { id: 6, name: "Caramel Macchiato", price: 5.75, category: "Coffee", image: "", color: "#d97706" },
    { id: 7, name: "Matcha Latte", price: 5.50, category: "Tea", image: "", color: "#166534" },
    { id: 8, name: "Croissant", price: 3.75, category: "Bakery", image: "", color: "#f59e0b" },
    { id: 9, name: "Blueberry Muffin", price: 4.00, category: "Bakery", image: "", color: "#6366f1" },
    { id: 10, name: "Cheesecake", price: 6.50, category: "Dessert", image: "", color: "#eab308" },
    { id: 11, name: "Chocolate Cake", price: 6.00, category: "Dessert", image: "", color: "#3f3f46" },
    { id: 12, name: "Iced Tea", price: 3.50, category: "Tea", image: "", color: "#ef4444" },

];

import { CartItem } from '@/app/types';

export const exampleCartItems: CartItem[] = [
    { ...exampleProducts[0], quantity: 2 },
    { ...exampleProducts[7], quantity: 1 },
    { ...exampleProducts[4], quantity: 3 },
];
