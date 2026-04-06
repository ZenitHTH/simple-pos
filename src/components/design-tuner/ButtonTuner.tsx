"use client";

import { Button } from "@/components/ui/Button";
import { FaPalette, FaPlus, FaTrash, FaCheck, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export function ButtonTuner() {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      <motion.div variants={item}>
        <h2 className="mb-2 text-3xl font-bold tracking-tight">Buttons</h2>
        <p className="text-muted-foreground text-lg">
          Explore and preview the button system including variants, sizes, and states.
        </p>
      </motion.div>

      <div className="grid gap-8">
        {/* Basic Variants */}
        <motion.section 
          variants={item}
          className="border-border/60 bg-card/50 space-y-8 rounded-3xl border p-10 shadow-sm backdrop-blur-sm"
        >
          <header>
            <h3 className="text-xl font-bold">Variants</h3>
            <p className="text-muted-foreground">Different visual styles for various contexts.</p>
          </header>
          
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex flex-col gap-3 items-center group">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="default">Primary</Button>
              </motion.div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Default</span>
            </div>
            <div className="flex flex-col gap-3 items-center group">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="secondary">Secondary</Button>
              </motion.div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Secondary</span>
            </div>
            <div className="flex flex-col gap-3 items-center group">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline">Outline</Button>
              </motion.div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Outline</span>
            </div>
            <div className="flex flex-col gap-3 items-center group">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost">Ghost</Button>
              </motion.div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Ghost</span>
            </div>
            <div className="flex flex-col gap-3 items-center group">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="destructive">Destructive</Button>
              </motion.div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Destructive</span>
            </div>
          </div>
        </motion.section>

        {/* Sizes */}
        <motion.section 
          variants={item}
          className="border-border/60 bg-card/50 space-y-8 rounded-3xl border p-10 shadow-sm backdrop-blur-sm"
        >
          <header>
            <h3 className="text-xl font-bold">Sizes</h3>
            <p className="text-muted-foreground">Scaled versions of buttons for different layouts.</p>
          </header>
          
          <div className="flex flex-wrap items-end gap-8">
            <div className="flex flex-col gap-3 items-center group">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm">Small</Button>
              </motion.div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">sm</span>
            </div>
            <div className="flex flex-col gap-3 items-center group">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="default">Default Size</Button>
              </motion.div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">default</span>
            </div>
            <div className="flex flex-col gap-3 items-center group">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg">Large Scale</Button>
              </motion.div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">lg</span>
            </div>
            <div className="flex flex-col gap-3 items-center group">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="icon" aria-label="Icon">
                  <FaPalette className="text-sm" />
                </Button>
              </motion.div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">icon</span>
            </div>
          </div>
        </motion.section>

        {/* Combinations & States */}
        <motion.section 
          variants={item}
          className="border-border/60 bg-card/50 space-y-8 rounded-3xl border p-10 shadow-sm backdrop-blur-sm"
        >
          <header>
            <h3 className="text-xl font-bold">States & Icons</h3>
            <p className="text-muted-foreground">Buttons with icons and interactive states.</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="space-y-6">
               <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">With Icons</h4>
               <div className="flex flex-col gap-4">
                  <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full justify-between h-12">
                      Continue <FaArrowRight className="text-xs" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="secondary" className="w-full gap-3 h-12">
                      <FaPlus className="text-xs" /> Add Item
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="w-full gap-3 h-12">
                      <FaCheck className="text-success text-xs" /> Completed
                    </Button>
                  </motion.div>
               </div>
            </div>

            <div className="space-y-6">
               <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">States</h4>
               <div className="flex flex-col gap-4">
                  <Button disabled className="w-full h-12">Disabled Button</Button>
                  <Button variant="outline" disabled className="w-full h-12">Disabled Outline</Button>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="destructive" className="w-full gap-3 h-12">
                      <FaTrash className="text-xs" /> Delete Order
                    </Button>
                  </motion.div>
               </div>
            </div>

            <div className="space-y-6">
               <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Icon Groups</h4>
               <div className="flex flex-wrap gap-3">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                    <Button size="icon" variant="outline" className="rounded-full shadow-sm"><FaPlus /></Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }}>
                    <Button size="icon" variant="outline" className="rounded-full shadow-sm"><FaCheck /></Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1, rotate: 10 }} whileTap={{ scale: 0.9 }}>
                    <Button size="icon" variant="destructive" className="rounded-full shadow-sm"><FaTrash /></Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1, rotate: -10 }} whileTap={{ scale: 0.9 }}>
                    <Button size="icon" variant="secondary" className="rounded-full shadow-sm"><FaPalette /></Button>
                  </motion.div>
               </div>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
