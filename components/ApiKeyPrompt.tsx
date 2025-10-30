
import React from 'react';
import { Icon } from './icons';

interface ApiKeyPromptProps {
  onSelectApiKey: () => void;
}

export const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onSelectApiKey }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans antialiased">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg text-center m-4">
        <div className="inline-block p-4 bg-emerald-100 rounded-full">
          <Icon name="sparkles" className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome to Chart Vision AI</h1>
        <p className="text-slate-600">
          To perform analysis, this application requires a Google AI API key.
        </p>
        <button
          onClick={onSelectApiKey}
          className="w-full bg-emerald-500 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
        >
          Select API Key
        </button>
        <p className="text-xs text-slate-500">
          For more details on billing, please refer to the{' '}
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:underline"
          >
            official documentation
          </a>
          .
        </p>
      </div>
    </div>
  );
};