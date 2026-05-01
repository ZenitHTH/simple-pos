import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib";

interface ThemeCardProps {
  name: string;
  color: string;
  description: string;
  active: boolean;
  onClick: () => void;
}

/**
 * ThemeCard Component
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
export const ThemeCard = memo(function ThemeCard({
  name,
  color,
  description,
  active,
  onClick,
}: ThemeCardProps) {
  return (
    <motion.button
      type="button"
      aria-pressed={active}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group focus-visible:ring-primary relative flex flex-col overflow-hidden rounded-2xl border text-left transition-all focus-visible:ring-2 focus-visible:outline-none",
        active
          ? "border-primary ring-primary/20 bg-primary/5 ring-2"
          : "border-border bg-card hover:border-border/80",
      )}
    >
      {/* Visual Preview Area */}
      <div
        className="relative h-32 w-full overflow-hidden p-4"
        style={{ backgroundColor: color }}
      >
        {/* Mock POS Elements */}
        <div className="absolute top-4 left-4 h-20 w-8 rounded-md bg-white/20 backdrop-blur-sm" />{" "}
        {/* Sidebar */}
        <div className="absolute top-4 right-4 left-14 h-12 rounded-lg bg-white/30 shadow-sm backdrop-blur-sm" />{" "}
        {/* Card */}
        <div className="absolute right-4 bottom-4 h-6 w-12 rounded-full bg-white/40 backdrop-blur-sm" />{" "}
        {/* Button */}
      </div>

      <div className="p-4">
        <h4 className="text-sm font-bold">{name}</h4>
        <p className="text-muted-foreground mt-1 text-xs font-semibold tracking-wider uppercase">
          {description}
        </p>
      </div>
    </motion.button>
  );
});
