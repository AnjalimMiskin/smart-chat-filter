import { Shield, Github, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Shield className="w-8 h-8 text-primary" />
            <div className="absolute inset-0 w-8 h-8 bg-primary/30 blur-lg rounded-full" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">
              DFA<span className="text-primary">Filter</span>
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Theory of Computation
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2 font-mono text-xs">
            <Mail className="w-4 h-4" />
            Gmail
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5" />
            </a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
