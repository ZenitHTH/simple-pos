"use client";

import React, { useEffect } from "react";
import { useMockup } from "@/context/MockupContext";
import POSClient from "@/components/pos/POSClient";
import Sidebar from "@/components/layout/Sidebar";
import BottomControlPanel from "./BottomControlPanel";
import { FaSave, FaArrowRight } from "react-icons/fa";
import { exampleProducts } from "@/lib";

interface DesignModeWrapperProps {
  onNext: () => void;
}

export default function DesignModeWrapper({ onNext }: DesignModeWrapperProps) {
  const { isMockupMode, toggleMockupMode } = useMockup();

  useEffect(() => {
    if (!isMockupMode) {
      toggleMockupMode();
    }
  }, [isMockupMode, toggleMockupMode]);

  return (
    <div className="bg-background relative flex min-h-screen w-full flex-row overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* The POS Interface in Mockup Mode */}
        <div className="relative z-0 flex-1 overflow-hidden">
          <POSClient initialProducts={exampleProducts} />
        </div>

        {/* Floating Action Button for Next Step */}
        <div className="animate-bounce-subtle fixed right-8 bottom-32 z-50">
          <button
            onClick={onNext}
            className="bg-success text-success-foreground shadow-success/30 flex transform items-center gap-3 rounded-full px-8 py-4 text-lg font-bold shadow-2xl transition-all hover:scale-105 hover:bg-success/90"
          >
            <FaSave />
            Save & Continue
            <FaArrowRight />
          </button>
        </div>

        {/* Design Controls */}
        <div className="pointer-events-none fixed right-0 bottom-0 left-0 z-40">
          <div className="pointer-events-auto">
            <BottomControlPanel hideSaveButton={true} forceVisible={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
