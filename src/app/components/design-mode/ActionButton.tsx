"use client";

export default function ActionButton({ onClick, label }: { onClick: () => void, label: string }) {
    return (
        <button
            onClick={onClick}
            className="shrink-0 px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 font-medium transition-all shadow-md active:scale-95"
        >
            {label}
        </button>
    );
}
