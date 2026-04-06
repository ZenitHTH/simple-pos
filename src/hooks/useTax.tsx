import { useSettings } from "@/context/SettingsContext";

export function useTax() {
  const { settings, updateSettings } = useSettings();

  const isTaxEnabled = settings.tax_enabled;
  const taxPercentage = settings.tax_rate;

  const toggleTax = () => {
    updateSettings({ tax_enabled: !isTaxEnabled });
  };

  const updateTaxRate = (rate: number) => {
    updateSettings({ tax_rate: rate });
  };

  return {
    isTaxEnabled,
    toggleTax,
    taxPercentage,
    setTaxPercentage: updateTaxRate,
    taxRate: isTaxEnabled ? taxPercentage / 100 : 0,
  };
}
