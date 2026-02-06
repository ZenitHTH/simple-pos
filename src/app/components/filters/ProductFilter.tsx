import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface ProductFilterProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

export default function ProductFilter({
    searchQuery,
    onSearchChange,
    categories,
    selectedCategory,
    onCategoryChange
}: ProductFilterProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-3 bg-card-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground placeholder:text-muted/70"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => onCategoryChange(cat)}
                        className={`px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                            ? 'bg-primary text-primary-foreground shadow-lg shadow-blue-500/20'
                            : 'bg-card-bg text-muted border border-border hover:bg-card-hover hover:text-foreground'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
}
