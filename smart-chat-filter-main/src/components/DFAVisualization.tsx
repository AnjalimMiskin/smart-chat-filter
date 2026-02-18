import { useEffect, useRef, useState } from 'react';
import { DFA, DFAState } from '@/lib/dfa';
import { cn } from '@/lib/utils';

interface DFAVisualizationProps {
  dfa: DFA;
  currentState?: string;
  highlightedTransitions?: string[];
  className?: string;
}

const statePositions: Record<string, { x: number; y: number }> = {
  'q0': { x: 100, y: 150 },
  'q1': { x: 220, y: 80 },
  'q2': { x: 340, y: 80 },
  'q3': { x: 460, y: 80 },
  'q4': { x: 580, y: 80 },
  'q5': { x: 220, y: 220 },
  'q6': { x: 340, y: 220 },
  'q7': { x: 460, y: 220 },
  'q8': { x: 580, y: 220 },
};

export function DFAVisualization({ 
  dfa, 
  currentState, 
  highlightedTransitions = [],
  className 
}: DFAVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [animatingState, setAnimatingState] = useState<string | null>(null);

  useEffect(() => {
    if (currentState) {
      setAnimatingState(currentState);
      const timer = setTimeout(() => setAnimatingState(null), 500);
      return () => clearTimeout(timer);
    }
  }, [currentState]);

  const getStateColor = (state: DFAState) => {
    if (state.id === currentState) {
      if (state.isAccepting) return 'hsl(0, 72%, 51%)'; // destructive
      return 'hsl(180, 70%, 50%)'; // primary
    }
    if (state.type === 'start') return 'hsl(180, 60%, 40%)';
    if (state.isAccepting) return 'hsl(0, 72%, 35%)';
    return 'hsl(222, 30%, 20%)';
  };

  const getPosition = (stateId: string) => {
    return statePositions[stateId] || { x: 100, y: 100 };
  };

  return (
    <div className={cn("relative rounded-lg overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      <svg
        ref={svgRef}
        viewBox="0 0 700 300"
        className="w-full h-full"
        style={{ minHeight: '300px' }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="hsl(180, 70%, 50%)"
            />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Transitions */}
        {dfa.transitions.map((transition, index) => {
          const fromPos = getPosition(transition.from);
          const toPos = getPosition(transition.to);
          const dx = toPos.x - fromPos.x;
          const dy = toPos.y - fromPos.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const unitX = dx / len;
          const unitY = dy / len;
          
          const startX = fromPos.x + unitX * 30;
          const startY = fromPos.y + unitY * 30;
          const endX = toPos.x - unitX * 35;
          const endY = toPos.y - unitY * 35;

          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2 - 10;

          const isHighlighted = highlightedTransitions.includes(`${transition.from}-${transition.to}`);

          return (
            <g key={index}>
              <line
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={isHighlighted ? "hsl(180, 70%, 60%)" : "hsl(222, 30%, 30%)"}
                strokeWidth={isHighlighted ? 3 : 2}
                markerEnd="url(#arrowhead)"
                className="transition-all duration-300"
                filter={isHighlighted ? "url(#glow)" : undefined}
              />
              <rect
                x={midX - 12}
                y={midY - 10}
                width={24}
                height={20}
                fill="hsl(222, 47%, 8%)"
                rx="4"
              />
              <text
                x={midX}
                y={midY + 4}
                textAnchor="middle"
                className="font-mono text-sm fill-primary"
              >
                {transition.symbol}
              </text>
            </g>
          );
        })}

        {/* Start arrow */}
        <line
          x1={40}
          y1={150}
          x2={65}
          y2={150}
          stroke="hsl(180, 70%, 50%)"
          strokeWidth={2}
          markerEnd="url(#arrowhead)"
        />

        {/* States */}
        {dfa.states.map((state) => {
          const pos = getPosition(state.id);
          const isActive = state.id === currentState;
          const isAnimating = state.id === animatingState;

          return (
            <g 
              key={state.id}
              className={cn(
                "transition-transform duration-300",
                isAnimating && "animate-state-transition"
              )}
            >
              {/* Outer circle for accepting states */}
              {state.isAccepting && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={34}
                  fill="none"
                  stroke={isActive ? "hsl(0, 72%, 51%)" : "hsl(0, 72%, 35%)"}
                  strokeWidth={2}
                />
              )}
              
              {/* Main circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={28}
                fill={getStateColor(state)}
                stroke={isActive ? "hsl(180, 70%, 70%)" : "hsl(222, 30%, 30%)"}
                strokeWidth={isActive ? 3 : 2}
                filter={isActive ? "url(#glow)" : undefined}
                className="transition-all duration-300"
              />
              
              {/* State label */}
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                className="font-mono text-sm font-bold"
                fill={isActive || state.type === 'start' ? "hsl(222, 47%, 6%)" : "hsl(210, 40%, 90%)"}
              >
                {state.id}
              </text>

              {/* State name below */}
              <text
                x={pos.x}
                y={pos.y + 50}
                textAnchor="middle"
                className="font-mono text-xs"
                fill="hsl(215, 20%, 55%)"
              >
                {state.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex gap-4 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span>Start</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary border border-muted" />
          <span>Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span>Accepting</span>
        </div>
      </div>
    </div>
  );
}
