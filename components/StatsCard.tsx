import { LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}

export function StatsCard({ title, value, change, changeType, icon: Icon, iconColor, iconBgColor }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-shadow duration-200 hover:shadow-lg sm:p-5 lg:p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="mb-1 text-sm text-muted-foreground">{title}</p>
          <h3 className="mb-2 text-foreground">{value}</h3>
          {change && (
            <p
              className={cn(
                "text-sm",
                changeType === "positive" && "text-green-600",
                changeType === "negative" && "text-red-600",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", iconBgColor)}>
          <Icon className={cn("size-6", iconColor)} />
        </div>
      </div>
    </div>
  );
}
