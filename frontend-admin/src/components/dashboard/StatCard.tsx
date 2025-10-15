import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  loading?: boolean;
}

const StatCard = ({ title, value, icon: Icon, trend, className, loading }: StatCardProps) => {
  return (
    <Card className={cn("transition-smooth hover:shadow-soft-lg", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {loading ? (
                <div className="h-8 bg-muted animate-pulse rounded"></div>
              ) : (
                value
              )}
            </p>
            {trend && !loading && (
              <p className={cn(
                "mt-2 text-sm font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.isPositive ? "↑" : "↓"} {trend.value}
              </p>
            )}
          </div>
          <div className="rounded-xl bg-accent/10 p-3">
            <Icon className="h-6 w-6 text-accent" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
