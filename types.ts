
export interface CandlePattern {
  name: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: 'High' | 'Medium' | 'Low';
}

export interface MomentumSentiment {
  description: string;
  summary: 'Bullish' | 'Bearish' | 'Neutral' | 'Reversal Likely';
}

export interface AnalysisResult {
  candlePatterns: CandlePattern[];
  marketContext: string;
  supportResistance: string;
  momentumSentiment: MomentumSentiment;
}

// FIX: This change defines the `AIStudio` interface to resolve a TypeScript error.
// The error "Subsequent property declarations must have the same type" occurs
// because another part of the codebase (likely a global type definition)
// has already declared `window.aistudio` with the type `AIStudio`. By creating
// an interface with this name and using it, we align the type declarations.
export interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    aistudio?: AIStudio;
  }
}
