import { Classification, ClassificationResult } from '@/lib/dfa';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, XCircle, Shield, Clock } from 'lucide-react';

interface HistoryItemProps {
  message: string;
  result: ClassificationResult;
  timestamp: Date;
  index: number;
}

const iconMap: Record<Classification, typeof CheckCircle> = {
  safe: CheckCircle,
  spam: AlertTriangle,
  offensive: XCircle,
  suspicious: Shield,
};

const colorMap: Record<Classification, string> = {
  safe: 'text-success',
  spam: 'text-warning',
  offensive: 'text-destructive',
  suspicious: 'text-primary',
};

export function HistoryItem({ message, result, timestamp, index }: HistoryItemProps) {
  const Icon = iconMap[result.classification];
  const color = colorMap[result.classification];

  return (
    <div 
      className="rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:border-primary/30 opacity-0 animate-slide-in-right"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className={cn("mt-1", color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground line-clamp-2 font-mono">
            {message}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className={cn("text-xs font-medium uppercase", color)}>
              {result.classification}
            </span>
            <span className="text-xs text-muted-foreground">
              {Math.round(result.confidence * 100)}% confidence
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timestamp.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
