import { FaBackspace } from "react-icons/fa";

/**
 * Props for the VirtualNumpad component.
 */
interface VirtualNumpadProps {
  /** Callback triggered when a key is pressed. */
  onPress: (key: string) => void;
  /** Callback triggered when the 'CLEAR' button is pressed. */
  onClear: () => void;
  /** Callback triggered when the backspace button is pressed. */
  onBackspace: () => void;
  /** Optional explicit height for the numpad in pixels. */
  height?: number;
  /** Optional gap between buttons in pixels. */
  gap?: number;
  /** Optional explicit height for each button in pixels. */
  buttonHeight?: number;
  /** Optional font scale percentage. */
  fontScale?: number;
}

/**
 * A virtual numeric keypad component for touch-friendly data entry.
 * Features customizable gaps, button heights, and font scaling via settings.
 * Includes numbers 0-9, 00, decimal point, backspace, and clear all buttons.
 *
 * @param props - The virtual numpad props.
 * @returns A touch-optimized numeric keypad.
 */
export default function VirtualNumpad({
  onPress,
  onClear,
  onBackspace,
  height,
  gap = 12,
  buttonHeight = 80,
  fontScale = 100,
}: VirtualNumpadProps) {
  const keys = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "00", "0", "."];

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
      <div className="col-span-3 grid grid-cols-3" style={{ gap: `${gap}px` }}>
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => onPress(key)}
            className="bg-card text-foreground border-border active:bg-primary active:text-primary-foreground focus:ring-primary/40 flex touch-manipulation items-center justify-center rounded-2xl border text-4xl font-black shadow-sm transition-[background-color,color,transform,box-shadow,border-color] duration-200 outline-none focus:ring-4 active:scale-92 active:shadow-inner"
            style={{ height: `${buttonHeight}px` }}
            type="button"
          >
            {key}
          </button>
        ))}
      </div>

      {/* Actions Section (1 col) */}
      <div className="col-span-1 grid grid-cols-1" style={{ gap: `${gap}px` }}>
        <button
          onClick={onBackspace}
          className="border-destructive/20 bg-destructive/10 text-destructive active:bg-destructive flex touch-manipulation items-center justify-center rounded-2xl border transition-[background-color,color,transform,box-shadow,border-color] duration-200 active:scale-92 active:text-white active:shadow-inner"
          style={{ height: `${buttonHeight}px` }}
          type="button"
          aria-label="Backspace"
        >
          <FaBackspace size={32} />
        </button>
        <button
          onClick={onClear}
          className="bg-muted/20 text-muted-foreground border-border hover:bg-muted/30 active:bg-foreground active:text-background flex touch-manipulation items-center justify-center rounded-2xl border text-xl font-black transition-[background-color,color,transform,box-shadow,border-color] duration-200 active:scale-92 active:shadow-inner"
          style={{ height: `${buttonHeight}px` }}
          type="button"
          aria-label="Clear All"
        >
          CLEAR
        </button>
      </div>
    </div>
  );
}
