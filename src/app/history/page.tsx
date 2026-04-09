"use client";

import { useState, useEffect, useCallback } from "react";
import { receiptApi } from "@/lib";
import { ReceiptList as ReceiptListType } from "@/lib";
import HistoryHeader from "@/components/history/HistoryHeader";
import DateFilter from "@/components/history/DateFilter";
import IdSearch from "@/components/history/IdSearch";
import ReceiptList from "@/components/history/ReceiptList";
import ReceiptDetailModal from "@/components/history/ReceiptDetailModal";

import { useDatabase } from "@/context/DatabaseContext";
import { useMockup } from "@/context/MockupContext";
import { useSettings } from "@/context/settings/SettingsContext";
import { logger } from "@/lib/logger";

export default function HistoryPage() {
  const { dbKey } = useDatabase();
  const { settings } = useSettings();
  const { isMockupMode } = useMockup();

  const [receipts, setReceipts] = useState<ReceiptListType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] =
    useState<ReceiptListType | null>(null);

  // Default: Last 30 days
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [searchId, setSearchId] = useState("");

  const fetchReceipts = useCallback(async () => {
    if (isMockupMode) {
      setLoading(true);
      setTimeout(() => {
        setReceipts([
          { receipt_id: 1001, datetime_unix: 1735689600 },
          { receipt_id: 1002, datetime_unix: 1735776000 },
          { receipt_id: 1003, datetime_unix: 1735862400 },
        ]);
        setLoading(false);
      }, 500);
      return;
    }

    if (!dbKey) return;
    setLoading(true);
    try {
      const start = Math.floor(new Date(startDate).getTime() / 1000);
      const end = Math.floor(new Date(endDate).getTime() / 1000) + 86399; // End of day
      const data = await receiptApi.getInvoicesByDate(dbKey, start, end);
      setReceipts(data.sort((a, b) => b.datetime_unix - a.datetime_unix));
    } catch (error) {
      logger.error("Failed to fetch receipts:", error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, dbKey, isMockupMode]);

  const handleSearchById = async () => {
    if (!searchId) return;
    setLoading(true);

    if (isMockupMode) {
      setTimeout(() => {
        const id = parseInt(searchId);
        if ([1001, 1002, 1003].includes(id)) {
          setSelectedReceipt({
            receipt_id: id,
            datetime_unix: 1735689600 + (id - 1001) * 86400,
            // In real app, we would fetch details here, but for list item type it's enough.
          } as ReceiptListType);
        } else {
          alert("Receipt not found (Mockup: try 1001, 1002, 1003)");
        }
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const id = parseInt(searchId);
      if (isNaN(id)) {
        alert("Please enter a valid number");
        return;
      }

      if (!dbKey) return;
      const [header] = await receiptApi.getInvoiceDetail(dbKey, id);

      if (header && header.receipt_id) {
        setSelectedReceipt(header);
      } else {
        alert("Receipt not found");
      }
    } catch (error) {
      logger.error("Search failed:", error);
      alert("Receipt not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  return (
    <div className="bg-background flex min-h-screen justify-center p-4 md:p-6 lg:p-8">
      <div
        className="w-full transition-all duration-300"
        style={{
          maxWidth: `${settings.layout_max_width || 1280}px`,
          fontSize: `${settings.history_font_scale || 100}%`,
        }}
      >
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
    </div>
  );
}
