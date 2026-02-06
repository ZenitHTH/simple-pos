import { memo } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

interface PaymentFooterProps {
    isValid: boolean;
    isProcessing: boolean;
    onConfirm: () => void;
}

const PaymentFooter = memo(({ isValid, isProcessing, onConfirm }: PaymentFooterProps) => (
    <div className="p-4 lg:p-5 border-t border-border bg-muted/5">
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
));

PaymentFooter.displayName = 'PaymentFooter';

export default PaymentFooter;
