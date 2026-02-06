"use client";

import { useState } from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import { FaCoins, FaTrash } from 'react-icons/fa';

export default function CurrencySettings() {
    const { currency, updateCurrency, clearAllCookies } = useCurrency();
    const [showWarning, setShowWarning] = useState(false);

    const handleResetDefaults = () => {
        clearAllCookies(); // This now calls resetToDefault() in context
        setShowWarning(false);
    };

    return (
        <div className="bg-card-bg border border-border rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaCoins className="text-primary" />
                Currency Settings
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {/* Currency Symbol Input */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Currency Symbol
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={currency}
                            onChange={(e) => updateCurrency(e.target.value)}
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                            placeholder="$"
                            maxLength={5}
                        />
                    </div>
                    <p className="text-xs text-muted mt-2">
                        This symbol will be used throughout the application.
                    </p>
                </div>

                {/* Reset Defaults Section */}
                <div className="flex items-end">
                    <button
                        onClick={() => setShowWarning(true)}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                    >
                        <FaTrash size={14} />
                        Reset to Default
                    </button>
                </div>
            </div>

            {/* Warning Modal */}
            {showWarning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card-bg w-full max-w-sm rounded-xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in duration-200 p-6">
                        <h3 className="text-lg font-bold text-red-500 mb-2">Warning: Reset Settings</h3>
                        <p className="text-muted mb-6">
                            Are you sure you want to reset all settings to their defaults? You will need to click 'Save Changes' to persist this action.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowWarning(false)}
                                className="px-4 py-2 rounded-lg text-foreground hover:bg-muted/10 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleResetDefaults}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors shadow-lg shadow-red-500/20"
                            >
                                Yes, Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
