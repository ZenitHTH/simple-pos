"use client";

import { useState } from "react";
import CartItem from "@/components/cart/CartItem";
import { AppSettings, DeepPartial } from "@/lib/types/settings";
import { CartItemStylesPanel } from "../panels/CartItemStylesPanel";
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVar = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

interface CartItemTunerProps {
  settings: AppSettings;
  updateSettings: (updates: DeepPartial<AppSettings>) => void;
}

/**
 * CartItemTuner Component
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
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

  const margin = settings.styling.cart.margin ?? 8;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-10 lg:grid-cols-3"
    >
      {/* Left Column: Styles Panel */}
      <div className="lg:col-span-1">
        <div className="sticky top-10 space-y-6">
          <motion.div variants={itemVar}>
            <h2 className="mb-2 text-3xl font-bold tracking-tight">
              Cart Item
            </h2>
            <p className="text-muted-foreground text-lg">
              Fine-tune the individual item cards in the checkout list.
            </p>
          </motion.div>

          <CartItemStylesPanel
            settings={settings}
            updateSettings={updateSettings}
          />

          <motion.div
            variants={itemVar}
            className="bg-primary/5 border-primary/10 text-muted-foreground rounded-2xl border p-4 text-xs leading-relaxed"
          >
            <p>
              <strong>Tip:</strong> These styles affect item density and
              readability. Glass opacity works best when the background has
              content behind it.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Column: Live Preview */}
      <motion.div variants={itemVar} className="space-y-8 lg:col-span-2">
        <div className="border-border/60 bg-card/30 min-h-[500px] rounded-3xl border p-10 shadow-xl backdrop-blur-sm">
          <h3 className="mb-8 text-xl font-bold">Checkout Preview</h3>
          <div
            className="transition-all duration-300"
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
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
