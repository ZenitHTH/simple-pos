"use client";

import React, { useEffect } from "react";
import { useSettings } from "@/context/settings/SettingsContext";
import Sidebar from "./Sidebar";
import BottomControlPanel from "@/components/design-mode/BottomControlPanel";
import GoBackButton from "@/components/ui/GoBackButton";
import MiniTuner from "@/components/design-mode/MiniTuner";

/**
 * AppShell handles the core layout and scaling isolation.
 * It wraps the main content and sidebar in a zoomed container
 * while keeping the BottomControlPanel and GoBackButton at a 1:1 scale.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const { settings, undo, redo } = useSettings();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  const scale = (settings.scaling.display_scale || 100) / 100;

  return (
    <div className="bg-background text-foreground relative flex h-screen w-full flex-col overflow-hidden antialiased">
      {/* 
        This container handles the global display scaling.
        Using 'zoom' ensures that all 'rem' units (spacing, sizes, fonts) 
        within the app UI are scaled correctly without affecting 
        the fixed control panels outside this container.
      */}
      <div 
        className="relative flex flex-1 overflow-hidden" 
        style={{ zoom: scale } as React.CSSProperties}
      >
        <Sidebar />
        <main className="relative flex flex-1 flex-col overflow-hidden pt-16 lg:pt-0">
          {children}
        </main>
      </div>

      {/* 
        These elements stay outside the zoomed container to maintain 
        a constant 100% scale, preventing blurriness and layout jumping.
      */}
      <BottomControlPanel />
      <GoBackButton />
      <MiniTuner />
    </div>
  );
}
