"use client";

import { ReactNode } from "react";

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
 * A wrapper component that provides high-performance scrolling.
 * Uses native scrolling with data-lenis-prevent to avoid nested scroll lag
 * while maintaining the root smooth scroll feel.
 *
 * @param props - The scrollable container props.
 * @returns A scrollable container element.
 */
export default function ScrollableContainer({
  children,
  className = "",
}: ScrollableContainerProps) {
  return (
    <div
      className={`custom-scrollbar h-full w-full overflow-x-hidden overflow-y-auto ${className}`}
      data-lenis-prevent
    >
      {children}
    </div>
  );
}
