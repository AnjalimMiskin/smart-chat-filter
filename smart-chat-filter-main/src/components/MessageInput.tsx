import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSubmit: (message: string) => void;
  isProcessing?: boolean;
  className?: string;
}

export function MessageInput({ onSubmit, isProcessing, className }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim() && !isProcessing) {
      onSubmit(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative rounded-lg border border-border bg-card overflow-hidden transition-all duration-300 focus-within:border-primary focus-within:glow">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a message to analyze..."
          className="min-h-[100px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm"
          disabled={isProcessing}
        />
        <div className="flex items-center justify-between p-3 border-t border-border/50">
          <div className="flex gap-2 text-xs text-muted-foreground font-mono">
            <span className="px-2 py-1 rounded bg-secondary">Shift + Enter</span>
            <span>for new line</span>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || isProcessing}
            className="gap-2"
            size="sm"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Analyze
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Scanning animation */}
      {isProcessing && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-scan" />
        </div>
      )}
    </div>
  );
}
