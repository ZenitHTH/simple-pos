"use client";

import { useState } from "react";
import CartItem from "@/components/cart/CartItem";
import { AppSettings } from "@/lib/types/settings";
import { CartItemStylesPanel } from "./CartItemStylesPanel";
import { motion } from "framer-motion";

const SAMPLE_ITEMS = [
    {
        id: 1,
        name: "Latte Hot",
        price: 55,
        category: "Coffee",
        image: "",
        color: "#8B5E3C",
        quantity: 2,
    },
    {
        id: 2,
        name: "Green Tea Matcha Frappe",
        price: 75,
        category: "Tea",
        image: "",
        color: "#4A7C59",
        quantity: 1,
    },
    {
        id: 3,
        name: "Croissant",
        price: 45,
        category: "Bakery",
        image: "",
        color: "#D4A574",
        quantity: 3,
    },
];

interface CartItemTunerProps {
    settings: AppSettings;
    updateSettings: (updates: Partial<AppSettings>) => void;
}

export function CartItemTuner({
    settings,
    updateSettings,
}: CartItemTunerProps) {
    const [items, setItems] = useState(SAMPLE_ITEMS);

    const handleUpdateQuantity = (id: number, delta: number) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item,
            ),
        );
    };

    const handleRemove = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
        // Reset after a moment so items come back
        setTimeout(() => setItems(SAMPLE_ITEMS), 1500);
    };

    const margin = settings.cart_item_margin ?? 8;
    const padding = settings.cart_item_padding ?? 10;
    const itemFontSize = settings.cart_item_font_size ?? 100;
    const headerFontSize = settings.cart_item_header_font_size ?? 100;
    const priceFontSize = settings.cart_item_price_font_size ?? 100;

    return (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Left Column: Styles Panel */}
            <div className="lg:col-span-1">
                <div className="sticky top-10 space-y-6">
                    <div>
                        <h2 className="mb-2 text-3xl font-bold">Cart Item</h2>
                        <p className="text-muted-foreground">
                            Adjust cart item styling with the dedicated sliders.
                        </p>
                    </div>
                    <CartItemStylesPanel settings={settings} updateSettings={updateSettings} />
                    
                    {/* Info card */}
                    <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground mt-6">
                        <p>
                            <strong>Tip:</strong> Use the sliders above to adjust font sizes,
                            padding, and margins. Click <strong>Save Changes</strong> in the bottom bar
                            to apply these settings to the real POS cart.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column: Live Preview */}
            <div className="lg:col-span-2 space-y-8">
                <div className="border-border bg-card rounded-xl border p-6 shadow-sm">
                    <h3 className="mb-6 text-lg font-semibold">Live Preview</h3>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: `${margin}px`,
                        }}
                    >
                        {items.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                currency="฿"
                                onUpdateQuantity={handleUpdateQuantity}
                                onRemove={handleRemove}
                                itemFontSize={itemFontSize}
                                headerFontSize={headerFontSize}
                                priceFontSize={priceFontSize}
                                itemPadding={padding}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
