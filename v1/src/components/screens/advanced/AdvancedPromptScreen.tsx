import { useState } from 'react';
import { Button } from '../../ui/Button';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';
import { generateAdvancedPrompt } from '../../../utils/advancedPromptGenerator';
import type { AdvancedFormData, PromptType } from '../../../types';

interface AdvancedPromptScreenProps {
  data: AdvancedFormData;
  onBack: () => void;
  onStartOver: () => void;
}

const promptTypes = [
  { id: 'detailed', label: 'Detailed', description: 'Full comprehensive prompt' },
  { id: 'quick', label: 'Quick', description: 'Essentials only' },
] as const;

export function AdvancedPromptScreen({ data, onBack, onStartOver }: AdvancedPromptScreenProps) {
  const [promptType, setPromptType] = useState<PromptType>('detailed');
  const { copy, copied } = useCopyToClipboard();

  const prompt = generateAdvancedPrompt(data, promptType);

  const handleDownload = () => {
    const blob = new Blob([prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diet-prompt.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {prompt.length.toLocaleString()} characters
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-advanced/10 dark:bg-advanced/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎯</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Your Prompt is Ready!
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Copy and paste this into ChatGPT or Claude
          </p>
        </div>

        {/* Prompt Type Selector */}
        <div className="flex gap-2 mb-4">
          {promptTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setPromptType(type.id)}
              className={`flex-1 p-3 rounded-xl border-2 transition-all text-left
                ${promptType === type.id
                  ? 'border-advanced bg-advanced/5 dark:bg-advanced/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
            >
              <div className={`font-semibold text-sm ${promptType === type.id ? 'text-advanced' : 'text-gray-900 dark:text-white'}`}>
                {type.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{type.description}</div>
            </button>
          ))}
        </div>

        {/* Prompt Display */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6 max-h-[350px] overflow-auto">
          <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
            {prompt}
          </pre>
        </div>

        {/* Tips */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2">💡 Tips for best results</h3>
          <ul className="text-sm text-indigo-800 dark:text-indigo-400 space-y-1">
            <li>• Use ChatGPT-4 or Claude for best results</li>
            <li>• The detailed prompt works best with advanced AI models</li>
            <li>• Ask follow-up questions to refine specific meals</li>
            <li>• Request alternatives for any foods you don't like</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-3">
        <Button
          fullWidth
          size="lg"
          onClick={() => copy(prompt)}
          className={promptType === 'detailed' ? 'bg-advanced hover:bg-indigo-600' : ''}
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy to Clipboard
            </>
          )}
        </Button>

        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={handleDownload}>
            Download .txt
          </Button>
          <Button variant="ghost" fullWidth onClick={onStartOver}>
            Start Over
          </Button>
        </div>
      </div>
    </div>
  );
}
