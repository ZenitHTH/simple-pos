"use client";

import { useState } from "react";
import CartItem from "@/components/cart/CartItem";

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
    itemFontSize: number;
    headerFontSize: number;
    priceFontSize: number;
    padding: number;
    margin: number;
}

export function CartItemTuner({
    itemFontSize,
    headerFontSize,
    priceFontSize,
    padding,
    margin,
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

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
            <div>
                <h2 className="mb-2 text-3xl font-bold">Cart Item</h2>
                <p className="text-muted-foreground">
                    Adjust cart item styling with the sidebar sliders.
                </p>
            </div>

            {/* Live Preview */}
            <div className="border-border bg-card rounded-xl border p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold">Live Preview</h3>
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

            {/* Info card */}
            <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
                <p>
                    <strong>Tip:</strong> Use the sliders in the sidebar to adjust font sizes,
                    padding, and margins. Click <strong>Save Changes</strong> in the bottom bar
                    to apply these settings to the real POS cart.
                </p>
            </div>
        </div>
    );
}
