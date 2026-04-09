"use client";

import { useMemo, memo } from "react";
import ProductCard from "./ProductCard";
import ProductFilter from "@/components/filters/ProductFilter";
import SelectableOverlay from "@/components/design-mode/SelectableOverlay";
import { Product } from "@/lib";
import { AppSettings } from "@/lib";

interface POSProductGridProps {
  products: Product[];
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  settings: AppSettings;
  onAddToCart: (product: Product) => void;
  currency: string;
}

const POSProductGrid = memo(function POSProductGrid({
  products,
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  settings,
  onAddToCart,
  currency,
}: POSProductGridProps) {
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Calculate Grid Columns based on scale
  const gridScale = settings?.grid_scale || 100;
  let gridColsClass =
    "grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4"; // Default M (100)

  if (gridScale <= 50) {
    gridColsClass =
      "grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6";
  } else if (gridScale <= 75) {
    gridColsClass =
      "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5";
  } else if (gridScale >= 150) {
    gridColsClass =
      "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2";
  } else if (gridScale >= 125) {
    gridColsClass =
      "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3";
  }

  return (
    <>
      <div className="mb-6 shrink-0">
        <ProductFilter
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
      </div>

      {/* Product Grid - Scrollable Area */}
      <div
        className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pr-4 -mr-4"
        data-lenis-prevent
      >
        <div
          className={`grid ${gridColsClass} relative gap-5 pb-6`}
          style={{ fontSize: `${settings?.grid_font_scale || 100}%` }}
        >
          <SelectableOverlay id="grid_scale" />
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={onAddToCart}
              currency={currency}
            />
          ))}
        </div>
      </div>
    </>
  );
});

export default POSProductGrid;
