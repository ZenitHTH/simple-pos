import React, { memo } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

interface ProductFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const ProductFilter = memo(function ProductFilter({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
}: ProductFilterProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Categories Row - One tap access */}
      <div className="scrollbar-hide flex snap-x snap-mandatory items-center gap-3 overflow-x-auto pb-2 -mx-1 px-1 scroll-smooth">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`snap-start rounded-xl px-7 py-3.5 text-base font-bold whitespace-nowrap transition-all active:scale-90 touch-manipulation shadow-sm ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground shadow-primary/30 shadow-lg scale-105"
                : "bg-card text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Bar + Scan */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <FaSearch className="text-muted-foreground absolute top-1/2 left-5 -translate-y-1/2 text-xl" />
          <input
            type="text"
            placeholder="Search items..."
            className="bg-card text-card-foreground border-border focus:ring-primary/40 focus:border-primary placeholder:text-muted-foreground/50 w-full rounded-2xl border py-4.5 pr-14 pl-12 text-xl transition-all focus:ring-4 focus:outline-none"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 p-2 transition-colors rounded-full hover:bg-muted"
            >
              <FaTimes size={22} />
            </button>
          )}
        </div>
        <button
          className="bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground border-border flex h-[70px] flex-col items-center justify-center gap-1 rounded-2xl border px-6 transition-all active:scale-95 active:shadow-inner"
          title="Scan Barcode"
        >
          <div className="flex gap-0.5">
            <div className="h-4 w-0.5 bg-current opacity-30"></div>
            <div className="h-4 w-1 bg-current"></div>
            <div className="h-4 w-0.5 bg-current"></div>
            <div className="h-4 w-1 bg-current opacity-50"></div>
          </div>
          <span className="text-[10px] font-black tracking-widest uppercase">SCAN</span>
        </button>
      </div>
    </div>
  );
});

export default ProductFilter;
