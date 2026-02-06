"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductFilter from './filters/ProductFilter';
import ProductCard from './ProductCard';
import Cart from './Cart';
import PaymentModal from './PaymentModal';
import { Product, CartItem } from '../types';
import { categoryApi, receiptApi } from '../lib/api';
import { FaReceipt } from 'react-icons/fa';
import { useCurrency } from '../../hooks/useCurrency';
import { useTax } from '../hooks/useTax';
import { useSettings } from '../context/SettingsContext';

// ... imports

interface POSClientProps {
    initialProducts: Product[];
}

export default function POSClient({ initialProducts }: POSClientProps) {
    const { settings } = useSettings();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { currency } = useCurrency();
    const { taxRate } = useTax();

    // URL State
    const selectedCategory = searchParams.get('category') || 'All';
    const searchQuery = searchParams.get('search') || '';

    // Local State (Cart)
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [categories, setCategories] = useState<string[]>(["All"]);

    useEffect(() => {
        categoryApi.getAll().then(data => {
            setCategories(["All", ...data.map(c => c.name)]);
        }).catch(err => {
            console.error("Failed to fetch categories", err);
        });
    }, []);

    const updateURL = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'All') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleCategoryChange = (category: string) => {
        updateURL('category', category);
    };

    const handleSearchChange = (query: string) => {
        updateURL('search', query);
    };

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

    // Payment Logic
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        setIsPaymentModalOpen(true);
    };

    const handleConfirmPayment = async (cashReceived: number) => {
        try {
            // 1. Create Invoice Header
            const receiptList = await receiptApi.createInvoice();
            console.log("Invoice created:", receiptList);

            // 2. Add Items
            for (const item of cartItems) {
                await receiptApi.addInvoiceItem(
                    receiptList.receipt_id,
                    item.id,
                    item.quantity
                );
            }

            // 3. Success Feedback
            // ideally we would show a toast here, but for now console + alert
            const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * (1 + taxRate);
            const change = cashReceived - total;
            alert(`Payment Successful!\nChange: ${currency}${change.toFixed(2)}`);

            // 4. Reset
            setCartItems([]);
            setIsPaymentModalOpen(false);
        } catch (error) {
            console.error("Payment failed:", error);
            alert("Payment failed. Please try again.");
        }
    };

    const filteredProducts = initialProducts.filter(product => {
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Calculate Grid Columns based on scale
    // < 90: compact (more columns)
    // > 110: large (fewer columns)
    // default: normal
    const gridScale = settings?.grid_scale || 100;
    let gridColsClass = "grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4";

    if (gridScale < 90) {
        // Compact: Add one column
        gridColsClass = "grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5";
    } else if (gridScale > 110) {
        // Large: Remove one column
        gridColsClass = "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3";
    }

    // Calculate Cart Width
    const cartBaseWidth = 320; // w-80
    const cartWidth2xl = 384; // 2xl:w-96

    const cartDynamicWidth = `${cartBaseWidth * ((settings?.cart_scale || 100) / 100)}px`;
    const cartDynamicWidth2xl = `${cartWidth2xl * ((settings?.cart_scale || 100) / 100)}px`;

    // ... existing logic

    return (
        <div className="h-full bg-background p-4 flex gap-4 box-border overflow-hidden">
            {/* Left Side: Product Grid */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
                {/* ... Header & Filters ... */}
                <header className="mb-4 flex justify-between items-center shrink-0">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground mb-1">Simple POS</h1>
                        <p className="text-muted text-sm">Manage orders efficiently</p>
                    </div>
                    <button
                        onClick={() => router.push('/history')}
                        className="px-4 py-2 bg-card-bg border border-border rounded-lg shadow-sm hover:bg-card-hover transition-colors font-medium text-sm flex items-center gap-2"
                    >
                        <FaReceipt /> History
                    </button>
                </header>

                <div className="shrink-0 mb-4">
                    <ProductFilter
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                    />
                </div>

                {/* Product Grid - Scrollable Area */}
                <div className="flex-1 overflow-y-auto min-h-0 pr-2 custom-scrollbar">
                    <div className={`grid ${gridColsClass} gap-4 pb-4`}>
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAdd={handleAddToCart}
                                currency={currency}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side: Cart Sidebar */}
            {/* We apply dynamic width via style because Tailwind can't interpolate arbitrary values cleanly for responsive states like this without complex overrides */}
            {/* Ideally we use a wrapper with style width */}
            <div
                className="shrink-0 hidden lg:block h-full transition-all duration-300"
                style={{ width: cartDynamicWidth }}
            >
                <Cart
                    items={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemove}
                    onCheckout={handleCheckout}
                    currency={currency}
                />
            </div>

            {/* ... Modals ... */}
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                total={cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * (1 + taxRate)}
                onConfirm={handleConfirmPayment}
                currency={currency}
            />
            {/* ... */}
        </div>
    );
}
