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
      <div className="space-y-6">
        {/* Global Scale Setting */}
        <div className="bg-muted/10 rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-2.5 rounded-xl">
              <FaExpandAlt className="text-primary text-lg" />
            </div>
            <div>
              <p className="text-foreground font-black text-sm uppercase tracking-wider">
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
            value={settings.display_scale || 100}
            onChange={(val) => updateSettings({ display_scale: val })}
            unit="%"
          />
        </div>

        {/* Design Mode (On-Canvas) */}
        <div className="bg-muted/10 rounded-2xl p-6 border border-border/50 transition-all hover:bg-muted/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-success/10 p-2.5 rounded-xl">
                <FaArrowsAlt className="text-success text-lg" />
              </div>
              <div>
                <p className="text-foreground font-black text-sm uppercase tracking-wider">
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
            <p className="text-foreground/80 mb-2 font-black uppercase tracking-widest flex items-center gap-2">
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
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700/50 rounded-xl py-4 font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
          >
            <FaMagic className="group-hover:text-primary transition-colors" />
            Open Professional Design Tuner
          </button>
        </div>
      </div>
    </SettingsSection>
  );
});

DisplaySettings.displayName = "DisplaySettings";

export default DisplaySettings;
