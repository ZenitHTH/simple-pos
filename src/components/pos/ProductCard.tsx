import { memo, useState } from "react";
import { Product, parseImageStyle } from "@/lib";
import { convertFileSrc } from "@/lib/api/invoke";
import { FaPlus } from "react-icons/fa";
import { useSettings } from "@/context/settings/SettingsContext";

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
  const { settings } = useSettings();
  const [imageError, setImageError] = useState(false);

  const imageSrc =
    product.image && !imageError ? convertFileSrc(product.image) : null;

  return (
    <div
      onClick={() => onAdd(product)}
      className="group bg-card text-card-foreground border-border hover:border-primary/50 relative cursor-pointer overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl active:scale-92 active:brightness-95 active:shadow-inner touch-manipulation"
      style={{
        padding: `${settings.grid_item_padding ?? 16}px`,
        borderRadius: `${settings.grid_item_radius ?? 24}px`,
      }}
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
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-primary/10 group-active:bg-primary/20">
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
            style={{ fontSize: `${(settings.grid_item_title_font_size ?? 100) * 0.0125}em` }}
          >
            {product.name}
          </h3>
        </div>

          <div className="mt-4 flex items-center justify-between border-t border-dashed border-border/60 pt-4">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[0.75em] font-medium">Price</span>
            <span 
              className="text-primary text-[1.6em] leading-none font-black tracking-tight"
              style={{ fontSize: `${(settings.grid_item_price_font_size ?? 100) * 0.016}em` }}
            >
              {currency}
              {product.price.toFixed(2)}
            </span>
          </div>
          <div className="bg-primary/10 text-primary rounded-xl px-4 py-2 text-[0.9em] font-black tracking-wide group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm group-active:scale-110 active:shadow-md">
            ADD
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
