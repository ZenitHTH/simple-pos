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
            <div className="bg-card-bg w-full max-w-md lg:max-w-md xl:max-w-lg max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in duration-200">
                <ModalHeader onClose={onClose} />

                <div className="p-4 lg:p-5 space-y-4 lg:space-y-5 overflow-y-auto custom-scrollbar">
                    {/* Compact Summary Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                            <AmountSummary total={total} currency={currency} />
                        </div>
                        <div className="h-full">
                            <ChangeDisplay change={change} isValid={isValid} currency={currency} />
                        </div>
                    </div>

                    <CashInput
                        value={cashReceived}
                        onChange={setCashReceived}
                        quickAmounts={quickAmounts}
                        currency={currency}
                    />
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

