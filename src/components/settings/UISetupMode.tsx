"use client";

import React from "react";
import { FaArrowRight, FaDesktop } from "react-icons/fa";
import POSClient from "../pos/POSClient";
import { exampleProducts } from "@/lib";

interface UISetupModeProps {
  onNext: () => void;
}

export default function UISetupMode({ onNext }: UISetupModeProps) {
  return (
    <div className="bg-background relative min-h-screen w-full overflow-hidden">
      {/* Preview Layer - Rendering static POS interface as background */}
      <div className="pointer-events-none absolute inset-0 scale-[0.98] transform opacity-50 blur-[2px] grayscale-[0.3]">
        <POSClient initialProducts={exampleProducts} />
      </div>

      {/* Content Layer */}
      <div className="relative z-50 flex min-h-screen flex-col items-center justify-center p-4">
        <div className="bg-background/90 border-border/50 animate-in fade-in zoom-in max-w-2xl rounded-3xl border p-10 text-center shadow-2xl backdrop-blur-md duration-500">
          <div className="icon-box-md">
            <FaDesktop size={40} />
          </div>
          <h2 className="hero-title">Customize Your Experience</h2>
          <p className="hero-subtitle">
            We will now enter <strong>Design Mode</strong>. You can adjust the
            interface scaling, font sizes, and layout density to perfectly match
            your screen.
          </p>

          <button onClick={onNext} className="btn-primary-lg">
            Enter Design Mode{" "}
            <FaArrowRight className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
