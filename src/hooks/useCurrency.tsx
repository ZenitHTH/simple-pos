import { useSettings } from "@/context/SettingsContext";

export function useCurrency() {
  const { settings, updateSettings, resetToDefault } = useSettings();

  const currency = settings.currency_symbol;

  const updateCurrency = (newCurrency: string) => {
    updateSettings({ currency_symbol: newCurrency });
  };

  const clearCurrency = () => {
    updateSettings({ currency_symbol: "$" });
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
