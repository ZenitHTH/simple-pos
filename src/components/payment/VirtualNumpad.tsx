import { memo } from "react";
import { FaBackspace } from "react-icons/fa";
import { useSettings } from "@/context/settings/SettingsContext";

interface VirtualNumpadProps {
  onPress: (key: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  height?: number;
}

const VirtualNumpad = memo(
  ({ onPress, onClear, onBackspace, height }: VirtualNumpadProps) => {
    const { settings } = useSettings();
    const keys = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "00", "0", "."];

    const gap = settings.numpad_gap ?? 12;
    const buttonHeight = settings.numpad_button_height ?? 80;
    const fontScale = settings.numpad_font_scale ?? 100;

    return (
      <div
        className={`grid grid-cols-4 select-none ${!height ? "h-full" : ""}`}
        style={{
          height: height ? `${height}px` : undefined,
          gap: `${gap}px`,
          fontSize: `${fontScale}%`,
        }}
      >
        {/* Numbers Section (3 cols) */}
        <div
          className="col-span-3 grid grid-cols-3"
          style={{ gap: `${gap}px` }}
        >
          {keys.map((key) => (
            <button
              key={key}
              onClick={() => onPress(key)}
              className="bg-card text-foreground border-border active:bg-primary active:text-primary-foreground focus:ring-primary/40 flex items-center justify-center rounded-2xl border text-4xl font-black shadow-sm transition-all outline-none focus:ring-4 active:scale-92 active:shadow-inner touch-manipulation"
              style={{ height: `${buttonHeight}px` }}
              type="button"
            >
              {key}
            </button>
          ))}
        </div>

        {/* Actions Section (1 col) */}
        <div
          className="col-span-1 grid grid-cols-1"
          style={{ gap: `${gap}px` }}
        >
          <button
            onClick={onBackspace}
            className="flex items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive transition-all active:bg-destructive active:text-white active:scale-92 active:shadow-inner touch-manipulation"
            style={{ height: `${buttonHeight}px` }}
            type="button"
            aria-label="Backspace"
          >
            <FaBackspace size={32} />
          </button>
          <button
            onClick={onClear}
            className="bg-muted/20 text-muted-foreground border-border hover:bg-muted/30 active:bg-foreground active:text-background flex items-center justify-center rounded-2xl border text-xl font-black transition-all active:scale-92 active:shadow-inner touch-manipulation"
            style={{ height: `${buttonHeight}px` }}
            type="button"
            aria-label="Clear All"
          >
            CLEAR
          </button>
        </div>
      </div>
    );
  },
);

VirtualNumpad.displayName = "VirtualNumpad";

export default VirtualNumpad;
