"use client";

import { useMockup } from "@/context/MockupContext";
import { useSettings } from "@/context/settings/SettingsContext";
import { useRouter, usePathname } from "next/navigation";
import NavigationMenu from "./NavigationMenu";
import GlobalScaleControls from "./GlobalScaleControls";
import GlobalLayoutControls from "./GlobalLayoutControls";
import ComponentScaleControls from "./ComponentScaleControls";
import DualColumnTuner from "./DualColumnTuner";
import ActionButton from "./ActionButton";
import { FaPalette } from "react-icons/fa";

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

        <div className="bg-border h-8 w-px"></div>

        <div className="flex flex-col items-center gap-1">
          <label className="text-muted-foreground flex items-center gap-1 text-[10px] font-medium tracking-wider uppercase">
            <FaPalette className="text-[10px]" />
            Theme
          </label>
          <div className="flex items-center gap-2">
            <div className="border-border relative h-6 w-10 overflow-hidden rounded border">
              <input
                type="color"
                value={settings.theme_primary_color || "#3b82f6"}
                onChange={(e) =>
                  updateSettings({ theme_primary_color: e.target.value })
                }
                className="absolute inset-0 h-full w-full scale-150 cursor-pointer border-none bg-transparent p-0"
              />
            </div>
            {settings.theme_primary_color && (
              <button
                onClick={() => updateSettings({ theme_primary_color: null })}
                className="text-muted-foreground hover:text-foreground text-[10px] underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>

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
