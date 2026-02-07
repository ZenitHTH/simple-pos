import { memo } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useMockup } from '../context/MockupContext';
import { FaDesktop, FaMobileAlt, FaExpand } from 'react-icons/fa';

const DisplaySettings = memo(() => {
    const { settings, updateSettings } = useSettings();
    const { isMockupMode, toggleMockupMode } = useMockup();

    return (
        <section className="mb-8 p-6 bg-card-bg border border-border rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <FaDesktop className="text-primary" />
                Display Size
            </h2>

            <div className="space-y-6">
                {/* Design Mode Toggle */}
                <div className="bg-muted/10 p-4 rounded-xl space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-foreground">Design Mode (UI Adjustments)</p>
                            <p className="text-sm text-muted">Enable visual resizing of UI components</p>
                        </div>
                        <button
                            onClick={toggleMockupMode}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isMockupMode ? 'bg-primary' : 'bg-secondary'}`}
                        >
                            <span
                                className={`${isMockupMode ? 'translate-x-6' : 'translate-x-1'
                                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                            />
                        </button>
                    </div>

                    {/* Information / Help Text */}
                    <div className="text-sm text-muted bg-background p-3 rounded-lg border border-border">
                        <p>
                            <span className="font-semibold text-primary">Tip:</span> Enable Design Mode to:
                        </p>
                        <ul className="list-disc list-inside mt-1 ml-1 space-y-1">
                            <li>Resize the <strong>Sidebar</strong> and <strong>Cart</strong> width</li>
                            <li>Adjust <strong>Product Grid</strong> columns and sizes</li>
                            <li>Scale <strong>Management Tables</strong></li>
                            <li>Change <strong>Global Font Size</strong></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
});

DisplaySettings.displayName = 'DisplaySettings';

export default DisplaySettings;
