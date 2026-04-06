"use client";

import React, { useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import { FaCheck, FaCog } from "react-icons/fa";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { CURRENCIES } from "./CurrencySettings";
import { logger } from "@/lib/logger";

interface SettingsSetupProps {
  onComplete: () => void;
}

export default function SettingsSetup({ onComplete }: SettingsSetupProps) {
  const { settings, updateSettings, save } = useSettings();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await save();
      onComplete();
    } catch (error) {
      logger.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-card border-border w-full max-w-2xl rounded-2xl border p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <FaCog className="text-primary text-2xl" />
          </div>
          <h1 className="text-foreground mb-2 text-3xl font-bold">
            Final Touches
          </h1>
          <p className="text-muted-foreground">
            Configure your regional settings.
          </p>
        </div>

        <div className="space-y-8">
          {/* Currency Section */}
          <div className="bg-muted/50 border-border rounded-xl border p-6">
            <h3 className="text-foreground mb-4 flex items-center gap-2 font-bold">
              Currency
            </h3>
            <div>
              <Select
                label="Currency Symbol"
                value={
                  CURRENCIES.find((c) => c.symbol === settings.currency_symbol)
                    ?.code || "CUSTOM"
                }
                onChange={(val: string | number) => {
                  const code = val as string;
                  const selected = CURRENCIES.find((c) => c.code === code);
                  if (selected) {
                    updateSettings({ currency_symbol: selected.symbol });
                  }
                }}
                options={[
                  ...CURRENCIES.map((c) => ({
                    value: c.code,
                    label: `${c.country} (${c.code}) - ${c.symbol}`,
                  })),
                  ...(!CURRENCIES.some(
                    (c) => c.symbol === settings.currency_symbol,
                  )
                    ? [
                      {
                        value: "CUSTOM",
                        label: `Custom (${settings.currency_symbol})`,
                      },
                    ]
                    : []),
                ]}
              />
              <p className="text-muted-foreground mt-2 text-xs">
                Symbol displayed next to prices (e.g., $, €, £, ¥)
              </p>
            </div>
          </div>

          {/* Tax Section */}
          <div className="bg-muted/50 border-border rounded-xl border p-6">
            <h3 className="text-foreground mb-4 flex items-center gap-2 font-bold">
              Tax Configuration
            </h3>
            <div className="space-y-4">
              <label className="bg-background border-border hover:border-primary/50 flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors">
                <input
                  type="checkbox"
                  checked={settings.tax_enabled}
                  onChange={(e) =>
                    updateSettings({ tax_enabled: e.target.checked })
                  }
                  className="text-primary focus:ring-primary h-5 w-5 rounded"
                />
                <span className="text-foreground font-medium">
                  Enable Tax Calculation
                </span>
              </label>

              {settings.tax_enabled && (
                <Input
                  label="Tax Rate (%)"
                  type="number"
                  value={settings.tax_rate}
                  onChange={(e) =>
                    updateSettings({
                      tax_rate: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="7.0"
                  step="0.01"
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`text-primary-foreground shadow-primary/30 flex w-full transform items-center justify-center gap-2 rounded-xl px-6 py-4 text-lg font-bold shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] ${saving
                ? "bg-primary/70 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90"
              }`}
          >
            {saving ? "Saving..." : "Finish Setup"}
            {!saving && <FaCheck />}
          </button>
        </div>
      </div>
    </div>
  );
}
