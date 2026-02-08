"use client";

import { usePOSLogic } from '../../hooks/usePOSLogic';
import { Product } from '../types';
import { useSettings } from '../context/SettingsContext';
import POSHeader from './pos/POSHeader';
import POSProductGrid from './pos/POSProductGrid';
import SelectableOverlay from './design-mode/SelectableOverlay';
import Cart from './Cart';
import PaymentModal from './PaymentModal';

interface POSClientProps {
    initialProducts: Product[];
}

export default function POSClient({ initialProducts }: POSClientProps) {
    const { settings } = useSettings();
    const {
        productsSource,
        categories,
        selectedCategory,
        handleCategoryChange,
        searchQuery,
        handleSearchChange,
        cartItems,
        handleAddToCart,
        handleUpdateQuantity,
        handleRemove,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        handleCheckout,
        handleConfirmPayment,
        currency,
        cartTotal
    } = usePOSLogic(initialProducts);

    // Calculate Cart Width
    const cartBaseWidth = 320; // w-80

    const cartDynamicWidth = `${cartBaseWidth * ((settings?.cart_scale || 100) / 100)}px`;

    return (
        <div className="h-full bg-background p-4 flex gap-4 box-border overflow-hidden">
            {/* Left Side: Product Grid */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
                <POSHeader />

                <POSProductGrid
                    products={productsSource}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    settings={settings}
                    onAddToCart={handleAddToCart}
                    currency={currency}
                />
            </div>

            {/* Right Side: Cart Sidebar */}
            <div
                className="shrink-0 hidden lg:block h-full transition-all duration-300"
                style={{
                    width: cartDynamicWidth,
                    fontSize: `${settings?.cart_font_scale || 100}%`
                }}
            >
                <SelectableOverlay id="cart_scale" />
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
                total={cartTotal}
                onConfirm={handleConfirmPayment}
                currency={currency}
            />
        </div>
    );
}
