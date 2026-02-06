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

interface POSClientProps {
    initialProducts: Product[];
}

export default function POSClient({ initialProducts }: POSClientProps) {
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

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8 flex gap-6 box-border">
            {/* Left Side: Product Grid */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-1">Simple POS</h1>
                        <p className="text-muted">Manage orders efficiently</p>
                    </div>
                    <button
                        onClick={() => router.push('/history')}
                        className="px-4 py-2 bg-card-bg border border-border rounded-lg shadow-sm hover:bg-card-hover transition-colors font-medium text-sm flex items-center gap-2"
                    >
                        <FaReceipt /> History
                    </button>
                </header>

                {/* Filters & Search */}
                <ProductFilter
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                />

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
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

            {/* Right Side: Cart Sidebar */}
            <div className="w-96 shrink-0 hidden lg:block">
                <Cart
                    items={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemove}
                    onCheckout={handleCheckout}
                    currency={currency}
                />
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                total={cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * (1 + taxRate)}
                onConfirm={handleConfirmPayment}
                currency={currency}
            />

            {/* Mobile Cart Toggle (optional, could be added later) */}

            <div className="fixed bottom-4 right-4 lg:hidden">
                {/* ... existing mobile logic if any ... */}
            </div>


        </div>
    );
}
