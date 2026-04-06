"use client";

import { ReactNode } from "react";
import { ReactLenis } from "lenis/react";

interface ScrollableContainerProps {
  children: ReactNode;
  className?: string;
}

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
