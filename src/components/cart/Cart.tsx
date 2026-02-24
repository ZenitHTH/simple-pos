import { CartItem as CartItemType, Customer } from "@/lib";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import CartEmpty from "./CartEmpty";
import { useTax } from "@/hooks/useTax";
import { useSettings } from "@/context/SettingsContext";
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
    <Card className="sticky top-4 flex h-[calc(100vh-2rem)] flex-col overflow-hidden shadow-xl">
      <CardHeader className="bg-card/50 z-10 border-b backdrop-blur-sm">
        <CardTitle className="flex items-center gap-3 text-[1.5em] font-bold">
          <span className="text-primary">Current Order</span>
          <span className="text-muted-foreground bg-muted/20 rounded-full px-3 py-1 text-[0.875em] font-normal">
            {itemsCount} items
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent
        className="scrollbar-thin flex-1 overflow-y-auto px-2 py-2"
        data-lenis-prevent
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: `${settings.cart_item_margin ?? 8}px`,
          }}
        >
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              currency={currency}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
              itemFontSize={settings.cart_item_font_size ?? undefined}
              headerFontSize={settings.cart_item_header_font_size ?? undefined}
              priceFontSize={settings.cart_item_price_font_size ?? undefined}
              itemPadding={settings.cart_item_padding ?? undefined}
            />
          ))}
        </div>
      </CardContent>

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
    </Card>
  );
}
