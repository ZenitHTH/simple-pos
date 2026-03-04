import { memo, useState } from "react";
import { Product, parseImageStyle } from "@/lib";
import { convertFileSrc } from "@/lib/api/invoke";
import { FaPlus } from "react-icons/fa";

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

  const imageSrc =
    product.image && !imageError ? convertFileSrc(product.image) : null;

  return (
    <div
      onClick={() => onAdd(product)}
      className="group bg-card text-card-foreground border-border hover:border-primary/50 relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95"
    >
      {/* Image Container */}
      <div
        className="bg-muted/20 relative aspect-square w-full overflow-hidden"
        style={{
          backgroundColor: !imageSrc ? product.color || "#e2e8f0" : undefined,
        }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            style={parseImageStyle(product.image_object_position)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold opacity-20">
            {product.name.charAt(0)}
          </div>
        )}

        {/* Hover Overlay with Icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-primary/20">
          <div className="bg-primary text-primary-foreground flex h-12 w-12 translate-y-4 items-center justify-center rounded-full opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <FaPlus size={20} />
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-muted-foreground mb-1 block text-[0.75em] font-medium tracking-wide uppercase">
            {product.category}
          </span>
          <h3 className="text-foreground line-clamp-2 min-h-[2.4em] text-[1.125em] leading-tight font-bold">
            {product.name}
          </h3>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-dashed pt-3">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[0.7em]">Price</span>
            <span className="text-primary text-[1.4em] leading-none font-black">
              {currency}
              {product.price.toFixed(2)}
            </span>
          </div>
          <div className="bg-primary/10 text-primary rounded-lg px-3 py-1.5 text-[0.8em] font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            Add
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
