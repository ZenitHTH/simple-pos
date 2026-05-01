"use client";

import ManagementPageLayout from "@/components/layout/ManagementPageLayout";
import GeneralSettings from "@/components/settings/GeneralSettings";
import ExportSection from "@/components/settings/ExportSection";
import SettingsActions from "@/components/settings/SettingsActions";

/**
 * ExpertPage handles technical storage and database configurations.
 */
export default function ExpertPage() {
  return (
    <ManagementPageLayout
      title="Expert & Database"
      subtitle="Advanced storage configuration and data exports."
      headerActions={<SettingsActions />}
      scaleKey="setting_page_scale"
      scrollable={false}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full overflow-hidden">
        <GeneralSettings />
        <ExportSection />
      </div>
    </ManagementPageLayout>
  );
}
