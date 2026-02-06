import { memo } from 'react';
import { useSettings } from '../context/SettingsContext';
import { FaDesktop, FaMobileAlt, FaExpand } from 'react-icons/fa';

const DisplaySettings = memo(() => {
    const { settings, updateSettings } = useSettings();

    const handleScaleChange = (scale: number) => {
        updateSettings({ display_scale: scale });
    };

    const PRESETS = [
        { label: 'Tiny', value: 50, icon: <FaMobileAlt className="w-3 h-3" /> },
        { label: 'Compact', value: 75, icon: <FaMobileAlt className="w-4 h-4" /> },
        { label: 'Normal', value: 100, icon: <FaDesktop className="w-5 h-5" /> },
        { label: 'Large', value: 125, icon: <FaExpand className="w-5 h-5" /> },
        { label: 'Huge', value: 150, icon: <FaExpand className="w-6 h-6" /> },
        { label: 'Max', value: 200, icon: <FaExpand className="w-8 h-8" /> },
    ];

    return (
        <section className="mb-8 p-6 bg-card-bg border border-border rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <FaDesktop className="text-primary" />
                Display Size
            </h2>

            <div className="space-y-6">
                {/* Global Scale */}
                <div className="bg-muted/10 p-4 rounded-xl space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-foreground">Global Interface Scale</p>
                            <p className="text-sm text-muted">Adjust overall size</p>
                        </div>
                        <div className="text-2xl font-bold text-primary">{settings.display_scale}%</div>
                    </div>
                    <input
                        type="range" min="50" max="200" step="5"
                        value={settings.display_scale}
                        onChange={(e) => handleScaleChange(Number(e.target.value))}
                        className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                    />
                    <div className="grid grid-cols-6 gap-2">
                        {PRESETS.map((preset) => (
                            <button
                                key={preset.value}
                                onClick={() => handleScaleChange(preset.value)}
                                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${settings.display_scale === preset.value
                                        ? 'bg-primary/10 border-primary text-primary'
                                        : 'bg-background border-border text-muted hover:border-primary/50'
                                    }`}
                            >
                                <span className="text-xs font-bold">{preset.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sidebar Scale */}
                    <div className="bg-muted/5 p-4 rounded-xl border border-border">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-sm">Sidebar Width</span>
                            <span className="font-bold text-primary">{settings.sidebar_scale || 100}%</span>
                        </div>
                        <input
                            type="range" min="50" max="150" step="5"
                            value={settings.sidebar_scale || 100}
                            onChange={(e) => updateSettings({ sidebar_scale: Number(e.target.value) })}
                            className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    {/* Cart Scale */}
                    <div className="bg-muted/5 p-4 rounded-xl border border-border">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-sm">Cart Width</span>
                            <span className="font-bold text-primary">{settings.cart_scale || 100}%</span>
                        </div>
                        <input
                            type="range" min="50" max="150" step="5"
                            value={settings.cart_scale || 100}
                            onChange={(e) => updateSettings({ cart_scale: Number(e.target.value) })}
                            className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    {/* Grid Scale */}
                    <div className="col-span-1 md:col-span-2 bg-muted/5 p-4 rounded-xl border border-border">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-sm">Product Grid Size</span>
                            <span className="font-bold text-primary">{settings.grid_scale || 100}%</span>
                        </div>
                        <p className="text-xs text-muted mb-2">Higher % = Fewer columns (Larger cards)</p>
                        <input
                            type="range" min="80" max="130" step="5"
                            value={settings.grid_scale || 100}
                            onChange={(e) => updateSettings({ grid_scale: Number(e.target.value) })}
                            className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
});

DisplaySettings.displayName = 'DisplaySettings';

export default DisplaySettings;
