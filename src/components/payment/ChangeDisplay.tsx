import { Card, CardContent } from "@/components/ui/Card";
import { memo } from "react";
import { formatCurrency } from "./utils";
import { cn } from "@/lib";

interface ChangeDisplayProps {
  change: number;
  isValid: boolean;
  currency: string;
  className?: string;
}

const ChangeDisplay = memo(
  ({ change, isValid, currency, className }: ChangeDisplayProps) => (
    <Card
      className={cn(
        "h-full shadow-none transition-colors duration-300",
        isValid
          ? "border-success/20 bg-success/10"
          : "bg-muted/5 border-border",
        className,
      )}
    >
      <CardContent className="flex h-full flex-col justify-center p-4">
        <div className="flex items-center justify-between">
          <span className="text-muted font-medium">Change Due</span>
          <span
            className={cn(
              "text-2xl font-bold transition-colors duration-300",
              isValid ? "text-success" : "text-muted",
            )}
          >
            {formatCurrency(Math.max(0, change), currency)}
          </span>
        </div>
      </CardContent>
    </Card>
  ),
);

ChangeDisplay.displayName = "ChangeDisplay";

export default ChangeDisplay;
