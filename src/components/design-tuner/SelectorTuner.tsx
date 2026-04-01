"use client";

import { useState } from "react";
import { Select } from "@/components/ui/Select";

export function SelectorTuner() {
  const [val, setVal] = useState<string | number>("");
  const options = [
    { value: "1", label: "Vanilla Latte" },
    { value: "2", label: "Caramel Macchiato" },
    { value: "3", label: "Dark Chocolate Mocha" },
    { value: "4", label: "Iced Green Tea" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-12 duration-500">
      <div>
        <h2 className="mb-2 text-3xl font-bold">Selector</h2>
        <p className="text-muted-foreground">
          The Select component provides a sleek dropdown interface for choosing from multiple options.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interactive Preview */}
        <div className="border-border bg-card flex flex-col rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-8 space-y-6">
            <header>
              <h3 className="text-lg font-bold">Interactive Preview</h3>
              <p className="text-muted-foreground text-sm">Test the dropdown behavior and styling.</p>
            </header>
            
            <Select
              label="Product Category"
              options={options}
              value={val}
              onChange={setVal}
              placeholder="Select a category..."
            />

            <div className="bg-muted/30 flex items-center justify-between rounded-xl p-4 text-sm border border-border/50">
              <span className="text-muted-foreground font-medium">Selected Value</span>
              <code className="bg-background text-primary rounded-lg border border-primary/20 px-3 py-1 font-mono font-bold">
                {val || "(null)"}
              </code>
            </div>
          </div>
          
          <div className="bg-muted/10 border-t border-border p-4">
             <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest font-bold">
               Standard usage with label
             </p>
          </div>
        </div>

        {/* States Showcase */}
        <div className="space-y-8">
          <div className="border-border bg-card rounded-2xl border p-8 shadow-sm">
             <h3 className="mb-6 text-lg font-bold">Static States</h3>
             <div className="space-y-6">
                <div>
                  <label className="text-muted-foreground mb-1.5 block text-[10px] font-bold uppercase tracking-wider">
                    Without Label
                  </label>
                  <Select
                    options={options}
                    value="1"
                    onChange={() => {}}
                    placeholder="Minimal version"
                  />
                </div>

                <div className="opacity-60 pointer-events-none">
                  <label className="text-muted-foreground mb-1.5 block text-[10px] font-bold uppercase tracking-wider">
                    Disabled State
                  </label>
                  <Select
                    options={options}
                    value=""
                    onChange={() => {}}
                    placeholder="Locked Selection"
                  />
                </div>
             </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
             <h4 className="text-primary text-sm font-bold mb-2 flex items-center gap-2">
               Design Tip
             </h4>
             <p className="text-xs text-muted-foreground leading-relaxed">
               The Select component uses <strong>SQLCipher</strong> safely under the hood when fetching real data. 
               Visually, it respects the <code>--radius</code> and <code>--primary</code> CSS variables tuned in the sidebar.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
