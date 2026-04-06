import { Card, CardContent } from "@/components/ui/Card";
import { memo } from "react";
import { formatCurrency } from "./utils";

interface AmountSummaryProps {
  total: number;
  currency: string;
}

const AmountSummary = memo(({ total, currency }: AmountSummaryProps) => (
  <Card className="bg-primary/5 border-primary/10 shadow-none">
    <CardContent className="flex h-full flex-col justify-center space-y-1 p-3 text-center">
      <p className="text-muted text-sm font-semibold tracking-wider uppercase">
        Total Amount
      </p>
      <div className="text-primary text-4xl font-bold">
        {formatCurrency(total, currency)}
      </div>
    </CardContent>
  </Card>
));

AmountSummary.displayName = "AmountSummary";

export default AmountSummary;
