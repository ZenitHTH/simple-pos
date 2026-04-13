"use client";

import { ReactNode } from "react";
import { ReactLenis } from "lenis/react";

/**
 * Props for the ScrollableContainer component.
 */
interface ScrollableContainerProps {
  /** The content to be rendered inside the scrollable container. */
  children: ReactNode;
  /** Optional additional CSS classes for styling. */
  className?: string;
}

/**
 * A wrapper component that provides smooth scrolling and a custom scrollbar.
 * Powered by Lenis for high-performance inertial scrolling.
 * 
 * @param props - The scrollable container props.
 * @returns A scrollable container element with smooth scrolling.
 */
export default function ScrollableContainer({
  children,
  className = "",
}: ScrollableContainerProps) {
  return (
    <ReactLenis
      root={false}
      className={`custom-scrollbar h-full w-full ${className}`}
      options={{
        lerp: 0.1,
        duration: 1.2,
        autoRaf: true,
        prevent: (node: HTMLElement) =>
          node.closest("[data-lenis-prevent]") !== null,
      }}
    >
      {children}
    </ReactLenis>
  );
}
