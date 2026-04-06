import { FaReceipt } from "react-icons/fa";
import { ReceiptList as ReceiptListType } from "@/lib";

interface ReceiptListProps {
  receipts: ReceiptListType[];
  loading: boolean;
  onSelect: (receipt: ReceiptListType) => void;
}

// Helper to format Unix timestamp
const formatDate = (unix: number) => {
  return new Date(unix * 1000).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "medium",
  });
};

export default function ReceiptList({
  receipts,
  loading,
  onSelect,
}: ReceiptListProps) {
  return (
    <div className="grid gap-4">
      {receipts.length === 0 && !loading ? (
        <div className="text-muted-foreground py-12 text-center">
          <FaReceipt className="mx-auto mb-4 text-4xl opacity-20" />
          No receipts found for this period
        </div>
      ) : (
        receipts.map((receipt) => (
          <div
            key={receipt.receipt_id}
            onClick={() => onSelect(receipt)}
            className="bg-card text-card-foreground border-border hover:border-primary/50 group flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                <FaReceipt />
              </div>
              <div>
                <div className="text-foreground font-bold">
                  Receipt #{receipt.receipt_id}
                </div>
                <div className="text-muted-foreground text-sm">
                  {formatDate(receipt.datetime_unix)}
                </div>
              </div>
            </div>

            <div className="text-muted-foreground group-hover:text-primary transition-colors">
              View Details →
            </div>
          </div>
        ))
      )}
    </div>
  );
}
