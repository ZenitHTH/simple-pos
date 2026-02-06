import { memo } from 'react';
import { formatCurrency } from './utils';

interface ChangeDisplayProps {
    change: number;
    isValid: boolean;
    currency: string;
}

const ChangeDisplay = memo(({ change, isValid, currency }: ChangeDisplayProps) => (
    <div className={`h-full p-4 rounded-xl border flex flex-col justify-center ${isValid ? 'bg-green-500/10 border-green-500/20' : 'bg-muted/5 border-border'}`}>
        <div className="flex justify-between items-center">
            <span className="text-muted font-medium">Change Due</span>
            <span className={`text-2xl font-bold ${isValid ? 'text-green-600' : 'text-muted'}`}>
                {formatCurrency(Math.max(0, change), currency)}
            </span>
        </div>
    </div>
));

ChangeDisplay.displayName = 'ChangeDisplay';

export default ChangeDisplay;
