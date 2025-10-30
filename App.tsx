import React, { useState, useCallback, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { Spinner } from './components/Spinner';
import { Icon } from './components/icons';
import { analyzeChart } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import type { AnalysisResult } from './types';

export default function App(): React.ReactElement {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isKeyReady, setIsKeyReady] = useState<boolean>(false);
  const [checkingKey, setCheckingKey] = useState<boolean>(true);

  useEffect(() => {
    const checkApiKey = async () => {
      try {
        if (window.aistudio && (await window.aistudio.hasSelectedApiKey())) {
          setIsKeyReady(true);
        }
      } catch (e) {
        console.error("Error checking for API key:", e);
      } finally {
        setCheckingKey(false);
      }
    };
    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
    try {
      if (window.aistudio) {
        await window.aistudio.openSelectKey();
        // Assume success and update UI immediately as per guidelines
        setIsKeyReady(true); 
      }
    } catch (e) {
      console.error("Error opening API key selection:", e);
      setError("Failed to open API key selection. Please try again.");
    }
  };


  const handleImageUpload = useCallback((file: File) => {
    setImageFile(file);
    setAnalysis(null);
    setError(null);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  }, []);

  const handleAnalyzeClick = async () => {
    if (!imageFile) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const base64Image = await fileToBase64(imageFile);
      const result = await analyzeChart(base64Image, imageFile.type);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during analysis.';
      
      if (errorMessage.includes('Requested entity was not found')) {
        setError('Your API key may be invalid. Please select a new one.');
        setIsKeyReady(false); // Reset to prompt for key selection
        return;
      }

      // Handle the specific error from the screenshot
      if (errorMessage.includes('API Key must be set') || errorMessage.includes('API key not valid')) {
         setError('An API Key must be set. Please select one to continue.');
         setIsKeyReady(false);
         return;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setImageFile(null);
    setImageUrl(null);
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
  };

  if (checkingKey) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Spinner className="w-12 h-12 text-emerald-500" />
      </div>
    );
  }

  if (!isKeyReady) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="mx-auto bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Icon name="sparkles" className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to Chart Vision AI</h1>
          <p className="text-slate-600 mb-6">To perform analysis, this application requires a Google AI API key.</p>
          <button
            onClick={handleSelectKey}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
          >
            Select API Key
          </button>
           <p className="text-xs text-slate-500 mt-4">
            For more details on billing, please refer to the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline font-medium">official documentation</a>.
          </p>
           {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 antialiased">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Chart Vision <span className="text-emerald-500">AI</span>
          </h1>
          <p className="mt-2 text-lg text-slate-600 max-w-2xl mx-auto">
            Upload a trading chart screenshot and let AI provide a detailed technical analysis in seconds.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full flex flex-col gap-6 sticky top-8">
            <ImageUploader onImageUpload={handleImageUpload} imageUrl={imageUrl} onReset={resetState} />
            <button
              onClick={handleAnalyzeClick}
              disabled={!imageFile || isLoading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <Spinner className="text-white" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Icon name="sparkles" className="w-5 h-5" />
                  Analyze Chart
                </>
              )}
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg w-full min-h-[60vh]">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Icon name="chart" className="w-6 h-6 text-slate-500" />
              Analysis Results
            </h2>
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 pt-16">
                <Spinner className="w-12 h-12 mb-4 text-slate-500" />
                <p className="text-lg font-medium">Analyzing chart...</p>
                <p className="text-sm">This may take a moment.</p>
              </div>
            )}
            {error && (
              <div className="flex flex-col items-center justify-center h-full text-red-500 pt-16 bg-red-50 p-6 rounded-lg">
                <Icon name="error" className="w-12 h-12 mb-4" />
                <p className="text-lg font-bold">Analysis Failed</p>
                <p className="text-sm text-center">{error}</p>
              </div>
            )}
            {!isLoading && !error && !analysis && (
              <div className="flex flex-col items-center justify-center text-center text-slate-500 pt-16">
                <Icon name="upload" className="w-12 h-12 mb-4" />
                <p className="text-lg font-medium">Awaiting Analysis</p>
                <p className="text-sm max-w-xs">Upload a chart screenshot and click "Analyze Chart" to see the AI-powered insights here.</p>
              </div>
            )}
            {analysis && <AnalysisDisplay result={analysis} />}
          </div>
        </div>

        <footer className="text-center mt-12 text-sm text-slate-500">
          <p>&copy; 2025 Lanre² Chart Vision AI . All Rights Reserved.</p>
        </footer>
      </main>
    </div>
  );
}