"use client";

import { HistoryStylesPanel } from "./HistoryStylesPanel";
import HistoryHeader from "@/components/history/HistoryHeader";
import DateFilter from "@/components/history/DateFilter";
import IdSearch from "@/components/history/IdSearch";
import ReceiptList from "@/components/history/ReceiptList";
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
      className="grid grid-cols-1 gap-10 lg:grid-cols-3"
    >
      {/* Left Column: Controls */}
      <div className="lg:col-span-1">
        <div className="sticky top-10 space-y-6">
          <motion.div variants={item}>
            <h2 className="mb-2 text-3xl font-bold tracking-tight">Order History</h2>
            <p className="text-muted-foreground text-lg">
              Adjust the typography and layout of the Order History page. These
              settings help with readability on different screen sizes.
            </p>
          </motion.div>
          <HistoryStylesPanel settings={settings} updateSettings={updateSettings} />
          
          <motion.div variants={item} className="bg-primary/5 rounded-2xl border border-primary/10 p-4 text-xs text-muted-foreground leading-relaxed">
            <strong>Tip:</strong> Header Size affects the title and main filters, while Content Size affects the receipt list density.
          </motion.div>
        </div>
      </div>

      {/* Right Column: Live Preview */}
      <motion.div
        variants={item}
        className="lg:col-span-2 space-y-6"
      >
        <div className="border-border/60 bg-card/30 rounded-3xl border p-10 shadow-xl backdrop-blur-sm relative overflow-hidden min-h-[600px]">
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
    </motion.div>
  );
}
