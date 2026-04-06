"use client";

import { FaArrowLeft, FaReceipt } from "react-icons/fa";
import { ReceiptList as ReceiptListType } from "@/lib";
import { useReceiptDetail, formatDate } from "./hooks/useReceiptDetail";

interface ReceiptDetailModalProps {
  receipt: ReceiptListType;
  onClose: () => void;
}

export default function ReceiptDetailModal({
  receipt,
  onClose,
}: ReceiptDetailModalProps) {
  const { receiptItems, loadingDetail, getProductName } =
    useReceiptDetail(receipt);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-card text-card-foreground border-border animate-in fade-in zoom-in flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-2xl border shadow-2xl duration-200">
        <div className="border-border bg-card/50 flex items-center justify-between border-b p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <FaReceipt className="text-primary" />
            Receipt #{receipt.receipt_id}
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-muted/20 text-muted-foreground hover:text-foreground rounded-full p-2 transition-colors"
          >
            <FaArrowLeft className="rotate-180" />
          </button>
        </div>

        <div className="overflow-y-auto p-6" data-lenis-prevent>
          <div className="mb-4 text-center">
            <div className="text-muted-foreground text-sm">Date</div>
            <div className="text-lg font-bold">
              {formatDate(receipt.datetime_unix)}
            </div>
          </div>

          <div className="space-y-3">
            {loadingDetail ? (
              <div className="text-muted-foreground py-8 text-center">
                Loading items...
              </div>
            ) : (
              receiptItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-background border-border flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="font-medium">
                    {getProductName(item.product_id)}
                    <div className="text-muted-foreground text-xs">
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="font-bold">x{item.quantity}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-border bg-muted/5 border-t p-6 text-center">
          <button
            onClick={onClose}
            className="bg-muted/10 hover:bg-muted/20 text-foreground w-full rounded-xl py-3 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
