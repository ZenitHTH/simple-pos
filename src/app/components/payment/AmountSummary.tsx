import { memo } from 'react';
import { formatCurrency } from './utils';

interface AmountSummaryProps {
    total: number;
    currency: string;
}

const AmountSummary = memo(({ total, currency }: AmountSummaryProps) => (
    <div className="text-center space-y-1">
        <p className="text-muted text-sm uppercase tracking-wider font-semibold">Total Amount</p>
        <div className="text-4xl font-bold text-primary">
            {formatCurrency(total, currency)}
        </div>
    </div>
));

AmountSummary.displayName = 'AmountSummary';

export default AmountSummary;
