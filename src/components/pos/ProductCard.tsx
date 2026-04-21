import { memo, useState } from "react";
import { Product, parseImageStyle } from "@/lib";
import { convertFileSrc } from "@/lib/api/invoke";
import { FaPlus } from "react-icons/fa";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  currency: string;
  titleFontSizeScale: number;
  priceFontSizeScale: number;
}

/**
 * ProductCard component displays individual product information in a card format.
 * It shows the product image (or color placeholder), name, category, and price.
 * 
 * @param {ProductCardProps} props - The component props.
 * @param {Product} props.product - The product data to display.
 * @param {(product: Product) => void} props.onAdd - Callback when the card is clicked or the add button is pressed.
 * @param {string} props.currency - The currency symbol to display.
 * @param {number} props.titleFontSizeScale - The font size scale for the product title.
 * @param {number} props.priceFontSizeScale - The font size scale for the product price.
 */
const ProductCard = memo(function ProductCard({
  product,
  onAdd,
  currency,
  titleFontSizeScale,
  priceFontSizeScale,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const imageSrc =
    product.image && !imageError ? convertFileSrc(product.image) : null;

  return (
    <div
      onClick={() => onAdd(product)}
      className="group tuner-card relative cursor-pointer overflow-hidden active:scale-95 active:brightness-95 active:shadow-inner touch-manipulation"
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
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-active:scale-105"
            style={parseImageStyle(product.image_object_position)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold opacity-20">
            {product.name.charAt(0)}
          </div>
        )}

        {/* Hover/Tap Overlay with Icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-primary-muted group-active:bg-primary-glow">
          <div className="bg-primary text-primary-foreground flex h-14 w-14 translate-y-4 items-center justify-center rounded-2xl opacity-0 shadow-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-active:scale-110">
            <FaPlus size={24} />
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="pt-4 px-1 pb-1">
        <div className="mb-3">
          <span className="text-muted-foreground mb-1.5 block text-[0.8em] font-semibold tracking-wider uppercase opacity-80">
            {product.category}
          </span>
          <h3 
            className="text-foreground line-clamp-2 min-h-[2.4em] text-[1.25em] leading-tight font-extrabold tracking-tight"
            style={{ fontSize: `${titleFontSizeScale * 0.0125}em` }}
          >
            {product.name}
          </h3>
        </div>

          <div className="mt-4 flex items-center justify-between border-t border-dashed border-border/60 pt-4">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[0.75em] font-medium">Price</span>
            <span 
              className="text-primary text-[1.6em] leading-none font-black tracking-tight"
              style={{ fontSize: `${priceFontSizeScale * 0.016}em` }}
            >
              {currency}
              {product.price.toFixed(2)}
            </span>
          </div>
          <div className="bg-primary-muted text-primary tuner-button px-4 py-2 text-[0.9em] font-black tracking-wide group-hover:bg-primary-hover group-hover:text-primary-foreground transition-all shadow-sm group-active:scale-110 active:shadow-md">
            ADD
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
