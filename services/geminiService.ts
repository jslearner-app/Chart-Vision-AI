import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    candlePatterns: {
      type: Type.ARRAY,
      description: "List of up to 3 most recent, significant candlestick patterns.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "Name of the candlestick pattern (e.g., 'Bullish Engulfing', 'Doji')."
          },
          sentiment: {
            type: Type.STRING,
            description: "Sentiment of the pattern.",
          },
          confidence: {
            type: Type.STRING,
            description: "Confidence level in the pattern detection.",
          },
        },
         required: ["name", "sentiment", "confidence"]
      }
    },
    marketContext: {
      type: Type.STRING,
      description: "A description of the overall market trend and context shown in the chart."
    },
    supportResistance: {
      type: Type.STRING,
      description: "Analysis of visible support/demand and resistance/supply zones."
    },
    momentumSentiment: {
      type: Type.OBJECT,
      properties: {
        description: {
          type: Type.STRING,
          description: "Description of the current momentum based on recent candles."
        },
        summary: {
          type: Type.STRING,
          description: "A final, overall sentiment summary.",
        }
      },
      required: ["description", "summary"]
    }
  },
  required: ["candlePatterns", "marketContext", "supportResistance", "momentumSentiment"]
};


const prompt = `You are an expert trading chart analyst trained to read candlestick patterns, price structure, and market sentiment from images. Analyze the provided chart screenshot and provide a structured JSON output according to the provided schema.

Based on the image, provide the following:
1.  **candlePatterns**: Identify up to 3 most recent, significant candlestick patterns. For each, specify its name, sentiment (bullish, bearish, or neutral), and your confidence level (High, Medium, or Low).
2.  **marketContext**: Describe the overall trend visible in the chart (e.g., 'uptrend with higher highs and higher lows'). Note any significant events like a pullback to a key moving average, a reversal at a key zone, or a breakout formation.
3.  **supportResistance**: Highlight visible support/demand and resistance/supply zones where the price has reacted multiple times.
4.  **momentumSentiment**: Based on recent candle body sizes, wick lengths, and sequence, describe whether momentum is strengthening or fading. Provide a final, overall sentiment summary: 'Bullish', 'Bearish', 'Neutral', or 'Reversal Likely'.`;

export const analyzeChart = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  // Initialize the client. The SDK will automatically find the API key from the environment.
  // FIX: Initialize the GoogleGenAI client with the API key from environment variables as per the guidelines.
  const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

  try {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: prompt,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
      },
    });

    const responseText = response.text.trim();
    const parsedJson = JSON.parse(responseText);

    // Basic validation to ensure the response structure matches our type
    if (
      !parsedJson.candlePatterns ||
      !parsedJson.marketContext ||
      !parsedJson.supportResistance ||
      !parsedJson.momentumSentiment
    ) {
      throw new Error('Invalid response structure from API.');
    }
    
    return parsedJson as AnalysisResult;

  } catch (error) {
    console.error('Error analyzing chart with Gemini:', error);
    if (error instanceof Error && error.message.includes('429')) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    // Pass the original error message if it exists, otherwise use a generic one.
    throw new Error(error instanceof Error ? error.message : 'Failed to get a valid analysis from the AI model.');
  }
};