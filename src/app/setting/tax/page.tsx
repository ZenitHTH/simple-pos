"use client";

import { useSettings } from "@/context/settings/SettingsContext";
import { useCallback } from "react";
import ManagementPageLayout from "@/components/layout/ManagementPageLayout";
import TaxSettings from "@/components/settings/TaxSettings";
import SettingsActions from "@/components/settings/SettingsActions";

export default function TaxSettingPage() {
  const { settings, updateSettings } = useSettings();

  const handleToggleTax = useCallback(() => {
    updateSettings({ general: { tax_enabled: !settings.general.tax_enabled } });
  }, [updateSettings, settings.general.tax_enabled]);

  const handleUpdateTaxRate = useCallback(
    (rate: number) => {
      updateSettings({ general: { tax_rate: rate } });
    },
    [updateSettings],
  );

  return (
    <ManagementPageLayout
      title="Tax Settings"
      subtitle="Configure tax rates and application rules."
      headerActions={<SettingsActions />}
      scaleKey="setting_page_scale"
      scrollable={true}
    >
      <TaxSettings
        isTaxEnabled={settings.general.tax_enabled}
        taxPercentage={settings.general.tax_rate}
        onToggleTax={handleToggleTax}
        onUpdateTaxRate={handleUpdateTaxRate}
      />
    </ManagementPageLayout>
  );
}
