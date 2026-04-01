import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  trend?: "up" | "down" | "stable";
  color?: "primary" | "secondary" | "accent" | "destructive";
}

const StatsCard = ({
  title,
  value,
  icon: Icon,
  change,
  trend = "stable",
  color = "primary",
}: StatsCardProps) => {
  const trendColor =
    trend === "up"
      ? "text-green-400"
      : trend === "down"
        ? "text-red-400"
        : "text-blue-400";

  const colorClass =
    color === "secondary"
      ? "text-cyan-400"
      : color === "accent"
        ? "text-purple-400"
        : color === "destructive"
          ? "text-red-400"
          : "text-primary";

  return (
    <div className="glass-card p-6 hover:bg-white/15 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/70 text-sm mb-2">{title}</p>
          <p className="text-3xl font-bold text-primary-foreground">{value}</p>
          {change && (
            <p className={`text-xs mt-2 ${trendColor}`}>{change}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-white/10 ${colorClass}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
