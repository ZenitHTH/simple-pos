"use client";

import { Button } from "@/components/ui/Button";
import { FaPalette, FaPlus, FaTrash, FaCheck, FaArrowRight } from "react-icons/fa";

export function ButtonTuner() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-12 duration-500">
      <div>
        <h2 className="mb-2 text-3xl font-bold">Buttons</h2>
        <p className="text-muted-foreground">
          Explore and preview the button system including variants, sizes, and states.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Basic Variants */}
        <section className="border-border bg-card space-y-6 rounded-2xl border p-8 shadow-sm">
          <header>
            <h3 className="text-lg font-bold">Variants</h3>
            <p className="text-muted-foreground text-sm">Different visual styles for various contexts.</p>
          </header>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-2 items-center">
              <Button variant="default">Primary</Button>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Default</span>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <Button variant="secondary">Secondary</Button>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Secondary</span>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <Button variant="outline">Outline</Button>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Outline</span>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <Button variant="ghost">Ghost</Button>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Ghost</span>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <Button variant="destructive">Destructive</Button>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Destructive</span>
            </div>
          </div>
        </section>

        {/* Sizes */}
        <section className="border-border bg-card space-y-6 rounded-2xl border p-8 shadow-sm">
          <header>
            <h3 className="text-lg font-bold">Sizes</h3>
            <p className="text-muted-foreground text-sm">Scaled versions of buttons for different layouts.</p>
          </header>
          
          <div className="flex flex-wrap items-end gap-6">
            <div className="flex flex-col gap-2 items-center">
              <Button size="sm">Small</Button>
              <span className="text-[10px] uppercase font-bold text-muted-foreground text-center">sm</span>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <Button size="default">Default Size</Button>
              <span className="text-[10px] uppercase font-bold text-muted-foreground text-center">default</span>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <Button size="lg">Large Scale</Button>
              <span className="text-[10px] uppercase font-bold text-muted-foreground text-center">lg</span>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <Button size="icon" aria-label="Icon">
                <FaPalette className="text-sm" />
              </Button>
              <span className="text-[10px] uppercase font-bold text-muted-foreground text-center">icon</span>
            </div>
          </div>
        </section>

        {/* Combinations & States */}
        <section className="border-border bg-card space-y-6 rounded-2xl border p-8 shadow-sm">
          <header>
            <h3 className="text-lg font-bold">States & Icons</h3>
            <p className="text-muted-foreground text-sm">Buttons with icons and interactive states.</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
               <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">With Icons</h4>
               <div className="flex flex-col gap-3">
                  <Button className="w-full justify-between">
                    Continue <FaArrowRight className="text-xs" />
                  </Button>
                  <Button variant="secondary" className="w-full gap-3">
                    <FaPlus className="text-xs" /> Add Item
                  </Button>
                  <Button variant="outline" className="w-full gap-3">
                    <FaCheck className="text-success text-xs" /> Completed
                  </Button>
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">States</h4>
               <div className="flex flex-col gap-3">
                  <Button disabled className="w-full">Disabled Button</Button>
                  <Button variant="outline" disabled className="w-full">Disabled Outline</Button>
                  <Button variant="destructive" className="w-full gap-3">
                    <FaTrash className="text-xs" /> Delete Order
                  </Button>
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Icon Groups</h4>
               <div className="flex flex-wrap gap-2">
                  <Button size="icon" variant="outline"><FaPlus /></Button>
                  <Button size="icon" variant="outline"><FaCheck /></Button>
                  <Button size="icon" variant="destructive"><FaTrash /></Button>
                  <Button size="icon" variant="secondary"><FaPalette /></Button>
               </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
