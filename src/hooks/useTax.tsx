import { useSettings } from "@/context/settings/SettingsContext";

export function useTax() {
  const { settings, updateSettings } = useSettings();

  const isTaxEnabled = settings.general.tax_enabled;
  const taxPercentage = settings.general.tax_rate;

  const toggleTax = () => {
    updateSettings({ general: { tax_enabled: !isTaxEnabled } });
  };

  const updateTaxRate = (rate: number) => {
    updateSettings({ general: { tax_rate: rate } });
  };

  return {
    isTaxEnabled,
    toggleTax,
    taxPercentage,
    setTaxPercentage: updateTaxRate,
    taxRate: isTaxEnabled ? taxPercentage / 100 : 0,
  };
}
