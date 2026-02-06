"use client";

import ExportSection from './ExportSection';
import CurrencySettings from './CurrencySettings';

export default function SettingPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">System Settings</h1>
            <p className="text-muted mb-8">Configure your POS system settings here.</p>

            {/* Currency Settings */}
            <CurrencySettings />

            {/* Export Section */}
            <ExportSection />
        </div>
    );
}
