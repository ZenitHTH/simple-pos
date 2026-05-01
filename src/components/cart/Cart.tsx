import { memo } from "react";
import { CartItem as CartItemType, Customer } from "@/lib";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import CartEmpty from "./CartEmpty";
import { useTax } from "@/hooks/settings/useTax";
import { useSettings } from "@/context/settings/SettingsContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

interface CartProps {
  items: CartItemType[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
  currency: string;
  customers: Customer[];
  selectedCustomerId?: number;
  onCustomerSelect: (id: number | undefined) => void;
  itemsCount: number;
}

const Cart = memo(function Cart({
  items,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  currency,
  customers,
  selectedCustomerId,
  onCustomerSelect,
  itemsCount,
}: CartProps) {
  const { taxRate } = useTax();
  const { settings } = useSettings();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  if (items.length === 0) {
    return <CartEmpty />;
  }

  return (
    <div className="bg-card text-card-foreground border-border sticky top-4 flex h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl transition-[opacity] duration-300">
      <header className="bg-card/80 z-20 flex items-center justify-between border-b px-4 py-3">
        <h2 className="flex items-center gap-2 text-[1.5em] font-black">
          <span className="text-primary">Current Order</span>
        </h2>
        <span className="bg-primary/10 text-primary rounded-full px-4 py-1 text-[0.6em] font-bold">
          {itemsCount} {itemsCount === 1 ? "item" : "items"}
        </span>
      </header>

      <div
        className="custom-scrollbar flex-1 overflow-y-auto px-3 py-4"
        data-lenis-prevent
      >
        <div
          className="flex flex-col"
          style={{
            gap: "var(--cart-item-margin)",
          }}
        >
          {items.map((item) => (
            <div key={item.id} className="animate-in fade-in duration-300">
              <CartItem
                item={item}
                currency={currency}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card z-20 mt-auto border-t shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <CartSummary
          subtotal={subtotal}
          tax={tax}
          total={total}
          currency={currency}
          onCheckout={onCheckout}
          customers={customers}
          selectedCustomerId={selectedCustomerId}
          onCustomerSelect={onCustomerSelect}
        />
      </div>
    </div>
  );
});

export default Cart;
