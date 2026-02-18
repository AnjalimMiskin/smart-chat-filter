import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { DFAVisualization } from '@/components/DFAVisualization';
import { MessageInput } from '@/components/MessageInput';
import { ClassificationResultDisplay } from '@/components/ClassificationResult';
import { StatsCard } from '@/components/StatsCard';
import { HistoryItem } from '@/components/HistoryItem';
import { classifyMessage, getSampleDFA, ClassificationResult, Classification } from '@/lib/dfa';
import { Shield, CheckCircle, AlertTriangle, XCircle, Activity, Clock } from 'lucide-react';

interface HistoryEntry {
  message: string;
  result: ClassificationResult;
  timestamp: Date;
}

const Index = () => {
  const [currentResult, setCurrentResult] = useState<ClassificationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentState, setCurrentState] = useState<string | undefined>();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    safe: 0,
    spam: 0,
    offensive: 0,
    suspicious: 0,
  });

  const dfa = getSampleDFA();

  const handleAnalyze = useCallback(async (message: string) => {
    setIsProcessing(true);
    setCurrentResult(null);

    // Simulate DFA state transitions for visualization
    const stateSequence = ['q0'];
    for (let i = 0; i < Math.min(message.length, 4); i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const nextState = `q${(i % 4) + 1}`;
      stateSequence.push(nextState);
      setCurrentState(nextState);
    }

    // Run actual classification
    await new Promise(resolve => setTimeout(resolve, 300));
    const result = classifyMessage(message);
    
    setCurrentResult(result);
    setCurrentState(undefined);
    setIsProcessing(false);

    // Update history
    setHistory(prev => [{
      message,
      result,
      timestamp: new Date()
    }, ...prev].slice(0, 10));

    // Update stats
    setStats(prev => ({
      total: prev.total + 1,
      safe: prev.safe + (result.classification === 'safe' ? 1 : 0),
      spam: prev.spam + (result.classification === 'spam' ? 1 : 0),
      offensive: prev.offensive + (result.classification === 'offensive' ? 1 : 0),
      suspicious: prev.suspicious + (result.classification === 'suspicious' ? 1 : 0),
    }));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-mono mb-6">
            <Activity className="w-4 h-4" />
            DFA-Powered Classification
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Chat Filter using <span className="text-gradient">DFA</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Leveraging Deterministic Finite Automata from Theory of Computation 
            for real-time message classification and spam detection.
          </p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatsCard
            icon={Activity}
            label="Total Analyzed"
            value={stats.total}
            color="primary"
            delay={0}
          />
          <StatsCard
            icon={CheckCircle}
            label="Safe"
            value={stats.safe}
            color="success"
            delay={100}
          />
          <StatsCard
            icon={AlertTriangle}
            label="Spam"
            value={stats.spam}
            color="warning"
            delay={200}
          />
          <StatsCard
            icon={XCircle}
            label="Offensive"
            value={stats.offensive}
            color="destructive"
            delay={300}
          />
          <StatsCard
            icon={Shield}
            label="Suspicious"
            value={stats.suspicious}
            color="primary"
            delay={400}
          />
        </section>

        {/* DFA Visualization */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold">DFA State Diagram</h2>
            <span className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground font-mono">
              Pattern: SPAM | HATE
            </span>
          </div>
          <div className="rounded-lg border border-border bg-card">
            <DFAVisualization 
              dfa={dfa} 
              currentState={currentState}
              className="h-80"
            />
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Analyze Message</h2>
              <MessageInput 
                onSubmit={handleAnalyze}
                isProcessing={isProcessing}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Classification Result</h2>
              <ClassificationResultDisplay result={currentResult} />
            </div>
          </div>

          {/* Right Column - History */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent History</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-4 h-4" />
                Last 10 messages
              </div>
            </div>
            
            {history.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-8 text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground font-mono text-sm">
                  No messages analyzed yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((entry, index) => (
                  <HistoryItem
                    key={index}
                    message={entry.message}
                    result={entry.result}
                    timestamp={entry.timestamp}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Theory Section */}
        <section className="mt-16 rounded-lg border border-border bg-card p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            How DFA-Based Filtering Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary font-mono">Q</span>
              </div>
              <h3 className="font-bold mb-2">Finite States</h3>
              <p className="text-sm text-muted-foreground">
                Each state represents a partial match of offensive or spam patterns 
                in the input message.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary font-mono">δ</span>
              </div>
              <h3 className="font-bold mb-2">Transition Function</h3>
              <p className="text-sm text-muted-foreground">
                Deterministic transitions based on input characters guide the 
                automaton through pattern recognition.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-destructive font-mono">F</span>
              </div>
              <h3 className="font-bold mb-2">Accepting States</h3>
              <p className="text-sm text-muted-foreground">
                When the DFA reaches an accepting state, a complete pattern match 
                is detected and flagged.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p className="font-mono">
            Built with DFA concepts from Theory of Computation
          </p>
          <p className="mt-2">
            Gmail integration requires backend setup • 
            <span className="text-primary ml-1">Connect Lovable Cloud to enable</span>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
