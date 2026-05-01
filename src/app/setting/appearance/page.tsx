"use client";

import ManagementPageLayout from "@/components/layout/ManagementPageLayout";
import ThemeSettings from "@/components/settings/ThemeSettings";
import DisplaySettings from "@/components/settings/DisplaySettings";
import SettingsActions from "@/components/settings/SettingsActions";

/**
 * AppearancePage handles the visual and UI scaling settings.
 * Designed to be single-view (non-scrollable) to optimize performance.
 */
export default function AppearancePage() {
  return (
    <ManagementPageLayout
      title="Appearance"
      subtitle="Customize your visual experience and UI scale."
      headerActions={<SettingsActions />}
      scaleKey="setting_page_scale"
      scrollable={false}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full overflow-hidden">
        <ThemeSettings />
        <DisplaySettings />
      </div>
    </ManagementPageLayout>
  );
}
