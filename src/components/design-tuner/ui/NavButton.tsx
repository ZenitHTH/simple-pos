import React from "react";

/**
 * NavButton Component
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
export function NavButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-200 active:scale-[0.98] ${
        active
          ? "bg-primary text-primary-foreground shadow-primary/20 font-bold shadow-lg"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground font-medium"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}
