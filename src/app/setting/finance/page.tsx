"use client";

import { useSettings } from "@/context/SettingsContext";
import { useCallback } from "react";
import ManagementPageLayout from "@/components/layout/ManagementPageLayout";
import CurrencySettings from "@/components/settings/CurrencySettings";
import TaxSettings from "@/components/settings/TaxSettings";
import ResetSettingsButton from "@/components/settings/ResetSettingsButton";
import { Separator } from "@/components/ui/Separator";

export default function FinanceSettingPage() {
    const { settings, updateSettings } = useSettings();

    const handleUpdateCurrency = useCallback(
        (symbol: string) => {
            updateSettings({ currency_symbol: symbol });
        },
        [updateSettings],
    );

    const handleToggleTax = useCallback(() => {
        updateSettings({ tax_enabled: !settings.tax_enabled });
    }, [updateSettings, settings.tax_enabled]);

    const handleUpdateTaxRate = useCallback(
        (rate: number) => {
            updateSettings({ tax_rate: rate });
        },
        [updateSettings],
    );

    return (
        <ManagementPageLayout
            title="Finance Settings"
            subtitle="Configure currency, tax rates, and financial rules."
            headerActions={<ResetSettingsButton />}
            scaleKey="setting_page_scale"
            scrollable={true}
            layoutMaxWidth={settings.layout_max_width}
        >
            <div className="space-y-8">
                <section>
                    <CurrencySettings
                        currency={settings.currency_symbol}
                        onUpdateCurrency={handleUpdateCurrency}
                    />
                </section>

                <Separator />

                <section>
                    <TaxSettings
                        isTaxEnabled={settings.tax_enabled}
                        taxPercentage={settings.tax_rate}
                        onToggleTax={handleToggleTax}
                        onUpdateTaxRate={handleUpdateTaxRate}
                    />
                </section>
            </div>
        </ManagementPageLayout>
    );
}
