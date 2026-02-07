"use client";

import { useState, useEffect } from 'react';
import { receiptApi } from '@/lib/api';
import { ReceiptList as ReceiptListType } from '@/lib/types';
import HistoryHeader from './HistoryHeader';
import DateFilter from './DateFilter';
import IdSearch from './IdSearch';
import ReceiptList from './ReceiptList';
import ReceiptDetailModal from './ReceiptDetailModal';

export default function HistoryPage() {
    const [receipts, setReceipts] = useState<ReceiptListType[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState<ReceiptListType | null>(null);

    // Default: Last 30 days
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        return d.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [searchId, setSearchId] = useState('');

    const fetchReceipts = async () => {
        setLoading(true);
        try {
            const start = Math.floor(new Date(startDate).getTime() / 1000);
            const end = Math.floor(new Date(endDate).getTime() / 1000) + 86399; // End of day
            const data = await receiptApi.getInvoicesByDate(start, end);
            setReceipts(data.sort((a, b) => b.datetime_unix - a.datetime_unix));
        } catch (error) {
            console.error("Failed to fetch receipts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchById = async () => {
        if (!searchId) return;
        setLoading(true);
        try {
            const id = parseInt(searchId);
            if (isNaN(id)) {
                alert("Please enter a valid number");
                return;
            }

            const [header, _] = await receiptApi.getInvoiceDetail(id);

            if (header && header.receipt_id) {
                setSelectedReceipt(header);
            } else {
                alert("Receipt not found");
            }
        } catch (error) {
            console.error("Search failed:", error);
            alert("Receipt not found");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReceipts();
    }, []);

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
            <HistoryHeader />

            <DateFilter
                startDate={startDate}
                endDate={endDate}
                loading={loading}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onFilter={fetchReceipts}
            />

            <IdSearch
                searchId={searchId}
                loading={loading}
                onSearchIdChange={setSearchId}
                onSearch={handleSearchById}
            />

            <ReceiptList
                receipts={receipts}
                loading={loading}
                onSelect={setSelectedReceipt}
            />

            {selectedReceipt && (
                <ReceiptDetailModal
                    receipt={selectedReceipt}
                    onClose={() => setSelectedReceipt(null)}
                />
            )}
        </div>
    );
}
