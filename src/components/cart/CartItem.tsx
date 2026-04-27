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
}: CartItemProps) {
  const imageSrc = item.image
    ? item.image.startsWith("http")
      ? item.image
      : convertFileSrc(item.image)
    : null;

  return (
    <div
      className="border-border tuner-cart-item group hover:border-primary-glow flex flex-col overflow-hidden border"
    >
      {/* Top row: image + info + delete */}
      <div className="flex items-center gap-4 p-[calc(var(--cart-item-padding)*1px)]">
        {/* Thumbnail */}
        <div
          className="border-border/50 shrink-0 overflow-hidden rounded-xl border shadow-sm"
          style={{
            width: "var(--cart-item-image-size)",
            height: "var(--cart-item-image-size)",
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
            className="text-foreground truncate leading-tight font-bold tracking-tight"
            style={{ fontSize: "calc(var(--cart-item-header-font-size) * 0.01em)" }}
          >
            {item.name}
          </h4>
          <div
            className="text-primary mt-1 font-black"
            style={{ fontSize: "calc(var(--cart-item-price-font-size) * 0.0115em)" }}
          >
            {currency}
            {(item.price * item.quantity).toFixed(2)}
          </div>
        </div>

        {/* Delete — extra large touch target */}
        <button
          onClick={() => onRemove(item.id)}
          className="text-muted/40 hover:text-destructive active:text-white hover:bg-destructive/10 active:bg-destructive flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-[color,background-color,transform] duration-200 active:scale-90 will-change-transform"
        >
          <FaTrash size={16} />
        </button>
      </div>

      {/* Bottom row: unit price + quantity controls */}
      <div className="flex items-center justify-between px-[calc(var(--cart-item-padding)*1px)] pb-[calc(var(--cart-item-padding)*1px)]">
        <span className="text-muted-foreground text-[0.8em] font-medium opacity-70">
          {currency}
          {item.price.toFixed(2)} each
        </span>
        <div className="bg-muted/30 border-border/50 flex items-center gap-1 rounded-2xl border p-1 shadow-inner">
          <button
            onClick={() => onUpdateQuantity(item.id, -1)}
            className="bg-card text-foreground hover:bg-muted active:bg-primary active:text-primary-foreground tuner-button flex h-12 w-12 items-center justify-center shadow-sm active:scale-90 active:shadow-lg active:brightness-110 touch-manipulation"
          >
            <FaMinus size={14} />
          </button>
          <span className="w-12 text-center font-black select-none transition-transform duration-200" style={{ fontSize: "calc(var(--cart-item-font-size) * 0.0115em)" }}>
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="bg-card text-foreground hover:bg-muted active:bg-primary active:text-primary-foreground tuner-button flex h-12 w-12 items-center justify-center shadow-sm active:scale-90 active:shadow-lg active:brightness-110 touch-manipulation"
          >
            <FaPlus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
});

export default CartItem;
