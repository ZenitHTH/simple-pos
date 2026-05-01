"use client";

import React, { useState } from "react";
import { useSettings } from "@/context/settings/SettingsContext";
import { FaCheck, FaCog } from "react-icons/fa";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { CURRENCIES } from "./CurrencySettings";
import { logger } from "@/lib/utils/logger";
import { TunerSlider } from "../design-tuner/ui/TunerSlider";

interface SettingsSetupProps {
  onComplete: () => void;
}

/**
 * SettingsSetup Component
 * 
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
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
      <div 
        className="bg-card border-border w-full max-w-2xl flex flex-col gap-8 rounded-3xl border p-10 shadow-2xl origin-center"
        style={{ 
          transform: `scale(${(settings.scaling.display_scale || 100) / 100})`,
        }}
      >
        <div className="text-center">
          <div className="bg-primary/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <FaCog className="text-primary text-3xl" />
          </div>
          <h1 className="text-foreground mb-3 text-4xl font-black tracking-tight">
            Final Touches
          </h1>
          <p className="text-muted-foreground text-lg">
            Personalize your workspace before we begin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Localization */}
          <div className="flex flex-col gap-8">
            {/* Currency Section */}
            <div className="bg-muted/30 border-border/50 rounded-2xl border p-6">
              <h3 className="text-foreground mb-4 flex items-center gap-2 font-bold uppercase tracking-widest text-xs opacity-50">
                Currency
              </h3>
              <Select
                label="Region & Symbol"
                value={
                  CURRENCIES.find((c) => c.symbol === settings.general.currency_symbol)
                    ?.code || "CUSTOM"
                }
                onChange={(val: string | number) => {
                  const code = val as string;
                  const selected = CURRENCIES.find((c) => c.code === code);
                  if (selected) {
                    updateSettings({ general: { currency_symbol: selected.symbol } });
                  }
                }}
                options={[
                  ...CURRENCIES.map((c) => ({
                    value: c.code,
                    label: `${c.country} (${c.code}) - ${c.symbol}`,
                  })),
                  ...(!CURRENCIES.some(
                    (c) => c.symbol === settings.general.currency_symbol,
                  )
                    ? [
                        {
                          value: "CUSTOM",
                          label: `Custom (${settings.general.currency_symbol})`,
                        },
                      ]
                    : []),
                ]}
              />
            </div>

            {/* Tax Section */}
            <div className="bg-muted/30 border-border/50 rounded-2xl border p-6 flex flex-col gap-4">
              <h3 className="text-foreground mb-4 flex items-center gap-2 font-bold uppercase tracking-widest text-xs opacity-50">
                Tax (VAT)
              </h3>
              <label className="bg-background/50 border-border/50 hover:border-primary/50 flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-[border-color,background-color]">
                <input
                  type="checkbox"
                  checked={settings.general.tax_enabled}
                  onChange={(e) =>
                    updateSettings({ general: { tax_enabled: e.target.checked } })
                  }
                  className="text-primary focus:ring-primary h-6 w-6 rounded-lg border-2"
                />
                <span className="text-foreground font-bold">
                  Enable Tax Calculation
                </span>
              </label>

              {settings.general.tax_enabled && (
                <Input
                  label="Rate (%)"
                  type="number"
                  value={settings.general.tax_rate}
                  onChange={(e) =>
                    updateSettings({
                      general: { tax_rate: parseFloat(e.target.value) || 0 },
                    })
                  }
                  placeholder="7.0"
                  step="0.01"
                />
              )}
            </div>
          </div>

          {/* Right Column: Layout */}
          <div className="bg-primary/5 border-primary/10 rounded-2xl border p-8 flex flex-col justify-center gap-8">
            <h3 className="text-primary mb-6 flex items-center gap-2 font-black uppercase tracking-widest text-xs">
              Display & Scale
            </h3>
            
            <TunerSlider
              label="Interface Zoom"
              min={75}
              max={125}
              step={5}
              value={settings.scaling.display_scale || 100}
              onChange={(val) => updateSettings({ scaling: { display_scale: val } })}
              unit="%"
            />

            <div className="text-[10px] text-muted-foreground leading-relaxed italic bg-background/40 p-4 rounded-xl border border-border/30">
              Tip: Adjust the zoom to fit your screen resolution. You can always change this later in Design Mode.
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`text-primary-foreground shadow-2xl shadow-primary/40 flex w-full transform items-center justify-center gap-3 rounded-2xl px-8 py-5 text-xl font-black transition-[transform,background-color,box-shadow] hover:scale-[1.02] active:scale-[0.98] ${
            saving
              ? "bg-primary/70 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90"
          }`}
        >
          {saving ? "Deploying Settings..." : "Complete Setup"}
          {!saving && <FaCheck className="text-lg" />}
        </button>
      </div>
    </div>
  );
}
