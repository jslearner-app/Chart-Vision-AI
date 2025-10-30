
export interface CandlePattern {
  name: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: 'High' | 'Medium' | 'Low';
}

export interface MomentumSentiment {
  description: string;
  summary: 'Bullish' | 'Bearish' | 'Neutral' | 'Reversal Likely';
}

export interface TradeSuggestion {
  strategy: string;
  entry: string;
  stopLoss: string;
  exit: string;
}

export interface AnalysisResult {
  candlePatterns: CandlePattern[];
  marketContext: string;
  supportResistance: string;
  momentumSentiment: MomentumSentiment;
  tradeSuggestion: TradeSuggestion;
}
