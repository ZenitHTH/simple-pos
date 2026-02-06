import { memo } from 'react';
import { FaBackspace, FaTrash } from 'react-icons/fa';

interface VirtualNumpadProps {
    onPress: (key: string) => void;
    onClear: () => void;
    onBackspace: () => void;
}

const VirtualNumpad = memo(({ onPress, onClear, onBackspace }: VirtualNumpadProps) => {
    const keys = [
        '7', '8', '9',
        '4', '5', '6',
        '1', '2', '3',
        '00', '0', '.'
    ];

    return (
        <div className="grid grid-cols-4 gap-3 h-48 sm:h-56 lg:h-64 xl:h-80 select-none">
            {/* Numbers Section (3 cols) */}
            <div className="col-span-3 grid grid-cols-3 gap-3">
                {keys.map((key) => (
                    <button
                        key={key}
                        onClick={() => onPress(key)}
                        className="flex items-center justify-center text-3xl font-bold bg-card-bg border border-border rounded-2xl shadow-sm hover:bg-muted/10 active:scale-95 active:bg-primary/5 transition-all outline-none focus:ring-2 focus:ring-primary/20"
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
                    className="flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl hover:bg-red-500/20 active:scale-95 transition-all"
                    type="button"
                    aria-label="Backspace"
                >
                    <FaBackspace size={28} />
                </button>
                <button
                    onClick={onClear}
                    className="flex items-center justify-center bg-muted/10 text-muted-foreground border border-border rounded-2xl hover:bg-muted/20 active:scale-95 transition-all text-xl font-bold"
                    type="button"
                    aria-label="Clear All"
                >
                    CLEAR
                </button>
            </div>
        </div>
    );
});

VirtualNumpad.displayName = 'VirtualNumpad';

export default VirtualNumpad;
