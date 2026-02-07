import { CartItem as CartItemType } from '../types';
import CartItem from './cart/CartItem';
import CartSummary from './cart/CartSummary';
import CartEmpty from './cart/CartEmpty';
import { useTax } from '../../hooks/useTax';

interface CartProps {
    items: CartItemType[];
    onUpdateQuantity: (id: number, delta: number) => void;
    onRemove: (id: number) => void;
    onCheckout: () => void;
    currency: string;
}

export default function Cart({ items, onUpdateQuantity, onRemove, onCheckout, currency }: CartProps) {
    const { taxRate } = useTax();

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    if (items.length === 0) {
        return <CartEmpty />;
    }

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] bg-card-bg border border-border rounded-2xl shadow-xl overflow-hidden sticky top-4">
            <div className="p-6 border-b border-border bg-card-bg/50 backdrop-blur-sm z-10">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <span className="text-primary">Current Order</span>
                    <span className="text-sm font-normal text-muted bg-muted/10 px-3 py-1 rounded-full">
                        {items.reduce((acc, item) => acc + item.quantity, 0)} items
                    </span>
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                {items.map((item) => (
                    <CartItem
                        key={item.id}
                        item={item}
                        currency={currency}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemove={onRemove}
                    />
                ))}
            </div>

            <CartSummary
                subtotal={subtotal}
                tax={tax}
                total={total}
                currency={currency}
                onCheckout={onCheckout}
            />
        </div>
    );
}
