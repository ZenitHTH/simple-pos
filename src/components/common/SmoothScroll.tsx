"use client";

import { ReactLenis } from "lenis/react";
import { useEffect } from "react";

interface SmoothScrollProps {
  children: React.ReactNode;
  className?: string;
}

export default function SmoothScroll({
  children,
  className = "",
}: SmoothScrollProps) {
  // Disable Lenis on Linux for high-performance native scrolling
  useEffect(() => {
    const isLinux = typeof document !== 'undefined' && document.documentElement.getAttribute('data-engine') === 'webkitgtk';
    if (isLinux) {
      // In native mode, we don't need Lenis
    }
  }, []);

  const isLinux = typeof document !== 'undefined' && document.documentElement.getAttribute('data-engine') === 'webkitgtk';

  if (isLinux) {
    return <div className={className}>{children}</div>;
  }

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
