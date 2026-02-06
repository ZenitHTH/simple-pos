import { useState, useEffect, useMemo, memo } from 'react';
import ModalHeader from './payment/ModalHeader';
import AmountSummary from './payment/AmountSummary';
import CashInput from './payment/CashInput';
import ChangeDisplay from './payment/ChangeDisplay';
import PaymentFooter from './payment/PaymentFooter';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    total: number;
    onConfirm: (cashReceived: number) => Promise<void>;
    currency?: string;
}

export default function PaymentModal({ isOpen, onClose, total, onConfirm, currency = '$' }: PaymentModalProps) {
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
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
        >
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

