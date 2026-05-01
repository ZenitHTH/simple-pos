import { memo } from "react";
import { useMockup } from "@/context/MockupContext";
import { useSettings } from "@/context/settings/SettingsContext";
import { useRouter } from "next/navigation";
import { FaDesktop, FaMagic, FaArrowsAlt, FaExpandAlt } from "react-icons/fa";
import { Switch } from "@/components/ui/Switch";
import SettingsSection from "@/components/ui/SettingsSection";
import NumberSlider from "@/components/ui/NumberSlider";

const DisplaySettings = memo(() => {
  const { isMockupMode, toggleMockupMode } = useMockup();
  const { settings, updateSettings } = useSettings();
  const router = useRouter();

  return (
    <SettingsSection title="Display & Interface" icon={FaDesktop}>
      {/* Global Scale Setting */}
      <div className="bg-muted/10 border-border/50 hover:bg-muted/20 mb-6 rounded-2xl border p-6 transition-[background-color]">
        <div className="mb-6 flex items-center gap-3">
          <div className="bg-primary/10 rounded-xl p-2.5">
            <FaExpandAlt className="text-primary text-lg" />
          </div>
          <div>
            <p className="text-foreground text-sm font-black tracking-wider uppercase">
              Display Scale
            </p>
            <p className="text-muted-foreground text-xs font-medium">
              Adjust overall interface size for your screen
            </p>
          </div>
        </div>

        <NumberSlider
          label="Global Scale"
          min={75}
          max={125}
          step={5}
          value={settings.scaling.display_scale || 100}
          onChange={(val) =>
            updateSettings({ scaling: { display_scale: val } })
          }
          unit="%"
        />
      </div>

      {/* Design Mode (On-Canvas) */}
      <div className="bg-muted/10 border-border/50 hover:bg-muted/20 rounded-2xl border p-6 transition-[background-color]">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-success/10 rounded-xl p-2.5">
              <FaArrowsAlt className="text-success text-lg" />
            </div>
            <div>
              <p className="text-foreground text-sm font-black tracking-wider uppercase">
                Design Mode
              </p>
              <p className="text-muted-foreground text-xs font-medium">
                Directly resize UI components on the screen
              </p>
            </div>
          </div>
          <Switch checked={isMockupMode} onClick={toggleMockupMode} />
        </div>

        <div className="bg-background/40 border-border/60 mb-6 rounded-xl border p-4 text-xs leading-relaxed">
          <p className="text-foreground/80 mb-2 flex items-center gap-2 font-black tracking-widest uppercase">
            <FaMagic className="text-primary" />
            Interactive Editor
          </p>
          <ul className="text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-2 font-medium">
            <li className="flex items-center gap-2">• Sidebar & Cart widths</li>
            <li className="flex items-center gap-2">• Product Grid sizing</li>
            <li className="flex items-center gap-2">• Table & Modal scales</li>
            <li className="flex items-center gap-2">• Global Font sizing</li>
          </ul>
        </div>

        <button
          onClick={() => router.push("/design/tuner")}
          className="group flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700/50 bg-zinc-900 py-4 text-xs font-black tracking-[0.2em] text-zinc-100 uppercase shadow-xl transition-[background-color,transform,box-shadow] hover:bg-zinc-800 active:scale-[0.98]"
        >
          <FaMagic className="group-hover:text-primary transition-colors" />
          Open Professional Design Tuner
        </button>
      </div>
    </SettingsSection>
  );
});

DisplaySettings.displayName = "DisplaySettings";

export default DisplaySettings;
