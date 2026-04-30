import { memo, useState } from "react";
import { Product, parseImageStyle } from "@/lib";
import { convertFileSrc } from "@/lib/api/invoke";
import { FaPlus } from "react-icons/fa";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  currency: string;
}

/**
 * ProductCard component displays individual product information in a card format.
 * It shows the product image (or color placeholder), name, category, and price.
 * 
 * @param {ProductCardProps} props - The component props.
 * @param {Product} props.product - The product data to display.
 * @param {(product: Product) => void} props.onAdd - Callback when the card is clicked or the add button is pressed.
 * @param {string} props.currency - The currency symbol to display.
 */
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
      className="tuner-card relative cursor-pointer overflow-hidden transition-[transform,background-color] duration-150 active:scale-95"
    >
      {/* Image Container */}
      <div
        className="bg-muted/20 relative aspect-square w-full overflow-hidden rounded-[inherit]"
        style={{
          backgroundColor: !imageSrc ? product.color || "#e2e8f0" : undefined,
        }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover"
            style={parseImageStyle(product.image_object_position)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold opacity-20">
            {product.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="pt-3 px-1 pb-1">
        <div className="mb-2">
          <span className="text-muted-foreground mb-1 block text-[0.75em] font-semibold tracking-wider uppercase opacity-70">
            {product.category}
          </span>
          <h3 
            className="text-foreground line-clamp-2 min-h-[2.4em] text-[1.125em] leading-tight font-extrabold"
            style={{ fontSize: "var(--grid-item-title-font-scale)" }}
          >
            {product.name}
          </h3>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-dashed border-border/40 pt-3">
          <div className="flex flex-col">
            <span 
              className="text-primary text-[1.4em] leading-none font-black tracking-tight"
              style={{ fontSize: "var(--grid-item-price-font-scale)" }}
            >
              {currency}
              {product.price.toFixed(2)}
            </span>
          </div>
          <div className="bg-primary text-primary-foreground tuner-button rounded-lg px-3 py-1.5 text-[0.8em] font-black uppercase tracking-wider transition-colors hover:bg-primary/90">
            ADD
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
