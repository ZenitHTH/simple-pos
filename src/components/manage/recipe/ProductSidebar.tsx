"use client";

import { BackendProduct } from "@/lib";
import { FaBoxOpen } from "react-icons/fa";
import { useState } from "react";
import { SearchInput } from "@/components/ui/SearchInput";

interface ProductSidebarProps {
  products: BackendProduct[];
  onDragStart: (
    event: React.DragEvent,
    nodeType: string,
    nodeData: any,
  ) => void;
}

export default function ProductSidebar({
  products,
  onDragStart,
}: ProductSidebarProps) {
  const [productSearch, setProductSearch] = useState("");

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(productSearch.toLowerCase()),
  );

  return (
    <aside className="bg-muted/30 border-border flex h-full w-64 flex-col border-l p-4 shadow-inner">
      <h3 className="text-muted-foreground mb-4 flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
        <FaBoxOpen className="text-secondary-foreground" /> Products
      </h3>

      <SearchInput
        placeholder="Search products..."
        value={productSearch}
        onChange={(e) => setProductSearch(e.target.value)}
        containerClassName="mb-4 shrink-0"
        className="py-2 pr-2 text-xs"
      />

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {filteredProducts.map((product) => (
          <div
            key={`p-${product.product_id}`}
            className="bg-card border-border hover:border-secondary/50 hover:bg-muted/50 group flex cursor-grab items-center gap-3 overflow-hidden rounded-xl border p-3 text-sm shadow-sm transition-all active:cursor-grabbing"
            onDragStart={(event) =>
              onDragStart(event, "product", {
                id: product.product_id,
                label: product.title,
                price: product.satang,
              })
            }
            draggable
          >
            <div className="bg-secondary/10 text-secondary-foreground group-hover:bg-secondary rounded-lg p-2 transition-colors group-hover:text-white">
              <FaBoxOpen className="shrink-0" />
            </div>
            <span className="truncate font-medium">{product.title}</span>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-muted-foreground py-8 text-center text-xs italic">
            No products found
          </div>
        )}
      </div>
    </aside>
  );
}
