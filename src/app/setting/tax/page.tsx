"use client";

import { useSettings } from "@/context/SettingsContext";
import { useCallback } from "react";
import ManagementPageLayout from "@/components/layout/ManagementPageLayout";
import TaxSettings from "@/components/settings/TaxSettings";
import ResetSettingsButton from "@/components/settings/ResetSettingsButton";

export default function TaxSettingPage() {
  const { settings, updateSettings } = useSettings();

  const handleToggleTax = useCallback(() => {
    updateSettings({ tax_enabled: !settings.tax_enabled });
  }, [updateSettings, settings.tax_enabled]);

  const handleUpdateTaxRate = useCallback(
    (rate: number) => {
      updateSettings({ tax_rate: rate });
    },
    [updateSettings],
  );

  return (
    <ManagementPageLayout
      title="Tax Settings"
      subtitle="Configure tax rates and application rules."
      headerActions={<ResetSettingsButton />}
      scaleKey="setting_page_scale"
      scrollable={true}
      layoutMaxWidth={settings.layout_max_width}
    >
      <TaxSettings
        isTaxEnabled={settings.tax_enabled}
        taxPercentage={settings.tax_rate}
        onToggleTax={handleToggleTax}
        onUpdateTaxRate={handleUpdateTaxRate}
      />
    </ManagementPageLayout>
  );
}
