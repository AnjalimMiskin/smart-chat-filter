import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'primary' | 'success' | 'warning' | 'destructive';
  className?: string;
  delay?: number;
}

const colorClasses = {
  primary: {
    icon: 'text-primary bg-primary/10',
    value: 'text-primary',
  },
  success: {
    icon: 'text-success bg-success/10',
    value: 'text-success',
  },
  warning: {
    icon: 'text-warning bg-warning/10',
    value: 'text-warning',
  },
  destructive: {
    icon: 'text-destructive bg-destructive/10',
    value: 'text-destructive',
  },
};

export function StatsCard({
  icon: Icon,
  label,
  value,
  subValue,
  color = 'primary',
  className,
  delay = 0,
}: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <div 
      className={cn(
        "rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:border-primary/50 hover:glow opacity-0 animate-fade-in",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className={cn("p-2 rounded-lg", colors.icon)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className={cn("text-3xl font-bold font-mono mt-1", colors.value)}>
          {value}
        </p>
        {subValue && (
          <p className="text-xs text-muted-foreground mt-1 font-mono">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
}
