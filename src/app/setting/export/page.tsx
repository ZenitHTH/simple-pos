"use client";

import { useSettings } from "@/context/settings/SettingsContext";
import ManagementPageLayout from "@/components/layout/ManagementPageLayout";
import ExportSection from "@/components/settings/ExportSection";
import ResetSettingsButton from "@/components/settings/ResetSettingsButton";

export default function ExportSettingPage() {
  const { settings } = useSettings();

  return (
    <ManagementPageLayout
      title="Export Data"
      subtitle="Export transaction history and reports."
      headerActions={<ResetSettingsButton />}
      scaleKey="setting_page_scale"
      scrollable={true}
      layoutMaxWidth={settings.layout_max_width}
    >
      <ExportSection />
    </ManagementPageLayout>
  );
}
