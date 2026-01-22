import { RadioCard } from '../../ui/RadioCard';
import { Slider } from '../../ui/Slider';
import { Button } from '../../ui/Button';
import { ProgressBar } from '../../ui/ProgressBar';
import { BackButton } from '../../ui/BackButton';
import type { SimpleFormData, TrainingType } from '../../../types';

interface SimpleActivityScreenProps {
  data: SimpleFormData;
  onChange: (data: Partial<SimpleFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const activities = [
  { id: 'sitting', icon: '🪑', title: 'Mostly Sitting', description: 'Desk job, minimal movement' },
  { id: 'some_movement', icon: '🚶', title: 'Some Movement', description: 'Retail, teaching, light activity' },
  { id: 'very_active', icon: '🏃', title: 'Very Active', description: 'Construction, trainer, on feet all day' },
] as const;

const trainingTypes = [
  { id: 'gym', label: 'Gym', icon: '🏋️' },
  { id: 'cardio', label: 'Cardio', icon: '🏃' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'mix', label: 'Mix', icon: '💪' },
] as const;

export function SimpleActivityScreen({ data, onChange, onNext, onBack }: SimpleActivityScreenProps) {
  const canProceed = data.dailyActivity && (data.trainingDays === 0 || data.trainingType);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Back button then Progress bar */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 space-y-4">
        <BackButton onClick={onBack} />
        <ProgressBar current={2} total={4} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Activity Level
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          How active is your daily life?
        </p>

        {/* Daily Activity */}
        <div className="space-y-3 mb-8">
          {activities.map((activity) => (
            <RadioCard
              key={activity.id}
              selected={data.dailyActivity === activity.id}
              onClick={() => onChange({ dailyActivity: activity.id })}
              icon={activity.icon}
              title={activity.title}
              description={activity.description}
            />
          ))}
        </div>

        {/* Training */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Do you exercise?
        </h2>

        <div className="mb-6">
          <Slider
            label="Training days per week"
            value={data.trainingDays}
            onChange={(v) => onChange({ trainingDays: v })}
            min={0}
            max={7}
            valueLabel=" days"
          />
        </div>

        {data.trainingDays > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">What type of training?</p>
            <div className="grid grid-cols-2 gap-3">
              {trainingTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => onChange({ trainingType: type.id as TrainingType })}
                  className={`p-4 rounded-xl border-2 transition-all text-center
                    ${data.trainingType === type.id
                      ? 'border-primary bg-primary-light dark:bg-primary/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                  <span className="text-2xl block mb-1">{type.icon}</span>
                  <span className={`font-medium ${data.trainingType === type.id ? 'text-primary-dark dark:text-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <Button fullWidth size="lg" onClick={onNext} disabled={!canProceed}>
          Continue
        </Button>
      </div>
    </div>
  );
}
