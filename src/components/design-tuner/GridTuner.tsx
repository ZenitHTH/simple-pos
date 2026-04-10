"use client";

import { motion } from "framer-motion";
import { SidebarSlider } from "./SidebarSlider";
import { AppSettings } from "@/lib/types";
import GridItemSize from "@/components/design-mode/GridItemSize";
import ProductCard from "@/components/pos/ProductCard";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Espresso",
    price: 45,
    category: "Coffee",
    image: "",
    color: "#3d2b1f",
  },
  {
    id: 2,
    name: "Croissant",
    price: 35,
    category: "Bakery",
    image: "",
    color: "#d4a373",
  },
  {
    id: 3,
    name: "Blueberry Muffin",
    price: 40,
    category: "Bakery",
    image: "",
    color: "#4a4e69",
  },
  {
    id: 4,
    name: "Latte Hot",
    price: 55,
    category: "Coffee",
    image: "",
    color: "#bc8a5f",
  },
];

interface GridTunerProps {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

export function GridTuner({ settings, updateSettings }: GridTunerProps) {
  // Calculate Grid Layout based on scale (same logic as real grid)
  const gridScale = settings.grid_scale || 100;
  const baseWidth = 180; // Smaller base for preview
  const itemMinWidth = baseWidth * (gridScale / 100);

  const gridStyle = {
    gridTemplateColumns: `repeat(auto-fill, minmax(${itemMinWidth}px, 1fr))`,
    fontSize: `${settings.grid_font_scale || 100}%`,
    gap: `${settings.grid_gap ?? 20}px`,
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      <motion.div variants={item}>
        <h2 className="mb-2 text-3xl font-bold tracking-tight">Product Grid</h2>
        <p className="text-muted-foreground text-lg">
          Adjust the size and spacing of items in the main product catalog.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Controls */}
        <motion.div
          variants={item}
          className="border-border/60 bg-card/50 h-fit space-y-8 rounded-3xl border p-8 shadow-sm backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold">Grid Tuning</h3>
          <div className="space-y-6">
            <GridItemSize
              currentValue={settings.grid_scale || 100}
              onChange={(val) => updateSettings({ grid_scale: val })}
            />
            
            <SidebarSlider
              label="Item Spacing"
              value={settings.grid_gap ?? 20}
              onChange={(v) => updateSettings({ grid_gap: v })}
              min={0}
              max={40}
              unit="px"
            />

            <SidebarSlider
              label="Font Size"
              value={settings.grid_font_scale ?? 100}
              onChange={(v) => updateSettings({ grid_font_scale: v })}
              min={50}
              max={150}
              unit="%"
            />
          </div>
          <div className="bg-primary/5 rounded-2xl border border-primary/10 p-4 text-xs text-muted-foreground leading-relaxed">
            <strong>Tip:</strong> Dragging the <em>Grid Item Size</em> profiles (XS-XL) provides quick jumps, while the detail tuning happens automatically in real-time.
          </div>
        </motion.div>

        {/* Live Preview */}
        <motion.div
          variants={item}
          className="lg:col-span-2 space-y-6"
        >
          <div className="border-border/60 bg-card/30 rounded-3xl border p-8 shadow-xl backdrop-blur-sm relative min-h-[400px]">
             <div 
                className="grid relative"
                style={gridStyle}
             >
                {MOCK_PRODUCTS.map((product) => (
                    <ProductCard 
                        key={product.id} 
                        product={product as any} 
                        onAdd={() => {}} 
                        currency="฿" 
                    />
                ))}
             </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
