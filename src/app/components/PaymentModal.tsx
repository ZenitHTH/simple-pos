import { useState, useEffect, useMemo } from 'react';
import { FaMoneyBillWave, FaPaperPlane, FaTimes, FaBackspace } from 'react-icons/fa';

// --- Type Definitions ---
interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    total: number;
    onConfirm: (cashReceived: number) => Promise<void>;
    currency: string;
}

// --- Helper Functions ---
const formatCurrency = (amount: number, currency: string) => `${currency}${amount.toFixed(2)}`;

// --- Sub-components (could be in separate files) ---
const ModalHeader = ({ onClose }: { onClose: () => void }) => (
    <div className="p-6 border-b border-border flex justify-between items-center bg-card-bg/50">
        <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaMoneyBillWave className="text-green-500" />
            Cash Payment
        </h2>
        <button
            onClick={onClose}
            className="p-2 hover:bg-muted/20 rounded-full transition-colors text-muted hover:text-foreground"
            aria-label="Close modal"
        >
            <FaTimes />
        </button>
    </div>
);

const AmountSummary = ({ total, currency }: { total: number, currency: string }) => (
    <div className="text-center space-y-1">
        <p className="text-muted text-sm uppercase tracking-wider font-semibold">Total Amount</p>
        <div className="text-4xl font-bold text-primary">
            {formatCurrency(total, currency)}
        </div>
    </div>
);

const CashInput = ({
    value,
    onChange,
    quickAmounts,
    currency
}: {
    value: string;
    onChange: (val: string) => void;
    quickAmounts: number[];
    currency: string;
}) => {
    const handleAdd = (amount: number) => {
        const current = parseFloat(value) || 0;
        onChange((current + amount).toString());
    };

    const handleBackspace = () => {
        onChange(value.slice(0, -1));
    };

    const denominations = [1, 2, 5, 10, 20, 50, 100, 500, 1000];

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-foreground">
                Cash Received
            </label>
            <div className="relative flex gap-2">
                <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">{currency}</span>
                    <input
                        type="number"
                        autoFocus
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full pl-8 pr-4 py-4 text-xl font-bold bg-background border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                        placeholder="0.00"
                    />
                </div>
                <button
                    onClick={handleBackspace}
                    className="aspect-square h-full max-h-[64px] flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 border-2 border-red-500/20 rounded-xl transition-colors"
                >
                    <FaBackspace size={20} />
                </button>
            </div>

            {/* Quick Suggestions (Replace) */}
            <div className="flex gap-2 flex-wrap">
                {quickAmounts.map(amount => (
                    <button
                        key={`quick-${amount}`}
                        onClick={() => onChange(amount.toString())}
                        className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-xs font-bold transition-colors"
                    >
                        {formatCurrency(amount, currency)}
                    </button>
                ))}
            </div>

            {/* Additive Denominations */}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {denominations.map(amount => (
                    <button
                        key={`denom-${amount}`}
                        onClick={() => handleAdd(amount)}
                        className="px-2 py-3 bg-muted/10 hover:bg-muted/20 text-foreground border border-border rounded-lg text-sm font-semibold transition-colors active:scale-95"
                    >
                        +{amount}
                    </button>
                ))}
            </div>
        </div>
    );
};

const ChangeDisplay = ({ change, isValid, currency }: { change: number; isValid: boolean; currency: string }) => (
    <div className={`p-4 rounded-xl border ${isValid ? 'bg-green-500/10 border-green-500/20' : 'bg-muted/5 border-border'}`}>
        <div className="flex justify-between items-center">
            <span className="text-muted font-medium">Change Due</span>
            <span className={`text-2xl font-bold ${isValid ? 'text-green-600' : 'text-muted'}`}>
                {formatCurrency(Math.max(0, change), currency)}
            </span>
        </div>
    </div>
);

const PaymentFooter = ({
    isValid,
    isProcessing,
    onConfirm
}: {
    isValid: boolean;
    isProcessing: boolean;
    onConfirm: () => void
}) => (
    <div className="p-6 border-t border-border bg-muted/5">
        <button
            onClick={onConfirm}
            disabled={!isValid || isProcessing}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${isValid && !isProcessing
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20 active:scale-[0.98]'
                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                }`}
        >
            {isProcessing ? (
                <span>Processing...</span>
            ) : (
                <>
                    <FaPaperPlane />
                    Confirm Payment
                </>
            )}
        </button>
    </div>
);

// --- Main Component ---
export default function PaymentModal({ isOpen, onClose, total, onConfirm, currency }: PaymentModalProps) {
    const [cashReceived, setCashReceived] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setCashReceived('');
            setIsProcessing(false);
        }
    }, [isOpen]);

    // Derived State
    const cashValue = parseFloat(cashReceived) || 0;
    const change = cashValue - total;
    const isValid = cashValue >= total;

    // Memoize quick amounts to avoid recalculating on every render
    const quickAmounts = useMemo(() => {
        const candidates = [
            Math.ceil(total / 100) * 100,
            Math.ceil(total / 500) * 500,
            Math.ceil(total / 1000) * 1000,
        ];
        // Ensure unique and relevant values (>= total)
        return Array.from(new Set(candidates)).filter(val => val >= total).sort((a, b) => a - b);
    }, [total]);

    const handleConfirm = async () => {
        if (!isValid || isProcessing) return;

        setIsProcessing(true);
        try {
            await onConfirm(cashValue);
        } catch (error) {
            console.error("Payment failed:", error);
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-card-bg w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in duration-200">

                <ModalHeader onClose={onClose} />

                <div className="p-6 space-y-6">
                    <AmountSummary total={total} currency={currency} />

                    <CashInput
                        value={cashReceived}
                        onChange={setCashReceived}
                        quickAmounts={quickAmounts}
                        currency={currency}
                    />

                    <ChangeDisplay change={change} isValid={isValid} currency={currency} />
                </div>

                <PaymentFooter
                    isValid={isValid}
                    isProcessing={isProcessing}
                    onConfirm={handleConfirm}
                />

            </div>
        </div>
    );
}
