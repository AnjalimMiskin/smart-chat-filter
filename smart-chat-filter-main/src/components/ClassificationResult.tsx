import { ClassificationResult as ClassificationResultType, Classification } from '@/lib/dfa';
import { cn } from '@/lib/utils';
import { Shield, AlertTriangle, XCircle, CheckCircle, Tag, TrendingUp } from 'lucide-react';

interface ClassificationResultProps {
  result: ClassificationResultType | null;
  className?: string;
}

const classificationConfig: Record<Classification, {
  icon: typeof Shield;
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}> = {
  safe: {
    icon: CheckCircle,
    label: 'Safe',
    bgClass: 'bg-success/10',
    textClass: 'text-success',
    borderClass: 'border-success/30',
  },
  spam: {
    icon: AlertTriangle,
    label: 'Spam',
    bgClass: 'bg-warning/10',
    textClass: 'text-warning',
    borderClass: 'border-warning/30',
  },
  offensive: {
    icon: XCircle,
    label: 'Offensive',
    bgClass: 'bg-destructive/10',
    textClass: 'text-destructive',
    borderClass: 'border-destructive/30',
  },
  suspicious: {
    icon: Shield,
    label: 'Suspicious',
    bgClass: 'bg-primary/10',
    textClass: 'text-primary',
    borderClass: 'border-primary/30',
  },
};

export function ClassificationResultDisplay({ result, className }: ClassificationResultProps) {
  if (!result) {
    return (
      <div className={cn("rounded-lg border border-border bg-card p-6", className)}>
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <Shield className="w-12 h-12 mb-4 opacity-30" />
          <p className="font-mono text-sm">Enter a message to see classification results</p>
        </div>
      </div>
    );
  }

  const config = classificationConfig[result.classification];
  const Icon = config.icon;
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <div className={cn(
      "rounded-lg border bg-card overflow-hidden animate-fade-in",
      config.borderClass,
      className
    )}>
      {/* Header */}
      <div className={cn("p-4 border-b", config.bgClass, config.borderClass)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", config.bgClass)}>
              <Icon className={cn("w-6 h-6", config.textClass)} />
            </div>
            <div>
              <h3 className={cn("text-xl font-bold", config.textClass)}>
                {config.label}
              </h3>
              <p className="text-sm text-muted-foreground font-mono">
                {result.category}
              </p>
            </div>
          </div>
          
          {/* Confidence meter */}
          <div className="text-right">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className={cn("text-2xl font-bold font-mono", config.textClass)}>
                {confidencePercent}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Confidence</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Matched Patterns */}
        {result.matchedPatterns.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Matched Patterns</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.matchedPatterns.map((pattern, index) => (
                <span
                  key={index}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-mono",
                    config.bgClass,
                    config.textClass
                  )}
                >
                  {pattern}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* State History */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-muted-foreground">DFA State Trace</span>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {result.stateHistory.map((state, index) => (
              <div key={index} className="flex items-center">
                <span className="px-2 py-1 rounded bg-secondary text-xs font-mono text-secondary-foreground">
                  {state}
                </span>
                {index < result.stateHistory.length - 1 && (
                  <span className="text-muted-foreground mx-1">→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Confidence Bar */}
        <div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", 
                result.classification === 'safe' ? 'bg-success' :
                result.classification === 'spam' ? 'bg-warning' :
                result.classification === 'offensive' ? 'bg-destructive' :
                'bg-primary'
              )}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
