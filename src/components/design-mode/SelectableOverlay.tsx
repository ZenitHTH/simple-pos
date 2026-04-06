"use client";

import { useMockup } from "../../context/MockupContext";
import { cn } from "@/lib";

interface SelectableOverlayProps {
  id: string;
  className?: string; // Additional classes if needed
}

export default function SelectableOverlay({
  id,
  className = "",
}: SelectableOverlayProps) {
  const { isMockupMode, selectedElementId, selectElement } = useMockup();

  if (!isMockupMode) return null;

  const isSelected = selectedElementId === id;

  return (
    <div
      className={cn(
        "pointer-events-auto absolute inset-0 z-10 cursor-pointer rounded-xl transition-all duration-200",
        isSelected
          ? "border-4 border-primary bg-primary/10"
          : "border-2 border-transparent hover:border-primary/50 hover:bg-primary/5",
        className,
      )}
      onClick={(e) => {
        // Prevent click from triggering underlying elements
        e.preventDefault();
        e.stopPropagation();
        selectElement(isSelected ? null : id);
      }}
      title={id} // Show ID on hover tooltip
    />
  );
}
