import { useSettings } from "@/context/settings/SettingsContext";

export function useCurrency() {
  const { settings, updateSettings, resetToDefault } = useSettings();

  const currency = settings.general.currency_symbol;

  const updateCurrency = (newCurrency: string) => {
    updateSettings({ general: { currency_symbol: newCurrency } });
  };

  const clearCurrency = () => {
    updateSettings({ general: { currency_symbol: "$" } });
  };

  const clearAllCookies = () => {
    resetToDefault();
  };

  return {
    currency,
    updateCurrency,
    clearCurrency,
    clearAllCookies,
  };
}
