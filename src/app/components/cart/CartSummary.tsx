interface CartSummaryProps {
    subtotal: number;
    tax: number;
    total: number;
    currency: string;
    onCheckout: () => void;
}

export default function CartSummary({ subtotal, tax, total, currency, onCheckout }: CartSummaryProps) {
    return (
        <div className="p-6 bg-card-bg border-t border-border mt-auto shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-10">
            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span>{currency}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                    <span>Tax (7%)</span>
                    <span>{currency}{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[1.5em] font-bold text-foreground pt-3 border-t border-border border-dashed">
                    <span>Total</span>
                    <span className="text-primary">{currency}{total.toFixed(2)}</span>
                </div>
            </div>

            <button
                onClick={onCheckout}
                className="w-full py-4 bg-primary hover:bg-blue-600 text-primary-foreground font-bold text-[1.125em] rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
                Checkout Now
            </button>
        </div>
    );
}
