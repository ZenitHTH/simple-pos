"use client";

import React, {
  ReactNode,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { cn } from "@/lib";

interface PaneProps {
  header: ReactNode;
  children: ReactNode;
  className?: string;
  onDrop?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  isActive?: boolean;
  width?: string;
}

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

interface DualColumnBuilderProps {
  leftPane: {
    header: ReactNode;
    content: ReactNode;
    className?: string;
  };
  rightPane: {
    header: ReactNode;
    content: ReactNode;
    className?: string;
    onDrop?: (e: React.DragEvent) => void;
    onDragOver?: (e: React.DragEvent) => void;
    isActive?: boolean;
  };
  className?: string;
  height?: string;
  defaultSplit?: number; // 0–100, default 50
  split?: number; // controlled override from DualColumnTuner
  onSplitChange?: (v: number) => void; // controlled callback
}

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
