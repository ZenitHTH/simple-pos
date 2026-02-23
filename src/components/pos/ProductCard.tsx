import { memo, useState } from "react";
import { Product } from "@/lib";
import { convertFileSrc } from "@/lib/api/invoke";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  currency: string;
}

const ProductCard = memo(function ProductCard({
  product,
  onAdd,
  currency,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  // Use the same logic as ProductTable for consistency
  const imageSrc =
    product.image && !imageError ? convertFileSrc(product.image) : null;

  return (
    <div
      onClick={() => onAdd(product)}
      className="group bg-card text-card-foreground border-border hover:border-primary/50 cursor-pointer overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95"
    >
      <div
        className="bg-muted/20 relative aspect-3/2 w-full"
        style={{
          backgroundColor: !imageSrc ? product.color || "#e2e8f0" : undefined,
        }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold opacity-20">
            {product.name.charAt(0)}
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10 hover:bg-transparent" />
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-foreground line-clamp-2 text-[1.25em] leading-tight font-semibold">
            {product.name}
          </h3>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="bg-secondary text-secondary-foreground border-border rounded-full border px-2 py-0.5 text-[1em]">
            {product.category}
          </span>
          <span className="text-primary text-[1.5em] font-bold">
            {currency}
            {product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
