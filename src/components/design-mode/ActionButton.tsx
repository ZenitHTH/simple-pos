"use client";

export default function ActionButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 rounded-full px-6 py-2 font-medium shadow-md transition-all active:scale-95"
    >
      {label}
    </button>
  );
}
