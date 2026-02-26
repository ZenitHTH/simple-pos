import { memo } from "react";
import { CartItem as CartItemType, parseImageStyle } from "@/lib";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { convertFileSrc } from "@/lib/api/invoke";

interface CartItemProps {
  item: CartItemType;
  currency: string;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  /** Override font sizes & padding (from tuner or settings) */
  itemFontSize?: number;
  headerFontSize?: number;
  priceFontSize?: number;
  itemPadding?: number;
}

const CartItem = memo(function CartItem({
  item,
  currency,
  onUpdateQuantity,
  onRemove,
  itemFontSize,
  headerFontSize,
  priceFontSize,
  itemPadding,
}: CartItemProps) {
  const imageSrc = item.image
    ? item.image.startsWith("http")
      ? item.image
      : convertFileSrc(item.image)
    : null;

  // Build dynamic styles from props (percentages → em scale, padding → px)
  const containerStyle: React.CSSProperties = {
    ...(itemFontSize != null && itemFontSize !== 100
      ? { fontSize: `${itemFontSize}%` }
      : {}),
    ...(itemPadding != null ? { padding: `${itemPadding}px` } : {}),
  };

  const headerStyle: React.CSSProperties =
    headerFontSize != null && headerFontSize !== 100
      ? { fontSize: `${headerFontSize}%` }
      : {};

  const priceStyle: React.CSSProperties =
    priceFontSize != null && priceFontSize !== 100
      ? { fontSize: `${priceFontSize}%` }
      : {};

  return (
    <div
      className="bg-background border-border group hover:border-primary/30 overflow-hidden rounded-lg border transition-colors"
      style={containerStyle}
    >
      {/* Top row: image + info + delete */}
      <div className="flex items-center gap-3 p-2.5">
        {/* Thumbnail */}
        <div
          className="border-border/50 h-14 w-14 shrink-0 overflow-hidden rounded-lg border"
          style={{
            backgroundColor: !imageSrc ? item.color || "#e2e8f0" : undefined,
          }}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={item.name}
              className="h-full w-full object-cover"
              style={parseImageStyle(item.image_object_position)}
            />
          ) : (
            <div className="text-muted flex h-full w-full items-center justify-center text-[1em] font-bold opacity-30">
              {item.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Name + Price */}
        <div className="min-w-0 flex-1">
          <h4
            className="text-foreground truncate text-[0.875em] leading-tight font-medium"
            style={headerStyle}
          >
            {item.name}
          </h4>
          <div
            className="text-primary mt-0.5 text-[1em] font-bold"
            style={priceStyle}
          >
            {currency}
            {(item.price * item.quantity).toFixed(2)}
          </div>
        </div>

        {/* Delete — touch-friendly 44px target */}
        <button
          onClick={() => onRemove(item.id)}
          className="text-muted/40 hover:text-destructive active:text-destructive hover:bg-destructive/10 active:bg-destructive/15 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors"
        >
          <FaTrash size={14} />
        </button>
      </div>

      {/* Bottom row: unit price + quantity controls */}
      <div className="flex items-center justify-between px-2.5 pb-2.5">
        <span className="text-muted-foreground text-[0.75em]">
          {currency}
          {item.price.toFixed(2)} each
        </span>
        <div className="bg-card border-border flex items-center rounded-lg border">
          <button
            onClick={() => onUpdateQuantity(item.id, -1)}
            className="hover:bg-muted/20 active:bg-muted/30 text-muted hover:text-foreground flex h-11 w-11 items-center justify-center rounded-l-lg transition-colors"
          >
            <FaMinus size={12} />
          </button>
          <span className="w-8 text-center text-[0.875em] font-semibold select-none">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="hover:bg-muted/20 active:bg-muted/30 text-muted hover:text-foreground flex h-11 w-11 items-center justify-center rounded-r-lg transition-colors"
          >
            <FaPlus size={12} />
          </button>
        </div>
      </div>
    </div>
  );
});

export default CartItem;
