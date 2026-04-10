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
      className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 rounded-full px-8 py-3.5 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
    >
      {label}
    </button>
  );
}
