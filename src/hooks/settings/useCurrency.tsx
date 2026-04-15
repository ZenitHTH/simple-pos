import { useSettings } from "@/context/settings/SettingsContext";

/**
 * Hook to manage currency settings within the application.
 * It provides access to the current currency symbol and functions to update or reset it.
 * 
 * @returns {object} An object containing:
 * - currency: The current currency symbol (e.g., "$", "฿").
 * - updateCurrency: Function to update the currency symbol in settings.
 * - clearCurrency: Function to reset the currency symbol to default "$".
 * - clearAllCookies: Function to reset all application settings to defaults.
 */
export function useCurrency() {
  const { settings, updateSettings, resetToDefault } = useSettings();

  const currency = settings.general.currency_symbol;

  const updateCurrency = (newCurrency: string) => {
    updateSettings({ general: { ...settings.general, currency_symbol: newCurrency } });
  };

  const clearCurrency = () => {
    updateSettings({ general: { ...settings.general, currency_symbol: "$" } });
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
