import { RadioCard } from '../../ui/RadioCard';
import { CheckboxGroup } from '../../ui/CheckboxGroup';
import { Button } from '../../ui/Button';
import { ProgressBar } from '../../ui/ProgressBar';
import type { AdvancedFormData, PrimaryGoal, SecondaryGoal } from '../../../types';

interface AdvancedGoalScreenProps {
  data: AdvancedFormData;
  onChange: (data: Partial<AdvancedFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const primaryGoals = [
  { id: 'fat_loss', icon: '🔥', title: 'Fat Loss / Cut', description: 'Lose body fat while preserving muscle' },
  { id: 'muscle_building', icon: '💪', title: 'Muscle Building / Bulk', description: 'Maximize muscle gain, controlled surplus' },
  { id: 'recomposition', icon: '⚖️', title: 'Body Recomposition', description: 'Build muscle AND lose fat simultaneously' },
  { id: 'weight_gain', icon: '📈', title: 'Weight Gain', description: 'Healthy weight gain for underweight' },
  { id: 'maintenance', icon: '🎯', title: 'Maintenance', description: 'Maintain current physique' },
  { id: 'athletic_performance', icon: '🏆', title: 'Athletic Performance', description: 'Fuel for sport-specific performance' },
] as const;

const secondaryGoals = [
  { id: 'increase_energy', label: 'Increase Energy' },
  { id: 'improve_sleep', label: 'Improve Sleep Quality' },
  { id: 'better_digestion', label: 'Better Digestion' },
  { id: 'reduce_inflammation', label: 'Reduce Inflammation' },
  { id: 'improve_skin_hair', label: 'Improve Skin/Hair' },
  { id: 'hormone_optimization', label: 'Hormone Optimization' },
];

export function AdvancedGoalScreen({ data, onChange, onNext, onBack }: AdvancedGoalScreenProps) {
  const canProceed = data.primaryGoal;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <ProgressBar current={1} total={8} label="Step 1 of 8 - Goals" />
      </div>

      <div className="flex-1 overflow-auto p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Primary Goal</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">What's your main objective?</p>

        <div className="space-y-3 mb-8">
          {primaryGoals.map((goal) => (
            <RadioCard
              key={goal.id}
              selected={data.primaryGoal === goal.id}
              onClick={() => onChange({ primaryGoal: goal.id as PrimaryGoal })}
              icon={goal.icon}
              title={goal.title}
              description={goal.description}
            />
          ))}
        </div>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Secondary Goals</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Optional - select any that apply</p>

        <CheckboxGroup
          options={secondaryGoals}
          selected={data.secondaryGoals}
          onChange={(goals) => onChange({ secondaryGoals: goals as SecondaryGoal[] })}
          columns={2}
        />
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <Button fullWidth size="lg" onClick={onNext} disabled={!canProceed}>
          Continue
        </Button>
      </div>
    </div>
  );
}
