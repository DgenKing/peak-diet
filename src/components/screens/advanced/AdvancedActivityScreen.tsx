import { RadioCard } from '../../ui/RadioCard';
import { Slider } from '../../ui/Slider';
import { CheckboxGroup } from '../../ui/CheckboxGroup';
import { TextArea } from '../../ui/TextArea';
import { Button } from '../../ui/Button';
import { ProgressBar } from '../../ui/ProgressBar';
import { BackButton } from '../../ui/BackButton';
import { trainingTypes, trainingSplits } from '../../../data/options';
import type { AdvancedFormData, ActivityLevel, TrainingTime } from '../../../types';

interface AdvancedActivityScreenProps {
  data: AdvancedFormData;
  onChange: (data: Partial<AdvancedFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const activityLevels = [
  { id: 'sedentary', icon: '🪑', title: 'Sedentary', description: 'Desk job, minimal movement' },
  { id: 'lightly_active', icon: '🚶', title: 'Lightly Active', description: 'Some walking, light activity' },
  { id: 'moderately_active', icon: '🏃', title: 'Moderately Active', description: 'On feet most of day' },
  { id: 'very_active', icon: '💪', title: 'Very Active', description: 'Physical job, lots of movement' },
  { id: 'extremely_active', icon: '🏆', title: 'Extremely Active', description: 'Hard labor, professional athlete' },
] as const;

const trainingTimes = [
  { id: 'early_morning', label: 'Early AM' },
  { id: 'morning', label: 'Morning' },
  { id: 'lunchtime', label: 'Lunch' },
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'evening', label: 'Evening' },
  { id: 'late_night', label: 'Late' },
  { id: 'varies', label: 'Varies' },
] as const;

const durations = [15, 30, 45, 60, 90, 120];

export function AdvancedActivityScreen({ data, onChange, onNext, onBack }: AdvancedActivityScreenProps) {
  const canProceed = data.activityLevel;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Back button then Progress bar */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 space-y-4">
        <BackButton onClick={onBack} />
        <ProgressBar current={3} total={8} label="Step 3 of 8 - Activity" />
      </div>

      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Activity & Training</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Tell us about your daily activity and workouts</p>

        {/* Daily Activity */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Daily Activity Level</h2>
        <div className="space-y-2 mb-8">
          {activityLevels.map((level) => (
            <RadioCard
              key={level.id}
              selected={data.activityLevel === level.id}
              onClick={() => onChange({ activityLevel: level.id as ActivityLevel })}
              icon={level.icon}
              title={level.title}
              description={level.description}
            />
          ))}
        </div>

        {/* Training Details */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Training Details</h2>

        <div className="mb-6">
          <Slider
            label="Training days per week"
            value={data.trainingDaysPerWeek}
            onChange={(v) => onChange({ trainingDaysPerWeek: v })}
            min={0}
            max={7}
            valueLabel=" days"
          />
        </div>

        {data.trainingDaysPerWeek > 0 && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Session duration (minutes)</label>
              <div className="flex flex-wrap gap-2">
                {durations.map((d) => (
                  <button
                    key={d}
                    onClick={() => onChange({ sessionDuration: d })}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                      ${data.sessionDuration === d ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Training type</label>
              <CheckboxGroup
                options={trainingTypes}
                selected={data.trainingTypes}
                onChange={(types) => onChange({ trainingTypes: types })}
                columns={2}
              />
            </div>

            {data.trainingTypes.includes('weight_training') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Training split</label>
                <div className="flex flex-wrap gap-2">
                  {trainingSplits.map((split) => (
                    <button
                      key={split.id}
                      onClick={() => onChange({ trainingSplit: split.id })}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all
                        ${data.trainingSplit === split.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                    >
                      {split.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">When do you train?</label>
              <div className="flex flex-wrap gap-2">
                {trainingTimes.map((time) => (
                  <button
                    key={time.id}
                    onClick={() => onChange({ trainingTime: time.id as TrainingTime })}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all
                      ${data.trainingTime === time.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                  >
                    {time.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <TextArea
          label="Any injuries or limitations? (optional)"
          placeholder="e.g., bad knee, lower back issues..."
          value={data.injuries}
          onChange={(e) => onChange({ injuries: e.target.value })}
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
