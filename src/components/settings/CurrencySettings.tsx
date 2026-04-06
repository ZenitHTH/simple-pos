import { memo } from "react";
import { FaCoins } from "react-icons/fa";
import { Select } from "@/components/ui/Select";
import SettingsSection from "@/components/ui/SettingsSection";

export const CURRENCIES = [
  { country: "United States", code: "USD", symbol: "$" },
  { country: "United Kingdom", code: "GBP", symbol: "£" },
  { country: "European Union", code: "EUR", symbol: "€" },
  { country: "Thailand", code: "THB", symbol: "฿" },
  { country: "Japan", code: "JPY", symbol: "¥" },
  { country: "South Korea", code: "KRW", symbol: "₩" },
  { country: "China", code: "CNY", symbol: "¥" },
  { country: "India", code: "INR", symbol: "₹" },
  { country: "Russia", code: "RUB", symbol: "₽" },
  { country: "Brazil", code: "BRL", symbol: "R$" },
  { country: "Vietnam", code: "VND", symbol: "₫" },
  { country: "Laos", code: "LAK", symbol: "₭" },
  { country: "Cambodia", code: "KHR", symbol: "៛" },
  { country: "Indonesia", code: "IDR", symbol: "Rp" },
  { country: "Malaysia", code: "MYR", symbol: "RM" },
  { country: "Singapore", code: "SGD", symbol: "S$" },
  { country: "Philippines", code: "PHP", symbol: "₱" },
  { country: "Australia", code: "AUD", symbol: "A$" },
  { country: "Canada", code: "CAD", symbol: "C$" },
];

interface CurrencySettingsProps {
  currency: string;
  onUpdateCurrency: (symbol: string) => void;
}

const CurrencySettings = memo(function CurrencySettings({
  currency,
  onUpdateCurrency,
}: CurrencySettingsProps) {
  const options = [
    ...CURRENCIES.map((c) => ({
      value: c.code,
      label: `${c.country} (${c.code}) - ${c.symbol}`,
    })),
  ];

  // Add Custom option only if current currency is not in predefined list
  const isCustom = !CURRENCIES.some((c) => c.symbol === currency);
  if (isCustom) {
    options.push({
      value: "CUSTOM",
      label: `Custom (${currency})`,
    });
  }

  const currentValue =
    CURRENCIES.find((c) => c.symbol === currency)?.code || "CUSTOM";

  return (
    <SettingsSection title="Currency Settings" icon={FaCoins}>
      {/* Currency Selection */}
      <div>
        <Select
          label="Select Country / Currency"
          value={currentValue}
          onChange={(val: string | number) => {
            const code = val as string;
            const selected = CURRENCIES.find((c) => c.code === code);
            if (selected) {
              onUpdateCurrency(selected.symbol);
            }
          }}
          options={options}
        />
        <p className="text-muted-foreground mt-2 text-xs">
          Select your region to automatically set the currency symbol (
          {currency}).
        </p>
      </div>

      {/* Warning Modal */}
    </SettingsSection>
  );
});

export default CurrencySettings;
