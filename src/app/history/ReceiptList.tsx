import { FaReceipt } from 'react-icons/fa';
import { ReceiptList as ReceiptListType } from '@/lib/types';

interface ReceiptListProps {
    receipts: ReceiptListType[];
    loading: boolean;
    onSelect: (receipt: ReceiptListType) => void;
}

// Helper to format Unix timestamp
const formatDate = (unix: number) => {
    return new Date(unix * 1000).toLocaleString('th-TH', {
        dateStyle: 'medium',
        timeStyle: 'medium',
    });
};

export default function ReceiptList({ receipts, loading, onSelect }: ReceiptListProps) {
    return (
        <div className="grid gap-4">
            {receipts.length === 0 && !loading ? (
                <div className="text-center py-12 text-muted">
                    <FaReceipt className="mx-auto text-4xl mb-4 opacity-20" />
                    No receipts found for this period
                </div>
            ) : (
                receipts.map((receipt) => (
                    <div
                        key={receipt.receipt_id}
                        onClick={() => onSelect(receipt)}
                        className="bg-card-bg p-4 rounded-xl border border-border hover:border-primary/50 transition-colors flex justify-between items-center group cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <FaReceipt />
                            </div>
                            <div>
                                <div className="font-bold text-foreground">Receipt #{receipt.receipt_id}</div>
                                <div className="text-sm text-muted">
                                    {formatDate(receipt.datetime_unix)}
                                </div>
                            </div>
                        </div>

                        <div className="text-muted group-hover:text-primary transition-colors">
                            View Details →
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
