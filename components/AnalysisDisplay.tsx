
import React from 'react';
import type { AnalysisResult, CandlePattern, TradeSuggestion } from '../types';
import { Icon } from './icons';

interface AnalysisDisplayProps {
  result: AnalysisResult;
}

const sentimentStyles = {
  bullish: {
    icon: 'trendingUp' as const,
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-200',
    iconColor: 'text-emerald-500',
  },
  bearish: {
    icon: 'trendingDown' as const,
    bgColor: 'bg-red-50',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
    iconColor: 'text-red-500',
  },
  neutral: {
    icon: 'minus' as const,
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-800',
    borderColor: 'border-slate-200',
    iconColor: 'text-slate-500',
  },
};

const getSentimentStyle = (sentiment: string) => {
    const lowerSentiment = sentiment.toLowerCase();
    if (lowerSentiment.includes('bullish')) return sentimentStyles.bullish;
    if (lowerSentiment.includes('bearish')) return sentimentStyles.bearish;
    return sentimentStyles.neutral;
};

interface AnalysisCardProps {
    title: string;
    icon: React.ComponentProps<typeof Icon>['name'];
    children?: React.ReactNode;
}

const AnalysisCard = ({ title, icon, children }: AnalysisCardProps): React.ReactElement => (
  <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-200">
    <h3 className="text-md font-semibold text-slate-700 flex items-center gap-2 mb-3">
      <Icon name={icon} className="w-5 h-5 text-slate-400" />
      {title}
    </h3>
    <div className="text-sm text-slate-600 space-y-2">{children}</div>
  </div>
);

interface CandlePatternTagProps {
    pattern: CandlePattern;
}

const CandlePatternTag = ({ pattern }: CandlePatternTagProps): React.ReactElement => {
    const styles = getSentimentStyle(pattern.sentiment);
    return (
        <div className={`flex items-center gap-4 p-3 rounded-md border ${styles.borderColor} ${styles.bgColor}`}>
            <Icon name={styles.icon} className={`w-6 h-6 ${styles.iconColor}`} />
            <div className="flex-grow">
                <p className={`font-semibold ${styles.textColor}`}>{pattern.name}</p>
                <p className="text-xs text-slate-500">Confidence: {pattern.confidence}</p>
            </div>
        </div>
    );
}

const TradeSuggestionCard = ({ suggestion }: { suggestion: TradeSuggestion }): React.ReactElement => (
  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
    <h3 className="text-md font-semibold text-blue-800 flex items-center gap-2 mb-3">
      <Icon name="target" className="w-5 h-5 text-blue-500" />
      Trade Suggestion
    </h3>
    <div className="text-sm text-slate-700 space-y-3">
      <p className="text-base font-semibold text-blue-900">{suggestion.strategy}</p>
      <div>
        <strong className="text-slate-600">Entry:</strong>
        <p className="ml-2">{suggestion.entry}</p>
      </div>
      <div>
        <strong className="text-slate-600">Stop-Loss:</strong>
        <p className="ml-2">{suggestion.stopLoss}</p>
      </div>
      <div>
        <strong className="text-slate-600">Exit / Target:</strong>
        <p className="ml-2">{suggestion.exit}</p>
      </div>
    </div>
  </div>
);


export const AnalysisDisplay = ({ result }: AnalysisDisplayProps): React.ReactElement => {
    const summaryStyle = getSentimentStyle(result.momentumSentiment.summary);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className={`p-4 rounded-lg border-2 ${summaryStyle.borderColor} ${summaryStyle.bgColor}`}>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Sentiment Summary</h3>
                <div className={`flex items-center gap-2 text-xl font-bold ${summaryStyle.textColor}`}>
                    <Icon name={summaryStyle.icon} className="w-6 h-6" />
                    <span>{result.momentumSentiment.summary}</span>
                </div>
            </div>

            <TradeSuggestionCard suggestion={result.tradeSuggestion} />
             <p className="text-xs text-slate-500 italic text-center -mt-4">
                Disclaimer: AI-generated suggestions are for educational purposes only and not financial advice.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <AnalysisCard title="Candlestick Patterns" icon="candle">
                    {result.candlePatterns.length > 0 ? (
                        <div className="space-y-2">
                        {result.candlePatterns.map((p, i) => (
                            <div key={i}>
                                <CandlePatternTag pattern={p} />
                            </div>
                        ))}
                        </div>
                    ) : (
                        <p>No significant patterns detected in the recent price action.</p>
                    )}
                </AnalysisCard>
                
                <AnalysisCard title="Market Context" icon="compass">
                    <p>{result.marketContext}</p>
                </AnalysisCard>

                <AnalysisCard title="Support & Resistance" icon="layer">
                    <p>{result.supportResistance}</p>
                </AnalysisCard>

                <AnalysisCard title="Momentum" icon="activity">
                    <p>{result.momentumSentiment.description}</p>
                </AnalysisCard>
            </div>
        </div>
    );
};
