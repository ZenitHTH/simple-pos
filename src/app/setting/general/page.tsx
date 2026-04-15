"use client";

import { useSettings } from "@/context/settings/SettingsContext";
import { useCallback } from "react";
import { DeepPartial } from "@/lib";
import ManagementPageLayout from "@/components/layout/ManagementPageLayout";
import GeneralSettings from "@/components/settings/GeneralSettings";
import ThemeSettings from "@/components/settings/ThemeSettings";
import DisplaySettings from "@/components/settings/DisplaySettings";
import ResetSettingsButton from "@/components/settings/ResetSettingsButton";

export default function GeneralSettingPage() {
  const { settings, updateSettings } = useSettings();

  const handleUpdateSettings = useCallback(
    (updates: DeepPartial<typeof settings>) => {
      updateSettings(updates);
    },
    [updateSettings],
  );

  /**
   * General Settings Page correctly utilizes ManagementPageLayout
   * with 'setting_page_scale' to ensure consistent scaling.
   */
  return (
    <ManagementPageLayout
      title="General Settings"
      subtitle="Configure application settings, appearance, and display options."
      headerActions={<ResetSettingsButton />}
      scaleKey="setting_page_scale"
      scrollable={true}
    >
      <div className="space-y-6">
        <GeneralSettings
          imageStoragePath={settings.storage.image_storage_path ?? undefined}
          dbStoragePath={settings.storage.db_storage_path ?? undefined}
          onUpdateSettings={handleUpdateSettings}
        />
        <ThemeSettings />
        <DisplaySettings />
      </div>
    </ManagementPageLayout>
  );
}
