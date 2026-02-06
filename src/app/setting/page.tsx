"use client";

import ExportSection from './ExportSection';
import CurrencySettings from './CurrencySettings';
import TaxSettings from './TaxSettings';
import DisplaySettings from './DisplaySettings';
import { useSettings } from '../context/SettingsContext';
import { FaSave, FaCheck } from 'react-icons/fa';
import { useState } from 'react';

export default function SettingPage() {
    const { save } = useSettings();
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await save();
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to save", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="h-full overflow-y-auto w-full custom-scrollbar">
            <div className="p-8 max-w-4xl mx-auto pb-24">
                <h1 className="text-3xl font-bold mb-2">System Settings</h1>
                <p className="text-muted mb-8">Configure your POS system settings here.</p>

                {/* Display Settings */}
                <DisplaySettings />

                {/* Currency Settings */}
                <CurrencySettings />

                {/* Tax Settings */}
                <TaxSettings />

                {/* Export Section */}
                <ExportSection />
            </div>

            {/* Floating Save Bar */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all ${showSuccess
                        ? 'bg-green-500 text-white hover:bg-green-600 shadow-green-500/20'
                        : 'bg-primary text-primary-foreground hover:opacity-90 shadow-primary/20'
                        }`}
                >
                    {showSuccess ? (
                        <>
                            <FaCheck />
                            Saved Successfully
                        </>
                    ) : (
                        <>
                            <FaSave />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
