// DFA-based pattern matching for offensive/spam detection
// Theory of Computation implementation

export interface DFAState {
  id: string;
  label: string;
  isAccepting: boolean;
  type: 'start' | 'normal' | 'accepting' | 'trap';
}

export interface DFATransition {
  from: string;
  to: string;
  symbol: string;
}

export interface DFA {
  states: DFAState[];
  alphabet: string[];
  transitions: DFATransition[];
  startState: string;
  acceptingStates: string[];
}

export type Classification = 'safe' | 'spam' | 'offensive' | 'suspicious';

export interface ClassificationResult {
  classification: Classification;
  confidence: number;
  matchedPatterns: string[];
  category: string;
  stateHistory: string[];
}

// Offensive word patterns (simplified for demonstration)
const offensivePatterns = [
  'hate', 'kill', 'die', 'stupid', 'idiot', 'dumb', 'ugly', 'loser',
  'threat', 'attack', 'destroy', 'hurt', 'harm'
];

// Spam patterns
const spamPatterns = [
  'free', 'winner', 'prize', 'click', 'urgent', 'act now', 'limited',
  'offer', 'discount', 'sale', 'buy now', 'subscribe', 'unsubscribe',
  'million', 'lottery', 'congratulations', 'selected'
];

// Suspicious patterns
const suspiciousPatterns = [
  'password', 'credit card', 'ssn', 'social security', 'bank account',
  'wire transfer', 'bitcoin', 'crypto', 'investment', 'guaranteed'
];

// Build DFA for pattern matching using Aho-Corasick inspired approach
export function buildPatternDFA(patterns: string[]): DFA {
  const states: DFAState[] = [
    { id: 'q0', label: 'Start', isAccepting: false, type: 'start' }
  ];
  const transitions: DFATransition[] = [];
  let stateCounter = 1;

  patterns.forEach((pattern, patternIndex) => {
    let currentState = 'q0';
    
    for (let i = 0; i < pattern.length; i++) {
      const char = pattern[i].toLowerCase();
      const isLast = i === pattern.length - 1;
      
      // Check if transition exists
      const existingTransition = transitions.find(
        t => t.from === currentState && t.symbol === char
      );
      
      if (existingTransition) {
        currentState = existingTransition.to;
      } else {
        const newStateId = `q${stateCounter++}`;
        states.push({
          id: newStateId,
          label: isLast ? `Accept(${pattern})` : `S${stateCounter - 1}`,
          isAccepting: isLast,
          type: isLast ? 'accepting' : 'normal'
        });
        transitions.push({
          from: currentState,
          to: newStateId,
          symbol: char
        });
        currentState = newStateId;
      }
    }
  });

  return {
    states,
    alphabet: [...new Set(patterns.join('').toLowerCase().split(''))],
    transitions,
    startState: 'q0',
    acceptingStates: states.filter(s => s.isAccepting).map(s => s.id)
  };
}

// Run DFA on input string
export function runDFA(dfa: DFA, input: string): { accepted: boolean; stateHistory: string[] } {
  let currentState = dfa.startState;
  const stateHistory: string[] = [currentState];
  const normalizedInput = input.toLowerCase();

  for (const char of normalizedInput) {
    const transition = dfa.transitions.find(
      t => t.from === currentState && t.symbol === char
    );
    
    if (transition) {
      currentState = transition.to;
      stateHistory.push(currentState);
    }
  }

  return {
    accepted: dfa.acceptingStates.includes(currentState),
    stateHistory
  };
}

// Pattern matching with sliding window
function findPatterns(text: string, patterns: string[]): string[] {
  const normalizedText = text.toLowerCase();
  const foundPatterns: string[] = [];
  
  for (const pattern of patterns) {
    if (normalizedText.includes(pattern.toLowerCase())) {
      foundPatterns.push(pattern);
    }
  }
  
  return foundPatterns;
}

// Main classification function
export function classifyMessage(message: string): ClassificationResult {
  const offensiveMatches = findPatterns(message, offensivePatterns);
  const spamMatches = findPatterns(message, spamPatterns);
  const suspiciousMatches = findPatterns(message, suspiciousPatterns);
  
  const allPatterns = [...offensivePatterns, ...spamPatterns, ...suspiciousPatterns];
  const dfa = buildPatternDFA(allPatterns.slice(0, 5)); // Use subset for visualization
  const { stateHistory } = runDFA(dfa, message);
  
  let classification: Classification = 'safe';
  let confidence = 0;
  let category = 'General';
  let matchedPatterns: string[] = [];
  
  if (offensiveMatches.length > 0) {
    classification = 'offensive';
    confidence = Math.min(0.5 + offensiveMatches.length * 0.15, 0.99);
    category = 'Harassment/Hate';
    matchedPatterns = offensiveMatches;
  } else if (spamMatches.length > 2) {
    classification = 'spam';
    confidence = Math.min(0.4 + spamMatches.length * 0.12, 0.95);
    category = 'Marketing Spam';
    matchedPatterns = spamMatches;
  } else if (suspiciousMatches.length > 0) {
    classification = 'suspicious';
    confidence = Math.min(0.3 + suspiciousMatches.length * 0.2, 0.9);
    category = 'Phishing/Scam';
    matchedPatterns = suspiciousMatches;
  } else if (spamMatches.length > 0) {
    classification = 'suspicious';
    confidence = 0.3 + spamMatches.length * 0.1;
    category = 'Potential Spam';
    matchedPatterns = spamMatches;
  } else {
    classification = 'safe';
    confidence = 0.95;
    category = 'Safe Communication';
  }
  
  return {
    classification,
    confidence,
    matchedPatterns,
    category,
    stateHistory
  };
}

// Get sample DFA for visualization
export function getSampleDFA(): DFA {
  return {
    states: [
      { id: 'q0', label: 'Start', isAccepting: false, type: 'start' },
      { id: 'q1', label: 'S', isAccepting: false, type: 'normal' },
      { id: 'q2', label: 'SP', isAccepting: false, type: 'normal' },
      { id: 'q3', label: 'SPA', isAccepting: false, type: 'normal' },
      { id: 'q4', label: 'SPAM', isAccepting: true, type: 'accepting' },
      { id: 'q5', label: 'H', isAccepting: false, type: 'normal' },
      { id: 'q6', label: 'HA', isAccepting: false, type: 'normal' },
      { id: 'q7', label: 'HAT', isAccepting: false, type: 'normal' },
      { id: 'q8', label: 'HATE', isAccepting: true, type: 'accepting' },
    ],
    alphabet: ['s', 'p', 'a', 'm', 'h', 't', 'e'],
    transitions: [
      { from: 'q0', to: 'q1', symbol: 's' },
      { from: 'q1', to: 'q2', symbol: 'p' },
      { from: 'q2', to: 'q3', symbol: 'a' },
      { from: 'q3', to: 'q4', symbol: 'm' },
      { from: 'q0', to: 'q5', symbol: 'h' },
      { from: 'q5', to: 'q6', symbol: 'a' },
      { from: 'q6', to: 'q7', symbol: 't' },
      { from: 'q7', to: 'q8', symbol: 'e' },
    ],
    startState: 'q0',
    acceptingStates: ['q4', 'q8']
  };
}
