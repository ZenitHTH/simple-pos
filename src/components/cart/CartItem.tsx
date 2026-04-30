import { memo } from "react";
import { CartItem as CartItemType, parseImageStyle } from "@/lib";
import { FaMinus, FaPlus, FaTrash, FaTrashAlt } from "react-icons/fa";
import { convertFileSrc } from "@/lib/api/invoke";

interface CartItemProps {
  item: CartItemType;
  currency: string;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
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
      className="border-border tuner-cart-item flex flex-col overflow-hidden border transition-colors duration-150"
    >
      {/* Top row: image + info + delete */}
      <div className="flex items-center gap-3 p-3">
        {/* Thumbnail */}
        <div
          className="border-border/50 shrink-0 overflow-hidden rounded-xl border"
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
            className="text-primary mt-0.5 font-black"
            style={{ fontSize: "calc(var(--cart-item-price-font-size) * 0.0115em)" }}
          >
            {currency}
            {(item.price * item.quantity).toFixed(2)}
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={() => onRemove(item.id)}
          className="text-muted/40 hover:text-destructive active:text-white flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors active:bg-destructive active:scale-90"
        >
          <FaTrash size={14} />
        </button>
      </div>

      {/* Bottom row: quantity controls */}
      <div className="flex items-center justify-between px-3 pb-3">
        <span className="text-muted-foreground text-[0.8em] font-medium opacity-60">
          {currency}{item.price.toFixed(2)} each
        </span>
        <div className="bg-muted/30 border-border/50 flex items-center rounded-xl border p-0.5">
          <button
            onClick={() => onUpdateQuantity(item.id, -1)}
            className="bg-card text-foreground hover:bg-muted active:bg-primary active:text-primary-foreground flex h-9 w-9 items-center justify-center rounded-lg shadow-sm transition-colors active:scale-90"
          >
            <FaMinus size={12} />
          </button>
          <span className="w-10 text-center font-black select-none" style={{ fontSize: "calc(var(--cart-item-font-size) * 0.0115em)" }}>
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="bg-card text-foreground hover:bg-muted active:bg-primary active:text-primary-foreground flex h-9 w-9 items-center justify-center rounded-lg shadow-sm transition-colors active:scale-90"
          >
            <FaPlus size={12} />
          </button>
        </div>
      </div>
    </div>
  );
});

export default CartItem;
