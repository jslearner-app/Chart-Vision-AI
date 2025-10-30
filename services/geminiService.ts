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


const prompt = `You are an expert trading chart analyst. Your primary function is to analyze chart images and identify technical patterns with high accuracy. Analyze the provided chart screenshot and provide a structured JSON output according to the provided schema.

Your analysis must be comprehensive and strictly based on the visual evidence in the image. You have been trained to recognize a wide array of patterns. When analyzing the image, pay special attention to identifying the following patterns:

**Chart Patterns:**
- **Triangles:** Ascending, Descending, Symmetrical.
- **Flags & Pennants:** Falling Flag (Bullish), Rising Flag (Bearish), Falling Pennant (Bullish), Rising Pennant (Bearish).
- **Reversal Patterns:** Head & Shoulders, Inverse Head & Shoulders, Double Top (M), Double Bottom (W), Triple Top, Triple Bottom, Cup & Handle, Inverse Cup & Handle, Rounding Top, Rounding Bottom.
- **Wedges & Broadening Formations:** Rising Wedge, Falling Wedge, Broadening Top, Broadening Bottom.
- **Ranges:** Rectangle Formation (Bullish/Bearish).

**Candlestick Patterns:**
- **Single Candle:** Hammer, Hanging Man, Marubozu (Bullish/Bearish), Spinning Top, Doji (Dragonfly, Gravestone), Pin Bar (Bullish/Bearish).
- **Two Candles:** Engulfing (Bullish/Bearish), Harami (Bullish/Bearish), Piercing Line, Dark Cloud Cover.
- **Three+ Candles:** Morning Star, Evening Star, Morning Doji Star, Evening Doji Star, Three White Soldiers, Three Black Crows.

Based on the image, provide the following in your JSON response:
1.  **candlePatterns**: Identify up to 3 of the most recent and significant candlestick patterns. For each, specify its name, sentiment (bullish, bearish, or neutral), and your confidence level (High, Medium, or Low).
2.  **marketContext**: Describe the overall trend (e.g., 'uptrend,' 'downtrend,' 'sideways consolidation'). Note any major chart patterns from the list above that define the structure.
3.  **supportResistance**: Identify key horizontal support and resistance levels where price has reacted.
4.  **momentumSentiment**: Analyze the most recent price action (last few candles). Describe if momentum is bullish or bearish and whether it's strengthening or weakening. Provide a final, overall sentiment summary: 'Bullish', 'Bearish', 'Neutral', or 'Reversal Likely'.`;

export const analyzeChart = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  // --- IMPORTANT ---
  // PASTE YOUR GOOGLE AI API KEY HERE
  const API_KEY = "AIzaSyC_JGlk00xlRD7BJjb1ltnT78EFg3lz4Yc";
  // -----------------

  if (API_KEY === "YOUR_API_KEY_HERE") {
    throw new Error("Please add your API key to services/geminiService.ts");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

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
    if (error instanceof Error && (error.message.toLowerCase().includes('api key not valid') || error.message.toLowerCase().includes('permission denied'))) {
      throw new Error('The API key is invalid. Please make sure you have pasted the correct key in services/geminiService.ts.');
    }
    // Pass the original error message if it exists, otherwise use a generic one.
    throw new Error(error instanceof Error ? `AI analysis failed: ${error.message}` : 'Failed to get a valid analysis from the AI model.');
  }
};