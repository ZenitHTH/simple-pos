"use client";

import { useMockup } from "@/context/MockupContext";
import { useSettings } from "@/context/settings/SettingsContext";
import { useRouter, usePathname } from "next/navigation";
import { FaUndo, FaRedo } from "react-icons/fa";
import NavigationMenu from "./NavigationMenu";
import DualColumnTuner from "./DualColumnTuner";
import ActionButton from "./ActionButton";
import { TunerSlider } from "../design-tuner/ui/TunerSlider";

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
  const { settings, updateSettings, save, undo, redo, canUndo, canRedo } = useSettings();
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/design/tuner") return null;
  if (!isMockupMode && !forceVisible) return null;

  const handleSave = async () => {
    await save();
    toggleMockupMode();
    if (pathname.startsWith("/design/tuner")) {
      router.push("/setting");
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-auto pointer-events-auto">
      <div className="bg-background/80 border-border/60 flex items-center gap-6 rounded-full border px-6 py-3 shadow-2xl backdrop-blur-xl transition-all hover:shadow-primary/20 hover:border-primary/40">

        {/* Navigation */}
        <div className="flex items-center gap-6 shrink-0">
          <NavigationMenu router={router} />
        </div>

        <div className="bg-border h-8 w-px opacity-40"></div>

        {/* Global Layout & Custom Tuners */}
        <div className="flex items-center gap-8">
          {/* Global Scalers */}
          <div className="flex items-center gap-6">
            <div className="w-32">
              <TunerSlider
                label="Display Zoom"
                min={75}
                max={125}
                step={5}
                value={settings.scaling.display_scale || 100}
                onChange={(val) => updateSettings({ scaling: { display_scale: val } })}   
                unit="%"
              />
            </div>
          </div>
          {/* Dual Column Tuner (Only on specific pages like Settings) */}
          {dualColumnProps && (
            <>
              <div className="bg-border h-8 w-px opacity-40"></div>
              <DualColumnTuner
                split={dualColumnProps.split}
                onSplitChange={dualColumnProps.onSplitChange}
                defaultSplit={dualColumnProps.defaultSplit}
              />
            </>
          )}
        </div>

        <div className="bg-border h-8 w-px opacity-40"></div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-2 rounded-full hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <FaUndo className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-2 rounded-full hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <FaRedo className="w-4 h-4" />
          </button>
        </div>

        {/* Action Button */}
        {!hideSaveButton && (
          <>
            <div className="bg-border h-8 w-px opacity-40"></div>
            <ActionButton onClick={handleSave} label="Save Changes" />
          </>
        )}
      </div>
    </div>
  );
}

