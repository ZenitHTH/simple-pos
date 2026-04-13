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

/**
 * POSProductGrid component renders a responsive grid of products with filtering capabilities.
 * It handles category selection, search queries, and dynamic grid scaling based on application settings.
 * 
 * @param {POSProductGridProps} props - The component props.
 * @param {Product[]} props.products - List of products to display.
 * @param {string[]} props.categories - List of available categories for filtering.
 * @param {string} props.selectedCategory - The currently selected category.
 * @param {(category: string) => void} props.onCategoryChange - Callback when a category is selected.
 * @param {string} props.searchQuery - Current search string.
 * @param {(query: string) => void} props.onSearchChange - Callback when search query changes.
 * @param {AppSettings} props.settings - Application settings for UI scaling.
 * @param {(product: Product) => void} props.onAddToCart - Callback when a product is added to the cart.
 * @param {string} props.currency - The currency symbol to display.
 */
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

  // Calculate Grid Layout based on scale (Detailed adjustment)
  const gridScale = settings?.scaling.components.grid || 100;
  
  // Base item width at 100% scale (M)
  // We use a responsive base that gets smaller on mobile
  const baseWidth = typeof window !== 'undefined' && window.innerWidth < 768 ? 160 : 240;
  const itemMinWidth = baseWidth * (gridScale / 100);

  const gridStyle = {
    gridTemplateColumns: `repeat(auto-fill, minmax(${itemMinWidth}px, 1fr))`,
    fontSize: `${settings?.scaling.fonts.grid || 100}%`,
    gap: `${settings?.styling.grid.gap ?? 20}px`
  };

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
          className="grid relative pb-6"
          style={gridStyle}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={onAddToCart}
              currency={currency}
            />
          ))}
          <SelectableOverlay id="grid_scale" />
        </div>
      </div>
    </>
  );
});

export default POSProductGrid;
