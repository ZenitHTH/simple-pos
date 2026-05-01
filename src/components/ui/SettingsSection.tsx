import { ReactNode } from "react";
import { IconType } from "react-icons";
import { cn } from "@/lib";

/**
 * Props for the SettingsSection component.
 */
interface SettingsSectionProps {
  /** The title of the settings section. */
  title: string;
  /** Optional icon to display next to the title. */
  icon?: IconType;
  /** The settings content to be displayed in the section. */
  children: ReactNode;
  /** Optional additional CSS classes for the container card. */
  className?: string;
}

/**
 * A layout component for grouping related settings together in a Card.
 * Features a title with an optional icon and a clean structure.
 *
 * @param props - The settings section props.
 * @returns A Card-wrapped settings section.
 */
export default function SettingsSection({
  title,
  icon: Icon,
  children,
  className = "",
}: SettingsSectionProps) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground border-border mb-8 overflow-hidden rounded-2xl border p-6 shadow-sm",
        className,
      )}
    >
      <div className="mb-6 flex items-center gap-2">
        {Icon && <Icon className="text-primary text-xl" />}
        <h3 className="text-xl font-bold tracking-tight">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}
