import { useState, useEffect } from "react";
import AmountSummary from "./AmountSummary";
import CashInput from "./CashInput";
import ChangeDisplay from "./ChangeDisplay";
import PaymentFooter from "./PaymentFooter";

import { useSettings } from "@/context/settings/SettingsContext";
import SelectableOverlay from "@/components/design-mode/SelectableOverlay";
import { Modal } from "@/components/ui/Modal";
import { FaMoneyBillWave } from "react-icons/fa";
import { logger } from "@/lib/utils/logger";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onConfirm: (cashReceived: number) => void;
  isPending?: boolean;
  currency?: string;
}

/**
 * PaymentModal Component
 * 
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
export default function PaymentModal({
  isOpen,
  onClose,
  total,
  onConfirm,
  isPending = false,
  currency = "$",
}: PaymentModalProps) {
  const { settings } = useSettings();
  const [cashReceived, setCashReceived] = useState<string>("");

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCashReceived("");
    }
  }, [isOpen]);

  // Derived State
  const cashValue = parseFloat(cashReceived) || 0;
  const change = cashValue - total;
  const isValid = cashValue >= total;

  const quickAmounts = (() => {
    const candidates = [
      Math.ceil(total / 100) * 100,
      Math.ceil(total / 500) * 500,
      Math.ceil(total / 1000) * 1000,
    ];
    // Ensure unique and relevant values (>= total)
    return Array.from(new Set(candidates))
      .filter((val) => val >= total)
      .sort((a, b) => a - b);
  })();

  const handleConfirm = () => {
    if (!isValid || isPending) return;
    onConfirm(cashValue);
  };

  if (!isOpen) return null;

  // Calculate base width (e.g. 512px for max-w-lg) and apply scaling
  const scale = (settings.scaling.components.payment_modal || 100) / 100;
  const fontScale = (settings.scaling.fonts.payment_modal || 100) / 100;
  const baseWidth = 512; // approx 32rem
  const scaledWidth = `${baseWidth * scale}px`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <FaMoneyBillWave className="text-success" />
          <span>Cash Payment</span>
        </div>
      }
      className="max-w-none shadow-2xl"
      style={{
        maxWidth: scaledWidth,
        width: "100%",
        fontSize: `${fontScale}rem`,
      }}
      contentClassName="p-0"
    >
      <SelectableOverlay id="payment_modal_scale" />

      <div
        className="custom-scrollbar space-y-4 overflow-y-auto p-4 lg:space-y-5 lg:p-5"
        data-lenis-prevent
      >
        {/* Compact Summary Row */}
        <div className="grid grid-cols-2 gap-4">
          <AmountSummary total={total} currency={currency} />
          <ChangeDisplay
            change={change}
            isValid={isValid}
            currency={currency}
            className={
              isValid
                ? "border-success/20 bg-success/10"
                : "bg-muted/5 border-border"
            }
          />
        </div>

        <CashInput
          value={cashReceived}
          onChange={setCashReceived}
          quickAmounts={quickAmounts}
          currency={currency}
          numpadHeight={settings.styling.payment.numpad_height || 320}
        />
      </div>

      <PaymentFooter
        isValid={isValid}
        isProcessing={isPending}
        onConfirm={handleConfirm}
      />
    </Modal>
  );
}
