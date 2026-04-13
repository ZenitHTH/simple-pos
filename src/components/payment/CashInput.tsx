import { memo } from "react";
import { formatCurrency } from "./utils";
import VirtualNumpad from "@/components/ui/VirtualNumpad";
import SelectableOverlay from "@/components/design-mode/SelectableOverlay";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib";
import { useSettings } from "@/context/settings/SettingsContext";

interface CashInputProps {
  value: string;
  onChange: (val: string) => void;
  quickAmounts: number[];
  currency: string;
  numpadHeight?: number;
}

const CashInput = memo(
  ({
    value,
    onChange,
    quickAmounts,
    currency,
    numpadHeight,
  }: CashInputProps) => {
    const { settings } = useSettings();
    const handleKeyPress = (key: string) => {
      // Prevent multiple dots
      if (key === "." && value.includes(".")) return;

      // Prevent multiple leading zeros (unless it's 0.)
      if (value === "0" && key !== ".") {
        onChange(key);
        return;
      }

      // Limit decimal places to 2
      if (value.includes(".")) {
        const [, decimals] = value.split(".");
        if (decimals && decimals.length >= 2) return;
      }

      onChange(value + key);
    };

    const handleBackspace = () => {
      onChange(value.slice(0, -1));
    };

    const handleClear = () => {
      onChange("");
    };

    return (
      <div className="space-y-2 lg:space-y-3">
        <label
          htmlFor="cash-input"
          className="text-foreground block text-sm font-medium"
        >
          Cash Received
        </label>

        {/* Input Display (Read-only as we use numpad) */}
        <div className="relative">
          <span className="text-muted pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 font-bold">
            {currency}
          </span>
          <Input
            id="cash-input"
            type="text"
            readOnly
            value={value}
            className={cn(
              "bg-muted/5 border-border focus:border-primary focus:ring-primary/10 h-auto w-full cursor-default rounded-xl border-2 py-3 pr-4 pl-8 text-right font-bold transition-all outline-none focus:ring-4",
            )}
            style={{
              fontSize: `${(settings.styling.payment.numpad_display_font_scale ?? 100) * 0.015}rem`,
              lineHeight: "1.2",
            }}
            placeholder="0.00"
          />
        </div>

        {/* Quick Suggestions */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {quickAmounts.map((amount) => (
            <button
              key={`quick-${amount}`}
              onClick={() => onChange(amount.toString())}
              className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 active:bg-primary active:text-white flex h-14 items-center justify-center rounded-2xl border text-lg font-black tracking-tight transition-all active:scale-92 active:shadow-inner touch-manipulation"
              type="button"
            >
              {formatCurrency(amount, currency)}
            </button>
          ))}
        </div>

        {/* Virtual Numpad */}
        <div className="relative">
          <SelectableOverlay id="numpad_scale" />
          <VirtualNumpad
            onPress={handleKeyPress}
            onBackspace={handleBackspace}
            onClear={handleClear}
            height={numpadHeight}
          />
        </div>
      </div>
    );
  },
);

CashInput.displayName = "CashInput";

export default CashInput;
