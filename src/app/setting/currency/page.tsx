"use client";

import { useSettings } from "@/context/settings/SettingsContext";
import { useCallback } from "react";
import ManagementPageLayout from "@/components/layout/ManagementPageLayout";
import CurrencySettings from "@/components/settings/CurrencySettings";
import ResetSettingsButton from "@/components/settings/ResetSettingsButton";

export default function CurrencySettingPage() {
  const { settings, updateSettings } = useSettings();

  const handleUpdateCurrency = useCallback(
    (symbol: string) => {
      updateSettings({ currency_symbol: symbol });
    },
    [updateSettings],
  );

  return (
    <ManagementPageLayout
      title="Currency Settings"
      subtitle="Configure currency symbol and formatting."
      headerActions={<ResetSettingsButton />}
      scaleKey="setting_page_scale"
      scrollable={true}
      layoutMaxWidth={settings.layout_max_width}
    >
      <CurrencySettings
        currency={settings.currency_symbol}
        onUpdateCurrency={handleUpdateCurrency}
      />
    </ManagementPageLayout>
  );
}
