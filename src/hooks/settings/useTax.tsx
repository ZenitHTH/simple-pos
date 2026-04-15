import { useSettings } from "@/context/settings/SettingsContext";

/**
 * Hook to manage tax settings within the application.
 * Provides functions to toggle tax calculation and update the tax rate.
 * 
 * @returns {object} An object containing:
 * - isTaxEnabled: Boolean indicating if tax should be applied.
 * - toggleTax: Function to toggle tax enablement.
 * - taxPercentage: The current tax rate as a percentage (e.g., 7 for 7%).
 * - setTaxPercentage: Function to update the tax rate.
 * - taxRate: The tax rate as a decimal multiplier (e.g., 0.07).
 */
export function useTax() {
  const { settings, updateSettings } = useSettings();

  const isTaxEnabled = settings.general.tax_enabled;
  const taxPercentage = settings.general.tax_rate;

  const toggleTax = () => {
    updateSettings({ general: { ...settings.general, tax_enabled: !isTaxEnabled } });
  };

  const updateTaxRate = (rate: number) => {
    updateSettings({ general: { ...settings.general, tax_rate: rate } });
  };

  return {
    isTaxEnabled,
    toggleTax,
    taxPercentage,
    setTaxPercentage: updateTaxRate,
    taxRate: isTaxEnabled ? taxPercentage / 100 : 0,
  };
}
