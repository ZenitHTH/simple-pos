"use client";

import { ReactLenis } from "lenis/react";

interface SmoothScrollProps {
  children: React.ReactNode;
  className?: string;
}

export default function SmoothScroll({
  children,
  className = "",
}: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.15,
        duration: 0.8,
        smoothWheel: true,
        wheelMultiplier: 1.2,
        autoRaf: true,
        prevent: (node: HTMLElement) =>
          node.closest("[data-lenis-prevent]") !== null,
      }}
    >
      {children}
    </ReactLenis>
  );
}
