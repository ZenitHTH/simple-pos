"use client";

import { useMockup } from "../../context/MockupContext";
import { useSettings } from "../../context/SettingsContext";
import { useRouter, usePathname } from "next/navigation";
import NavigationMenu from "./NavigationMenu";
import GlobalScaleControls from "./GlobalScaleControls";
import GlobalLayoutControls from "./GlobalLayoutControls";
import ComponentScaleControls from "./ComponentScaleControls";
import DualColumnTuner from "./DualColumnTuner";
import ActionButton from "./ActionButton";

interface BottomControlPanelProps {
  hideSaveButton?: boolean;
  forceVisible?: boolean;
  dualColumnProps?: {
    split: number;
    onSplitChange: (v: number) => void;
    defaultSplit?: number;
  };
}

export default function BottomControlPanel({
  hideSaveButton = false,
  forceVisible = false,
  dualColumnProps,
}: BottomControlPanelProps) {
  const { isMockupMode, toggleMockupMode, selectedElementId } = useMockup();
  const { settings, updateSettings, save } = useSettings();
  const router = useRouter();
  const pathname = usePathname();

  if (!isMockupMode && !forceVisible) return null;

  const handleSave = async () => {
    await save();
    toggleMockupMode();
    if (pathname.startsWith("/design/tuner")) {
      router.push("/setting");
    }
  };

  return (
    <div className="bg-background/95 border-border fixed right-0 bottom-0 left-0 z-100 flex h-24 items-center justify-center border-t px-8 shadow-lg backdrop-blur">
      <div className="flex w-full max-w-5xl items-center gap-8">
        <NavigationMenu router={router} />

        <div className="border-border h-10 border-l"></div>

        <GlobalScaleControls
          value={settings.display_scale || 100}
          onChange={(val) => updateSettings({ display_scale: val })}
        />

        <div className="bg-border h-8 w-px"></div>

        <GlobalLayoutControls
          settings={settings}
          updateSettings={updateSettings}
          currentView={
            isMockupMode && selectedElementId === "payment_modal_scale"
              ? "payment"
              : undefined
          }
          pathname={pathname}
        />

        <ComponentScaleControls
          selectedId={selectedElementId}
          settings={settings}
          updateSettings={updateSettings}
        />

        {dualColumnProps && (
          <>
            <div className="bg-border h-8 w-px"></div>
            <DualColumnTuner
              split={dualColumnProps.split}
              onSplitChange={dualColumnProps.onSplitChange}
              defaultSplit={dualColumnProps.defaultSplit}
            />
          </>
        )}

        <div className="border-border mx-4 h-10 border-l"></div>

        {!hideSaveButton && (
          <ActionButton onClick={handleSave} label="Save Changes" />
        )}
      </div>
    </div>
  );
}
