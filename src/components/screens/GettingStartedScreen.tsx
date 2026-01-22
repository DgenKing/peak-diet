import { useState } from 'react';
import { Button } from '../ui/Button';

type Step = {
  id: string;
  title: string;
  icon: React.ReactNode;
  hook: string;
  actions: string[];
  troubleshooting?: string;
  codeSnippet?: {
    lang: string;
    code: string;
  };
};

const steps: Step[] = [
  {
    id: 'env-setup',
    title: 'Environment Setup',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    hook: "Configure your local environment to communicate with external AI services securely.",
    actions: [
      "Copy the example environment file.",
      "Add your DeepSeek API key.",
      "Restart the development server."
    ],
    codeSnippet: {
      lang: "bash",
      code: "cp .env.example .env\n# Edit .env and add VITE_DEEPSEEK_API_KEY=your_key_here"
    }
  },
  {
    id: 'deployment',
    title: 'Deployment',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    hook: "Push your application to production so you can access it from anywhere.",
    actions: [
      "Connect your GitHub repository to Vercel.",
      "Add your environment variables in the Vercel dashboard.",
      "Trigger a deployment."
    ],
    troubleshooting: "If the build fails, check if you've included all necessary environment variables in the project settings. The build process needs access to the API keys if they are used during build time (though usually they are runtime)."
  },
  {
    id: 'cron-jobs',
    title: 'Cron Jobs & Automation',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    hook: "Set up automated tasks to refresh your diet plan or generate weekly shopping lists automatically.",
    actions: [
      "Create a vercel.json configuration file.",
      "Define your cron job schedule.",
      "Ensure your API endpoint handles the cron request."
    ],
    troubleshooting: "Warning: The Vercel Hobby Plan allows cron jobs to run only once per day. Setting a more frequent schedule (e.g., hourly) will result in deployment errors or the job failing to run.",
    codeSnippet: {
      lang: "json",
      code: '// vercel.json\n{\n  "crons": [\n    {\n      "path": "/api/cron/refresh-plan",\n      "schedule": "0 5 * * *"\n    }\n  ]\n}'
    }
  }
];

export function GettingStartedScreen({ onBack }: { onBack: () => void }) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const toggleStep = (id: string) => {
    setExpandedStep(expandedStep === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="secondary" onClick={onBack} size="sm">
            ← Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Getting Started</h1>
        </div>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
          Welcome to PeakDiet. Follow these steps to configure your environment, deploy the app, and set up automation.
        </p>

        <div className="space-y-6">
          {steps.map((step) => {
            const isExpanded = expandedStep === step.id;

            return (
              <div 
                key={step.id} 
                className={`
                  bg-white dark:bg-gray-900 rounded-2xl border transition-all duration-300 overflow-hidden
                  ${isExpanded 
                    ? 'border-primary shadow-lg ring-1 ring-primary/20' 
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 shadow-sm'
                  }
                `}
              >
                {/* Header / Quick View */}
                <div 
                  className="p-6 flex items-start sm:items-center justify-between cursor-pointer gap-4 group"
                  onClick={() => toggleStep(step.id)}
                >
                  <div className="flex items-start sm:items-center gap-4 flex-1">
                    <div className={`
                      p-3 rounded-xl transition-colors
                      ${isExpanded ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'}
                    `}>
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">{step.hook}</p>
                    </div>
                  </div>
                  
                  <button 
                    className={`
                      shrink-0 text-sm font-medium transition-colors flex items-center gap-1
                      ${isExpanded ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200'}
                    `}
                  >
                    {isExpanded ? 'Hide Details' : 'Show Details'}
                    <svg 
                      className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Deep Dive Content */}
                <div 
                  className={`
                    border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20
                    transition-all duration-300 ease-in-out
                    ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}
                  `}
                >
                  <div className="p-6 sm:pl-20 sm:pr-10 space-y-6">
                    
                    {/* Actions List */}
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Steps</h4>
                      <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        {step.actions.map((action, idx) => (
                          <li key={idx} className="pl-1">{action}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Troubleshooting */}
                    {step.troubleshooting && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                        <div className="flex gap-3">
                          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <span className="font-bold">Important:</span> {step.troubleshooting}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Code Snippet */}
                    {step.codeSnippet && (
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Configuration</h4>
                        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto border border-gray-700 shadow-inner">
                          <pre className="text-gray-300">
                            <code>{step.codeSnippet.code}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" onClick={onBack}>
              I'm Ready to Start
            </Button>
          </div>
        </div>
      </div>
  );
}
