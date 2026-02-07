import { useEffect, useState } from 'react';
import { FaArrowLeft, FaReceipt } from 'react-icons/fa';
import { ReceiptList as ReceiptListType, Receipt } from '@/lib/types';
import { Product } from '../types';
import { receiptApi, productApi } from '@/lib/api';

interface ReceiptDetailModalProps {
    receipt: ReceiptListType;
    onClose: () => void;
}

// Helper to format Unix timestamp
const formatDate = (unix: number) => {
    return new Date(unix * 1000).toLocaleString('th-TH', {
        dateStyle: 'medium',
        timeStyle: 'medium',
    });
};

export default function ReceiptDetailModal({ receipt, onClose }: ReceiptDetailModalProps) {
    const [receiptItems, setReceiptItems] = useState<Receipt[]>([]);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        // Fetch products for name lookup
        productApi.getAll().then(apiProducts => {
            const mapped: Product[] = apiProducts.map(p => ({
                id: p.product_id,
                name: p.title,
                price: p.satang / 100,
                category: p.catagory,
                image: "",
            }));
            setProducts(mapped);
        }).catch(console.error);

        async function loadDetail() {
            setLoadingDetail(true);
            try {
                const [_, items] = await receiptApi.getInvoiceDetail(receipt.receipt_id);
                setReceiptItems(items);
            } catch (error) {
                console.error("Failed to load details", error);
            } finally {
                setLoadingDetail(false);
            }
        }
        loadDetail();
    }, [receipt]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-card-bg w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-border flex justify-between items-center bg-card-bg/50">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FaReceipt className="text-primary" />
                        Receipt #{receipt.receipt_id}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted/20 rounded-full transition-colors text-muted hover:text-foreground"
                    >
                        <FaArrowLeft className="rotate-180" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div className="mb-4 text-center">
                        <div className="text-muted text-sm">Date</div>
                        <div className="font-bold text-lg">{formatDate(receipt.datetime_unix)}</div>
                    </div>

                    <div className="space-y-3">
                        {loadingDetail ? (
                            <div className="text-center py-8 text-muted">Loading items...</div>
                        ) : (
                            receiptItems.map((item, idx) => {
                                const product = products.find(p => p.id === item.product_id);
                                return (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-background rounded-lg border border-border">
                                        <div className="font-medium">
                                            {product ? product.name : `Product #${item.product_id}`}
                                            <div className="text-xs text-muted">Qty: {item.quantity}</div>
                                        </div>
                                        <div className="font-bold">x{item.quantity}</div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-border bg-muted/5 text-center">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-muted/10 hover:bg-muted/20 text-foreground font-medium rounded-xl transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
