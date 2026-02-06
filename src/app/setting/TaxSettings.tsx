"use client";

import { useTax } from '../hooks/useTax';

export default function TaxSettings() {
    const { isTaxEnabled, toggleTax, taxPercentage, setTaxPercentage } = useTax();

    return (
        <div className="bg-card-bg border border-border rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Tax Settings</h2>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-medium text-foreground">Enable Tax</h3>
                    <p className="text-sm text-muted">Apply tax to all orders automatically.</p>
                </div>
                <div className="flex items-center gap-4">
                    {isTaxEnabled && (
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={taxPercentage}
                                onChange={(e) => setTaxPercentage(Number(e.target.value))}
                                className="w-16 px-2 py-1 bg-background border border-border rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <span className="text-muted font-medium">%</span>
                        </div>
                    )}
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isTaxEnabled}
                            onChange={toggleTax}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>
        </div>
    );
}
