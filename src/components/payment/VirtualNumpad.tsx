import { memo } from "react";
import { FaBackspace } from "react-icons/fa";

interface VirtualNumpadProps {
  onPress: (key: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  height?: number;
}

const VirtualNumpad = memo(
  ({ onPress, onClear, onBackspace, height }: VirtualNumpadProps) => {
    const keys = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "00", "0", "."];

    return (
      <div
        className={`grid grid-cols-4 gap-3 select-none ${!height ? "h-48 sm:h-56 lg:h-64 xl:h-80" : ""}`}
        style={{ height: height ? `${height}px` : undefined }}
      >
        {/* Numbers Section (3 cols) */}
        <div className="col-span-3 grid grid-cols-3 gap-3">
          {keys.map((key) => (
            <button
              key={key}
              onClick={() => onPress(key)}
              className="bg-card text-foreground border-border active:bg-primary active:text-primary-foreground focus:ring-primary/40 flex items-center justify-center rounded-2xl border text-4xl font-black shadow-sm transition-all outline-none focus:ring-4 active:scale-92 active:shadow-inner touch-manipulation"
              type="button"
            >
              {key}
            </button>
          ))}
        </div>

        {/* Actions Section (1 col) */}
        <div className="col-span-1 grid grid-cols-1 gap-3">
          <button
            onClick={onBackspace}
            className="flex items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive transition-all active:bg-destructive active:text-white active:scale-92 active:shadow-inner touch-manipulation"
            type="button"
            aria-label="Backspace"
          >
            <FaBackspace size={32} />
          </button>
          <button
            onClick={onClear}
            className="bg-muted/20 text-muted-foreground border-border hover:bg-muted/30 active:bg-foreground active:text-background flex items-center justify-center rounded-2xl border text-xl font-black transition-all active:scale-92 active:shadow-inner touch-manipulation"
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
