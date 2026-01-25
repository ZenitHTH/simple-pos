import { CartItem } from '../types';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';

interface CartProps {
    items: CartItem[];
    onUpdateQuantity: (id: number, delta: number) => void;
    onRemove: (id: number) => void;
}

export default function Cart({ items, onUpdateQuantity, onRemove }: CartProps) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.07; // Assumed 7% tax
    const total = subtotal + tax;

    if (items.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted p-8 text-center bg-card-bg rounded-2xl border border-border">
                <div className="w-24 h-24 bg-muted/10 rounded-full flex items-center justify-center mb-6">
                    <FaShoppingCart size={40} className="text-muted/50" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-foreground">Cart is Empty</h3>
                <p className="max-w-[200px]">Select items from the menu to start a new order.</p>
            </div>
        );
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
                    <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 bg-background rounded-xl border border-border group hover:border-primary/30 transition-colors"
                    >
                        <div
                            className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0 border border-border"
                            style={{
                                backgroundColor: item.color || '#e2e8f0',
                                backgroundImage: item.image ? `url(${item.image})` : 'none'
                            }}
                        />

                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                            <div className="text-primary font-bold">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-card-bg border border-border rounded-lg p-1">
                            <button
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted/20 text-muted hover:text-foreground transition-colors"
                            >
                                <FaMinus size={10} />
                            </button>
                            <span className="font-medium w-4 text-center">{item.quantity}</span>
                            <button
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted/20 text-muted hover:text-foreground transition-colors"
                            >
                                <FaPlus size={10} />
                            </button>
                        </div>

                        <button
                            onClick={() => onRemove(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted/50 hover:text-red-500 hover:bg-red-500/10 transition-colors ml-1"
                        >
                            <FaTrash size={14} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-card-bg border-t border-border mt-auto shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-10">
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-muted">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted">
                        <span>Tax (7%)</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold text-foreground pt-3 border-t border-border border-dashed">
                        <span>Total</span>
                        <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                </div>

                <button className="w-full py-4 bg-primary hover:bg-blue-600 text-primary-foreground font-bold text-lg rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                    Checkout Now
                </button>
            </div>
        </div>
    );
}
