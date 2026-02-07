"use client";

import { useMockup } from "../../context/MockupContext";

interface SelectableOverlayProps {
    id: string;
    className?: string;     // Additional classes if needed
}

export default function SelectableOverlay({ id, className = "" }: SelectableOverlayProps) {
    const { isMockupMode, selectedElementId, selectElement } = useMockup();

    if (!isMockupMode) return null;

    const isSelected = selectedElementId === id;

    return (
        <div
            className={`absolute inset-0 z-50 cursor-pointer transition-all duration-200 pointer-events-auto
                ${isSelected
                    ? 'border-4 border-blue-500 bg-blue-500/10'
                    : 'border-2 border-transparent hover:border-blue-300 hover:bg-blue-500/5'
                }
                ${className}
            `}
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
