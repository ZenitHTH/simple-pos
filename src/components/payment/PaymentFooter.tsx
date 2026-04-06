import { Button } from "@/components/ui/Button";
import { memo } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { cn } from "@/lib";

interface PaymentFooterProps {
  isValid: boolean;
  isProcessing: boolean;
  onConfirm: () => void;
}

const PaymentFooter = memo(
  ({ isValid, isProcessing, onConfirm }: PaymentFooterProps) => (
    <div className="border-border bg-muted/5 border-t p-4 lg:p-5">
      <Button
        onClick={onConfirm}
        disabled={!isValid || isProcessing}
        className={cn(
          "flex h-auto w-full items-center justify-center gap-2 rounded-xl py-4 text-lg font-bold transition-all",
          isValid && !isProcessing
            ? "bg-success text-success-foreground shadow-lg shadow-success/20 hover:bg-success/90 active:scale-[0.98]"
            : "bg-muted text-muted-foreground cursor-not-allowed opacity-50",
        )}
      >
        {isProcessing ? (
          <span>Processing...</span>
        ) : (
          <>
            <FaPaperPlane />
            Confirm Payment
          </>
        )}
      </Button>
    </div>
  ),
);

PaymentFooter.displayName = "PaymentFooter";

export default PaymentFooter;
