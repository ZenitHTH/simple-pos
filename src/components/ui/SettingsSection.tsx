import { ReactNode } from "react";
import { IconType } from "react-icons";
import { cn } from "@/lib";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

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
    <Card className={cn("mb-8 shadow-sm", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          {Icon && <Icon className="text-primary" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
