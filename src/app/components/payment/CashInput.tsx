import { memo } from 'react';
import { formatCurrency } from './utils';
import VirtualNumpad from './VirtualNumpad';

interface CashInputProps {
    value: string;
    onChange: (val: string) => void;
    quickAmounts: number[];
    currency: string;
}


const CashInput = memo(({ value, onChange, quickAmounts, currency }: CashInputProps) => {
    const handleKeyPress = (key: string) => {
        // Prevent multiple dots
        if (key === '.' && value.includes('.')) return;

        // Prevent multiple leading zeros (unless it's 0.)
        if (value === '0' && key !== '.') {
            onChange(key);
            return;
        }

        // Limit decimal places to 2
        if (value.includes('.')) {
            const [, decimals] = value.split('.');
            if (decimals && decimals.length >= 2) return;
        }

        onChange(value + key);
    };

    const handleBackspace = () => {
        onChange(value.slice(0, -1));
    };

    const handleClear = () => {
        onChange('');
    };

    return (
        <div className="space-y-2 lg:space-y-3">
            <label htmlFor="cash-input" className="block text-sm font-medium text-foreground">
                Cash Received
            </label>

            {/* Input Display (Read-only as we use numpad) */}
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold pointer-events-none">
                    {currency}
                </span>
                <input
                    id="cash-input"
                    type="text"
                    readOnly
                    value={value}
                    className="w-full pl-8 pr-4 py-3 text-2xl lg:text-3xl font-bold bg-muted/5 border-2 border-border rounded-xl text-right focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none cursor-default"
                    placeholder="0.00"
                />
            </div>

            {/* Quick Suggestions */}
            <div className="flex gap-2 flex-wrap">
                {quickAmounts.map(amount => (
                    <button
                        key={`quick-${amount}`}
                        onClick={() => onChange(amount.toString())}
                        className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-sm font-bold transition-colors"
                    >
                        {formatCurrency(amount, currency)}
                    </button>
                ))}
            </div>

            {/* Virtual Numpad */}
            <VirtualNumpad
                onPress={handleKeyPress}
                onBackspace={handleBackspace}
                onClear={handleClear}
            />
        </div>
    );
});

CashInput.displayName = 'CashInput';

export default CashInput;
