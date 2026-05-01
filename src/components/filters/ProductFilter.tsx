import React, { memo, useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Input } from "@/components/ui/Input";

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
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onSearchChange(localSearch);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearch, onSearchChange, searchQuery]);

  return (
    <div className="flex flex-col gap-5">
      {/* Categories Row - One tap access */}
      <div className="scrollbar-hide -mx-1 flex snap-x snap-mandatory items-center gap-3 overflow-x-auto scroll-smooth px-1 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`touch-manipulation snap-start rounded-xl px-7 py-3.5 text-base font-bold whitespace-nowrap shadow-sm transition-all active:scale-90 ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground shadow-primary/30 scale-105 shadow-lg"
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
          <FaSearch className="text-muted-foreground absolute top-1/2 left-5 z-10 -translate-y-1/2 text-xl" />
          <Input
            type="text"
            placeholder="Search items..."
            className="h-[70px] rounded-2xl pr-14 pl-12 text-xl"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch("");
                onSearchChange("");
              }}
              className="text-muted-foreground hover:text-foreground hover:bg-muted absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full p-2 transition-colors"
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
          <span className="text-[10px] font-black tracking-widest uppercase">
            SCAN
          </span>
        </button>
      </div>
    </div>
  );
});

export default ProductFilter;
