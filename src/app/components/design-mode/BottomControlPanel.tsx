"use client";

import { useMockup } from "../../context/MockupContext";
import { useSettings } from "../../context/SettingsContext";
import { useRouter } from "next/navigation";
import NavigationMenu from "./NavigationMenu";
import GlobalScaleControls from "./GlobalScaleControls";
import ComponentScaleControls from "./ComponentScaleControls";
import ActionButton from "./ActionButton";

export default function BottomControlPanel() {
    const { isMockupMode, toggleMockupMode, selectedElementId } = useMockup();
    const { settings, updateSettings, save } = useSettings();
    const router = useRouter();

    if (!isMockupMode) return null;

    const handleSave = async () => {
        await save();
        toggleMockupMode();
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 h-24 bg-background/95 backdrop-blur border-t border-border z-[100] flex items-center justify-center shadow-lg px-8">
            <div className="w-full max-w-5xl flex items-center gap-8">
                <NavigationMenu router={router} />

                <div className="h-10 border-l border-border"></div>

                <GlobalScaleControls
                    value={settings.display_scale || 100}
                    onChange={(val) => updateSettings({ display_scale: val })}
                />

                <ComponentScaleControls
                    selectedId={selectedElementId}
                    settings={settings}
                    updateSettings={updateSettings}
                />

                <div className="border-l border-border h-10 mx-4"></div>

                <ActionButton onClick={handleSave} label="Save Changes" />
            </div>
        </div>
    );
}
