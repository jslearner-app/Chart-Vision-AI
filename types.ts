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

export interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

// FIX: Moved global window augmentation for 'aistudio' into types.ts to centralize type definitions and resolve declaration errors.
declare global {
  interface Window {
    aistudio: AIStudio;
  }
}
