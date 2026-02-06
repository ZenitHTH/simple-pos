import { memo } from 'react';
import { FaBackspace } from 'react-icons/fa';
import { formatCurrency } from './utils';

const DENOMINATIONS = [1, 2, 5, 10, 20, 50, 100, 500, 1000];

interface CashInputProps {
    value: string;
    onChange: (val: string) => void;
    quickAmounts: number[];
    currency: string;
}

const CashInput = memo(({ value, onChange, quickAmounts, currency }: CashInputProps) => {
    const handleAdd = (amount: number) => {
        const current = parseFloat(value) || 0;
        onChange((current + amount).toString());
    };

    const handleBackspace = () => {
        onChange(value.slice(0, -1));
    };

    return (
        <div className="space-y-4">
            <label htmlFor="cash-input" className="block text-sm font-medium text-foreground">
                Cash Received
            </label>
            <div className="relative flex gap-2">
                <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold pointer-events-none">
                        {currency}
                    </span>
                    <input
                        id="cash-input"
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
                    aria-label="Backspace"
                >
                    <FaBackspace size={20} />
                </button>
            </div>

            {/* Quick Suggestions */}
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
                {DENOMINATIONS.map(amount => (
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
});

CashInput.displayName = 'CashInput';

export default CashInput;
