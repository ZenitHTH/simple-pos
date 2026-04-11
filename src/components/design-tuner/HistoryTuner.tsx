"use client";

import { motion } from "framer-motion";
import HistoryHeader from "@/components/history/HistoryHeader";
import DateFilter from "@/components/history/DateFilter";
import IdSearch from "@/components/history/IdSearch";
import ReceiptList from "@/components/history/ReceiptList";
import { SidebarSlider } from "./SidebarSlider";
import { AppSettings } from "@/lib/types";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const SAMPLE_RECEIPTS = [
  {
    receipt_id: "RCP-2026-001",
    datetime_unix: Math.floor(Date.now() / 1000) - 3600,
    satang_total: 12500,
  },
  {
    receipt_id: "RCP-2026-002",
    datetime_unix: Math.floor(Date.now() / 1000) - 7200,
    satang_total: 4500,
  },
  {
    receipt_id: "RCP-2026-003",
    datetime_unix: Math.floor(Date.now() / 1000) - 86400,
    satang_total: 8900,
  },
];

interface HistoryTunerProps {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

export function HistoryTuner({ settings, updateSettings }: HistoryTunerProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      <motion.div variants={item}>
        <h2 className="mb-2 text-3xl font-bold tracking-tight">Order History</h2>
        <p className="text-muted-foreground text-lg">
          Adjust the typography and layout of the Order History page. These
          settings help with readability on different screen sizes.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Controls */}
        <motion.div
          variants={item}
          className="border-border/60 bg-card/50 h-fit space-y-8 rounded-3xl border p-8 shadow-sm backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold">Typography Tuning</h3>
          <div className="space-y-6">
            <SidebarSlider
              label="Header Size"
              value={settings.scaling.fonts.header ?? 100}
              onChange={(v) => updateSettings({ scaling: { fonts: { header: v } } })}
              min={50}
              max={150}
              unit="%"
            />
            <SidebarSlider
              label="Content Size"
              value={settings.scaling.fonts.history ?? 100}
              onChange={(v) => updateSettings({ scaling: { fonts: { history: v } } })}
              min={50}
              max={150}
              unit="%"
            />
          </div>
          <div className="bg-primary/5 rounded-2xl border border-primary/10 p-4 text-xs text-muted-foreground leading-relaxed">
            <strong>Tip:</strong> The <em>Header Size</em> affects the page title
            and navigation, while <em>Content Size</em> affects receipt IDs,
            dates, and filter inputs.
          </div>
        </motion.div>

        {/* Live Preview */}
        <motion.div
          variants={item}
          className="lg:col-span-2 space-y-6"
        >
          <div className="border-border/60 bg-card/30 rounded-3xl border p-8 shadow-xl backdrop-blur-sm relative overflow-hidden">
             {/* Preview Zoom Layer */}
             <div style={{ fontSize: `${settings.scaling.fonts.history || 100}%` }}>
                <HistoryHeader />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="scale-90 origin-top-left -mb-10">
                        <DateFilter 
                            startDate="" 
                            endDate="" 
                            loading={false} 
                            onStartDateChange={() => {}} 
                            onEndDateChange={() => {}} 
                            onFilter={() => {}} 
                        />
                    </div>
                    <div className="scale-90 origin-top-left -mb-10">
                        <IdSearch 
                            searchId="" 
                            loading={false} 
                            onSearchIdChange={() => {}} 
                            onSearch={() => {}} 
                        />
                    </div>
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 ml-2">Recent Transactions</h4>
                <ReceiptList 
                    receipts={SAMPLE_RECEIPTS as any} 
                    loading={false} 
                    onSelect={() => {}} 
                />
             </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
