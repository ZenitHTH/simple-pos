import React, { ReactNode } from "react";
import { cn } from "@/lib";

interface PaneProps {
  header: ReactNode;
  children: ReactNode;
  className?: string;
  onDrop?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  isActive?: boolean;
}

function Pane({
  header,
  children,
  className,
  onDrop,
  onDragOver,
  isActive,
}: PaneProps) {
  return (
    <div
      className={cn(
        "bg-card border-border flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-colors",
        isActive ? "border-primary/20" : "",
        className,
      )}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className="border-border space-y-3 border-b p-4">{header}</div>
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</div>
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
}

export function DualColumnBuilder({
  leftPane,
  rightPane,
  className,
  height = "800px",
}: DualColumnBuilderProps) {
  return (
    <div
      className={cn("grid grid-cols-1 gap-6 md:grid-cols-2", className)}
      style={{ height: height }}
    >
      <Pane header={leftPane.header} className={leftPane.className}>
        {leftPane.content}
      </Pane>

      <Pane
        header={rightPane.header}
        className={rightPane.className}
        onDrop={rightPane.onDrop}
        onDragOver={rightPane.onDragOver}
        isActive={rightPane.isActive}
      >
        {rightPane.content}
      </Pane>
    </div>
  );
}
