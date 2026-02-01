import { useState } from 'react';
import { Button } from '../ui/Button';
import { BackButton } from '../ui/BackButton';
import logo from '../../assets/logo.png';

type Step = {
  id: string;
  title: string;
  icon: string;
  description: string;
  details: string[];
  tip?: string;
};

const steps: Step[] = [
  {
    id: 'choose-mode',
    title: 'Choose Your Mode',
    icon: '⚡',
    description: "Pick between Simple Mode (4 quick steps) or Advanced Mode (8 detailed steps) based on how much control you want.",
    details: [
      "Simple Mode: Perfect for beginners - just goal, activity, food basics",
      "Advanced Mode: Full customization - lifestyle, problems, supplements & more",
      "Both modes generate the same quality AI diet plan",
      "Use presets in Simple Mode to auto-fill common profiles"
    ],
    tip: "Not sure? Start with Simple Mode - you can always create a new Advanced plan later."
  },
  {
    id: 'enter-details',
    title: 'Enter Your Details',
    icon: '📝',
    description: "Fill in your stats, goals, and food preferences. The more accurate you are, the better your plan will be.",
    details: [
      "Age, gender, height, weight are used to calculate your calories",
      "Activity level affects your daily energy needs",
      "Food preferences ensure you get meals you'll actually enjoy",
      "Your stats are saved and auto-filled next time"
    ],
    tip: "Be honest with your activity level - overestimating leads to eating too much!"
  },
  {
    id: 'ai-generation',
    title: 'AI Generates Your Plan',
    icon: '🤖',
    description: "Our AI creates a personalized meal plan with exact portions, macros, and cooking tips tailored to your goals.",
    details: [
      "Daily calorie and macro targets calculated for your goal",
      "Multiple meals with specific portions and ingredients",
      "Macro breakdown for each meal (protein, carbs, fats)",
      "Pro tips customized to your situation"
    ],
    tip: "Generation takes 5-15 seconds. Enjoy the nutrition tips while you wait!"
  },
  {
    id: 'edit-plan',
    title: 'Edit With Natural Language',
    icon: '✏️',
    description: "Don't like something? Just type what you want to change and the AI will update your plan instantly.",
    details: [
      '"Swap chicken for beef" - replaces ingredients',
      '"Make lunch vegetarian" - dietary adjustments',
      '"I\'m drinking 4 beers tonight, adjust my diet" - lifestyle changes',
      '"Add a snack between lunch and dinner" - meal structure',
      '"Reduce carbs and increase protein" - macro adjustments'
    ],
    tip: "Be specific! 'More protein' is good, 'Add 30g protein to dinner' is better."
  },
  {
    id: 'copy-days',
    title: 'Copy to Other Days',
    icon: '📋',
    description: "Love your plan? Copy it to other days of the week with one tap. Great for consistent meal prep.",
    details: [
      "Select multiple days to copy to at once",
      "Days with existing plans show a warning",
      "Each day's plan is independent after copying",
      "Perfect for meal prep Sundays"
    ]
  },
  {
    id: 'weekly-planner',
    title: 'Your Weekly Planner',
    icon: '📅',
    description: "The home screen shows your 7-day meal plan calendar. Start by tapping any day to create a diet plan for it.",
    details: [
      "Each day shows a preview of your plan or 'Empty' if not set",
      "Green 'Exists' indicate days with completed plans",
      "Tap a day to view, edit, or create a new plan",
      "Clear any day by tapping the dustbin icon"
    ],
    tip: "Fill all 7 days to unlock the AI Shopping List feature!"
  },
  {
    id: 'shopping-list',
    title: 'AI Shopping List',
    icon: '🛒',
    description: "When all 7 days are filled, generate a smart shopping list that combines all ingredients across the week.",
    details: [
      "Automatically consolidates duplicate ingredients",
      "Organizes by category (Produce, Protein, Dairy, etc.)",
      "Cached - only regenerates when you change a plan",
      "One-tap copy to clipboard for easy shopping"
    ],
    tip: "The list is smart - '150g chicken' + '200g chicken' becomes '350g chicken'!"
  }
];

export function GettingStartedScreen({ onBack }: { onBack: () => void }) {
  const [expandedStep, setExpandedStep] = useState<string | null>('weekly-planner');

  const toggleStep = (id: string) => {
    setExpandedStep(expandedStep === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <BackButton onClick={onBack} />
          <h1 className="text-3xl font-bold tracking-tight mt-4">How to Use PeakDiet</h1>
        </div>

        <div className="flex items-center gap-4 mb-8 p-4 bg-primary/10 dark:bg-primary/20 rounded-2xl">
          <img src={logo} alt="PeakDiet" className="w-16 h-16 object-contain" />
          <div>
            <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
              Your AI-powered weekly meal planner
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Generate personalized diet plans, edit them with natural language, and get smart shopping lists.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
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
                {/* Header */}
                <div
                  className="p-5 flex items-center justify-between cursor-pointer gap-4 group"
                  onClick={() => toggleStep(step.id)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors
                      ${isExpanded ? 'bg-primary/20' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'}
                    `}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          Step {index + 1}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold">{step.title}</h3>
                    </div>
                  </div>

                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Expanded Content */}
                <div
                  className={`
                    border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20
                    transition-all duration-300 ease-in-out
                    ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}
                  `}
                >
                  <div className="p-5 space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {step.description}
                    </p>

                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                          <span className="text-primary mt-1">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>

                    {step.tip && (
                      <div className="bg-primary/10 dark:bg-primary/20 border-l-4 border-primary p-4 rounded-r-lg">
                        <div className="flex gap-2 items-start">
                          <span className="text-lg">💡</span>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-bold">Tip:</span> {step.tip}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold mb-3">Quick Example Flow</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">Open App</span>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">Tap Monday</span>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1.5 bg-primary/20 text-primary rounded-full">Simple Mode</span>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">Enter Stats</span>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">Pick Foods</span>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1.5 bg-primary/20 text-primary rounded-full">Get Plan!</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button size="lg" onClick={onBack}>
            Start Planning My Week
          </Button>
        </div>
      </div>
    </div>
  );
}
