
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

// FIX: Moved AIStudio interface here to resolve a TypeScript error about duplicate declarations.
export interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}
