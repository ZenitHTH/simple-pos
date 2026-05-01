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
      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 shrink-0 rounded-full px-8 py-3.5 text-xs font-black tracking-widest uppercase shadow-xl transition-all hover:scale-105 active:scale-95"
    >
      {label}
    </button>
  );
}
