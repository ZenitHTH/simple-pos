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

export default function Cart({
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
    <Card className="sticky top-4 flex h-[calc(100vh-2rem)] flex-col overflow-hidden shadow-2xl transition-all duration-300">
      <CardHeader className="bg-card/80 z-20 border-b backdrop-blur-md">
        <CardTitle className="flex items-center justify-between gap-3 text-[1.5em] font-black">
          <div className="flex items-center gap-2">
            <span className="text-primary">Current Order</span>
          </div>
          <span className="bg-primary/10 text-primary rounded-full px-4 py-1 text-[0.6em] font-bold">
            {itemsCount} {itemsCount === 1 ? "item" : "items"}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent
        className="custom-scrollbar flex-1 overflow-y-auto px-3 py-4"
        data-lenis-prevent
      >
        <div
          className="flex flex-col"
          style={{
            gap: `${settings.styling.cart.margin ?? 10}px`,
          }}
        >
          {items.map((item) => (
            <div key={item.id} className="animate-in fade-in slide-in-from-right-4 duration-300">
              <CartItem
                item={item}
                currency={currency}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
                itemFontSize={settings.styling.cart.font_size ?? undefined}
                headerFontSize={settings.styling.cart.header_font_size ?? undefined}
                priceFontSize={settings.styling.cart.price_font_size ?? undefined}
                itemPadding={settings.styling.cart.padding ?? undefined}
              />
            </div>
          ))}
        </div>
      </CardContent>

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
    </Card>
  );
}
