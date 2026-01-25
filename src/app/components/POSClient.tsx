"use client";

import { useState } from 'react';
import ProductCard from './ProductCard';
import Cart from './Cart';
import { Product, CartItem } from '../types';
import { FaSearch } from 'react-icons/fa';

interface POSClientProps {
    initialProducts: Product[];
}

const CATEGORIES = ["All", "Coffee", "Tea", "Bakery", "Dessert"];

export default function POSClient({ initialProducts }: POSClientProps) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const handleAddToCart = (product: Product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const handleUpdateQuantity = (id: number, delta: number) => {
        setCartItems(prev => {
            return prev.map(item => {
                if (item.id === id) {
                    const newQuantity = Math.max(0, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };

    const handleRemove = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const filteredProducts = initialProducts.filter(product => {
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8 flex gap-6 box-border">
            {/* Left Side: Product Grid */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-1">Simple POS</h1>
                    <p className="text-muted">Manage orders efficiently</p>
                </header>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-3 bg-card-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground placeholder:text-muted/70"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-blue-500/20'
                                        : 'bg-card-bg text-muted border border-border hover:bg-card-hover hover:text-foreground'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAdd={handleAddToCart}
                        />
                    ))}
                </div>
            </div>

            {/* Right Side: Cart Sidebar */}
            <div className="w-96 shrink-0 hidden lg:block">
                <Cart
                    items={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemove}
                />
            </div>

            {/* Mobile Cart Toggle (optional, could be added later) */}
        </div>
    );
}
