import { useState, useEffect, useMemo } from 'react';
import { FaMoneyBillWave, FaPaperPlane, FaTimes } from 'react-icons/fa';

// --- Type Definitions ---
interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    total: number;
    onConfirm: (cashReceived: number) => Promise<void>;
}

// --- Helper Functions ---
const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

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

const AmountSummary = ({ total }: { total: number }) => (
    <div className="text-center space-y-1">
        <p className="text-muted text-sm uppercase tracking-wider font-semibold">Total Amount</p>
        <div className="text-4xl font-bold text-primary">
            {formatCurrency(total)}
        </div>
    </div>
);

const CashInput = ({
    value,
    onChange,
    quickAmounts
}: {
    value: string;
    onChange: (val: string) => void;
    quickAmounts: number[]
}) => (
    <div className="space-y-4">
        <label className="block text-sm font-medium text-foreground">
            Cash Received
        </label>
        <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">$</span>
            <input
                type="number"
                autoFocus
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-8 pr-4 py-4 text-xl font-bold bg-background border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                placeholder="0.00"
            />
        </div>

        {/* Quick Amounts */}
        <div className="flex gap-2 flex-wrap">
            {quickAmounts.map(amount => (
                <button
                    key={amount}
                    onClick={() => onChange(amount.toString())}
                    className="px-4 py-2 bg-muted/10 hover:bg-muted/20 text-foreground border border-border rounded-lg text-sm font-medium transition-colors"
                >
                    {formatCurrency(amount)}
                </button>
            ))}
        </div>
    </div>
);

const ChangeDisplay = ({ change, isValid }: { change: number; isValid: boolean }) => (
    <div className={`p-4 rounded-xl border ${isValid ? 'bg-green-500/10 border-green-500/20' : 'bg-muted/5 border-border'}`}>
        <div className="flex justify-between items-center">
            <span className="text-muted font-medium">Change Due</span>
            <span className={`text-2xl font-bold ${isValid ? 'text-green-600' : 'text-muted'}`}>
                {formatCurrency(Math.max(0, change))}
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
export default function PaymentModal({ isOpen, onClose, total, onConfirm }: PaymentModalProps) {
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
                    <AmountSummary total={total} />

                    <CashInput
                        value={cashReceived}
                        onChange={setCashReceived}
                        quickAmounts={quickAmounts}
                    />

                    <ChangeDisplay change={change} isValid={isValid} />
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
