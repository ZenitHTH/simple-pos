"use client";

import React, { useEffect, useState } from "react";
import { useSettings } from "@/context/settings/SettingsContext";
import Sidebar from "./Sidebar";
import BottomControlPanel from "@/components/design-mode/BottomControlPanel";
import GoBackButton from "@/components/ui/GoBackButton";
import MiniTuner from "@/components/design-mode/MiniTuner";

import { useMotionValue, animate, motion, useMotionTemplate } from "framer-motion";
import { useRouter } from "next/navigation";

/**
 * AppShell handles the core layout and scaling isolation.
 * It wraps the main content and sidebar in a zoomed container
 * while keeping the BottomControlPanel and GoBackButton at a 1:1 scale.
 */
/**
 * AppShell Component
 * 
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const { settings, undo, redo } = useSettings();
  const router = useRouter();

  // Expose router for E2E testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).router = router;
    }
  }, [router]);

  // Keyboard Shortcuts for Undo/Redo
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

  const targetScale = (settings.scaling.display_scale || 100) / 100;
  
  // Use a motion value to animate the scale (Animated Scaling)
  const scaleMV = useMotionValue(targetScale);

  // Sync motion value with settings changes
  useEffect(() => {
    const isLinux = typeof document !== 'undefined' && document.documentElement.getAttribute('data-engine') === 'webkitgtk';
    
    const controls = animate(scaleMV, targetScale, {
      type: isLinux ? "tween" : "spring",
      ease: "easeInOut",
      duration: isLinux ? 0.2 : 0.4,
      stiffness: 300,
      damping: 30,
      mass: 1
    } as any);
    return () => controls.stop();
  }, [targetScale, scaleMV]);

  const transformTemplate = useMotionTemplate`scale(${scaleMV})`;
  const staticWidth = `calc(100vw / ${targetScale})`;
  const staticHeight = `calc(100vh / ${targetScale})`;

  return (
    <div className="bg-background text-foreground relative flex h-screen w-full flex-col overflow-hidden antialiased">
      {/* 
        This container handles the global display scaling.
        Using a motion.div prevents React from re-rendering the entire app 
        tree 60 times a second during scale animations.
      */}
      <motion.div 
        className="relative flex overflow-hidden shrink-0" 
        style={{ 
          transform: transformTemplate,
          transformOrigin: 'top left',
          width: staticWidth,
          height: staticHeight,
        }}
      >
        <Sidebar />
        <main className="relative flex flex-1 flex-col overflow-hidden pt-16 lg:pt-0">
          {children}
        </main>
      </motion.div>

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
