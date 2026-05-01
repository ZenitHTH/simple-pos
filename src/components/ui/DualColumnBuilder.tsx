"use client";

import React, {
  ReactNode,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { cn } from "@/lib";

/**
 * Props for the individual panes within the DualColumnBuilder.
 * @interface PaneProps
 */
interface PaneProps {
  /** Header content for the pane. */
  header: ReactNode;
  /** Main content for the pane. */
  children: ReactNode;
  /** Optional CSS class for the pane container. */
  className?: string;
  /** Optional drop event handler for drag-and-drop. */
  onDrop?: (e: React.DragEvent) => void;
  /** Optional drag over event handler for drag-and-drop. */
  onDragOver?: (e: React.DragEvent) => void;
  /** Whether the pane is currently active or highlighted. */
  isActive?: boolean;
  /** Explicit width for the pane. */
  width?: string;
}

/**
 * Internal Pane component used by DualColumnBuilder.
 */
function Pane({
  header,
  children,
  className,
  onDrop,
  onDragOver,
  isActive,
  width,
}: PaneProps) {
  return (
    <div
      className={cn(
        "bg-card border-border flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-colors",
        isActive ? "border-primary/20" : "",
        className,
      )}
      style={
        width ? { width, flexShrink: 0, flexGrow: 0 } : { flex: 1, minWidth: 0 }
      }
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className="border-border shrink-0 space-y-3 border-b p-4">
        {header}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4 lg:p-5">
        {children}
      </div>
    </div>
  );
}

/**
 * Configuration for a pane in the DualColumnBuilder.
 */
interface PaneConfig {
  /** Header content for the pane. */
  header: ReactNode;
  /** Main content for the pane. */
  content: ReactNode;
  /** Optional CSS class for the pane container. */
  className?: string;
  /** Optional drop event handler for drag-and-drop. */
  onDrop?: (e: React.DragEvent) => void;
  /** Optional drag over event handler for drag-and-drop. */
  onDragOver?: (e: React.DragEvent) => void;
  /** Whether the pane is currently active or highlighted. */
  isActive?: boolean;
}

/**
 * Props for the DualColumnBuilder component.
 */
interface DualColumnBuilderProps {
  /** Configuration for the left pane. */
  leftPane: PaneConfig;
  /** Configuration for the right pane. */
  rightPane: PaneConfig;
  /** Optional CSS class for the container. */
  className?: string;
  /** Height of the component (default: "800px"). */
  height?: string;
  /** Initial split percentage (0-100, default: 50). */
  defaultSplit?: number;
  /** Controlled split percentage. */
  split?: number;
  /** Callback triggered when the split percentage changes. */
  onSplitChange?: (v: number) => void;
}

/**
 * A resizable two-column layout component.
 * Allows users to drag a handle to adjust the width of the left and right panes.
 *
 * @param {DualColumnBuilderProps} props - The component props.
 */
export function DualColumnBuilder({
  leftPane,
  rightPane,
  className,
  height = "800px",
  defaultSplit = 50,
  split: controlledSplit,
  onSplitChange: onControlledSplitChange,
}: DualColumnBuilderProps) {
  const [internalSplit, setInternalSplit] = useState(defaultSplit);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Use controlled split if provided, otherwise internal
  const splitPct =
    controlledSplit !== undefined ? controlledSplit : internalSplit;
  const setSplitPct = (v: number) => {
    setInternalSplit(v);
    onControlledSplitChange?.(v);
  };

  const MIN_PCT = 20;
  const MAX_PCT = 80;

  const clamp = (v: number) => Math.min(MAX_PCT, Math.max(MIN_PCT, v));

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const raw = ((e.clientX - rect.left) / rect.width) * 100;
        setSplitPct(clamp(raw));
      });
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const leftWidth = `${splitPct}%`;
  const rightWidth = `${100 - splitPct}%`;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex gap-0 select-none",
        isDragging ? "cursor-col-resize" : "",
        className,
      )}
      style={{ height }}
    >
      {/* Left Pane */}
      <Pane
        header={leftPane.header}
        className={leftPane.className}
        width={leftWidth}
      >
        {leftPane.content}
      </Pane>

      {/* Drag Handle */}
      <div
        className="group relative z-10 flex w-5 shrink-0 cursor-col-resize items-center justify-center"
        onMouseDown={handleMouseDown}
        title="Drag to resize"
      >
        {/* Track line */}
        <div
          className={cn(
            "h-full w-px transition-colors duration-150",
            isDragging
              ? "bg-primary w-0.5"
              : "bg-border group-hover:bg-primary/60",
          )}
        />
        {/* Centre grip dots */}
        <div
          className={cn(
            "absolute flex flex-col gap-1 rounded-full px-1.5 py-2 transition-all duration-150",
            isDragging
              ? "bg-primary/20 scale-110"
              : "bg-muted group-hover:bg-primary/10",
          )}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "h-1 w-1 rounded-full transition-colors duration-150",
                isDragging
                  ? "bg-primary"
                  : "bg-muted-foreground/50 group-hover:bg-primary/70",
              )}
            />
          ))}
        </div>
      </div>

      {/* Right Pane */}
      <Pane
        header={rightPane.header}
        className={rightPane.className}
        onDrop={rightPane.onDrop}
        onDragOver={rightPane.onDragOver}
        isActive={rightPane.isActive}
        width={rightWidth}
      >
        {rightPane.content}
      </Pane>
    </div>
  );
}
