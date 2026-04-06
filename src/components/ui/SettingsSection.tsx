import { ReactNode } from "react";
import { IconType } from "react-icons";
import { cn } from "@/lib";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

interface SettingsSectionProps {
  title: string;
  icon?: IconType;
  children: ReactNode;
  className?: string;
}

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
