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
      <div className="flex items-center gap-4 p-3.5">
        {/* Thumbnail */}
        <div
          className="border-border/50 h-16 w-16 shrink-0 overflow-hidden rounded-xl border shadow-sm"
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
            <div className="text-muted flex h-full w-full items-center justify-center text-[1.25em] font-bold opacity-30">
              {item.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Name + Price */}
        <div className="min-w-0 flex-1">
          <h4
            className="text-foreground truncate text-[1em] leading-tight font-bold tracking-tight"
            style={headerStyle}
          >
            {item.name}
          </h4>
          <div
            className="text-primary mt-1 text-[1.15em] font-black"
            style={priceStyle}
          >
            {currency}
            {(item.price * item.quantity).toFixed(2)}
          </div>
        </div>

        {/* Delete — extra large touch target */}
        <button
          onClick={() => onRemove(item.id)}
          className="text-muted/40 hover:text-destructive active:text-white hover:bg-destructive/10 active:bg-destructive flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all active:scale-90"
        >
          <FaTrash size={16} />
        </button>
      </div>

      {/* Bottom row: unit price + quantity controls */}
      <div className="flex items-center justify-between px-3.5 pb-3.5">
        <span className="text-muted-foreground text-[0.8em] font-medium opacity-70">
          {currency}
          {item.price.toFixed(2)} each
        </span>
        <div className="bg-muted/30 border-border/50 flex items-center gap-1 rounded-2xl border p-1 shadow-inner">
          <button
            onClick={() => onUpdateQuantity(item.id, -1)}
            className="bg-card text-foreground hover:bg-muted active:bg-primary active:text-primary-foreground flex h-12 w-12 items-center justify-center rounded-xl shadow-sm transition-all active:scale-90 active:shadow-lg active:brightness-110 touch-manipulation"
          >
            <FaMinus size={14} />
          </button>
          <span className="w-12 text-center text-[1.15em] font-black select-none transition-transform duration-200">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="bg-card text-foreground hover:bg-muted active:bg-primary active:text-primary-foreground flex h-12 w-12 items-center justify-center rounded-xl shadow-sm transition-all active:scale-90 active:shadow-lg active:brightness-110 touch-manipulation"
          >
            <FaPlus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
});

export default CartItem;
