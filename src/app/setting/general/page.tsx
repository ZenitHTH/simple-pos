"use client";

import ManagementPageLayout from "@/components/layout/ManagementPageLayout";
import GeneralSettings from "@/components/settings/GeneralSettings";
import ThemeSettings from "@/components/settings/ThemeSettings";
import DisplaySettings from "@/components/settings/DisplaySettings";
import ResetSettingsButton from "@/components/settings/ResetSettingsButton";

export default function GeneralSettingPage() {
  /**
   * General Settings Page correctly utilizes ManagementPageLayout
   * with 'setting_page_scale' to ensure consistent scaling.
   * 
   * We no longer consume 'settings' here to prevent the whole page 
   * from re-rendering when a single setting changes.
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
        <GeneralSettings />
        <ThemeSettings />
        <DisplaySettings />
      </div>
    </ManagementPageLayout>
  );
}
