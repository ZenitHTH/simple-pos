"use client";

import { FaReceipt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function POSHeader() {
    const router = useRouter();

    return (
        <header className="mb-4 flex justify-between items-center shrink-0">
            <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">Simple POS</h1>
                <p className="text-muted text-sm">Manage orders efficiently</p>
            </div>
            <button
                onClick={() => router.push('/history')}
                className="px-4 py-2 bg-card-bg border border-border rounded-lg shadow-sm hover:bg-card-hover transition-colors font-medium text-sm flex items-center gap-2"
            >
                <FaReceipt /> History
            </button>
        </header>
    );
}
