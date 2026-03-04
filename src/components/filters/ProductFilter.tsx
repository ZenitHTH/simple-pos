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
      <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`rounded-full px-6 py-2.5 text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground shadow-primary/30 shadow-lg"
                : "bg-card text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative flex-1">
        <FaSearch className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search items or scan barcode..."
          className="bg-card text-card-foreground border-border focus:ring-primary/40 placeholder:text-muted-foreground/50 w-full rounded-2xl border py-3.5 pr-12 pl-11 text-lg transition-all focus:ring-4 focus:outline-none"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 p-1 transition-colors"
          >
            <FaTimes size={18} />
          </button>
        )}
      </div>
    </div>
  );
});

export default ProductFilter;
