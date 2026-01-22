import { RadioCard } from '../../ui/RadioCard';
import { Input } from '../../ui/Input';
import { UnitToggle } from '../../ui/UnitToggle';
import { Button } from '../../ui/Button';
import { ProgressBar } from '../../ui/ProgressBar';
import { BackButton } from '../../ui/BackButton';
import type { SimpleFormData } from '../../../types';

interface SimpleGoalScreenProps {
  data: SimpleFormData;
  onChange: (data: Partial<SimpleFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const goals = [
  { id: 'lose_fat', icon: '🔥', title: 'Lose Fat', description: 'Burn fat, get lean' },
  { id: 'build_muscle', icon: '💪', title: 'Build Muscle', description: 'Gain strength and size' },
  { id: 'both', icon: '⚖️', title: 'Both (Recomp)', description: 'Lose fat & build muscle' },
  { id: 'get_fitter', icon: '🏃', title: 'Get Fitter', description: 'Improve overall health' },
] as const;

const presets = [
  { id: 'busy_professional', label: 'Busy Professional' },
  { id: 'athlete', label: 'Athlete' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'student', label: 'Student' },
  { id: 'parent', label: 'Parent' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'keto', label: 'Keto' },
  { id: 'gluten_free', label: 'Gluten Free' },
  { id: 'paleo', label: 'Paleo' },
  { id: 'intermittent_fasting', label: 'Intermittent Fasting' },
] as const;

export function SimpleGoalScreen({ data, onChange, onNext, onBack }: SimpleGoalScreenProps) {
  const canProceed = data.goal && data.age && data.gender && data.height && data.weight;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Back button then Progress bar */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 space-y-4">
        <BackButton onClick={onBack} />
        <ProgressBar current={1} total={4} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          What's your goal?
        </h1>

        {/* Goal Selection */}
        <div className="space-y-3 mb-8">
          {goals.map((goal) => (
            <RadioCard
              key={goal.id}
              selected={data.goal === goal.id}
              onClick={() => onChange({ goal: goal.id })}
              icon={goal.icon}
              title={goal.title}
              description={goal.description}
            />
          ))}
        </div>

        {/* Quick Preset */}
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick preset (optional)</p>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onChange({ preset: data.preset === preset.id ? null : preset.id })}
                className={`px-3 py-1.5 rounded-full text-sm transition-all
                  ${data.preset === preset.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h2>

        <div className="space-y-4">
          {/* Age */}
          <Input
            label="Age"
            type="number"
            placeholder="25"
            value={data.age || ''}
            onChange={(e) => onChange({ age: e.target.value ? Number(e.target.value) : null })}
            min={16}
            max={100}
          />

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
            <div className="flex gap-2">
              {(['male', 'female', 'other'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => onChange({ gender: g })}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all capitalize
                    ${data.gender === g
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Height */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Height</label>
              <UnitToggle
                options={['cm', 'ft']}
                value={data.heightUnit}
                onChange={(v) => onChange({ heightUnit: v as 'cm' | 'ft' })}
              />
            </div>
            {data.heightUnit === 'cm' ? (
              <Input
                type="number"
                placeholder="175"
                value={data.height || ''}
                onChange={(e) => onChange({ height: e.target.value ? Number(e.target.value) : null })}
                suffix="cm"
              />
            ) : (
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="5"
                  value={data.height || ''}
                  onChange={(e) => onChange({ height: e.target.value ? Number(e.target.value) : null })}
                  suffix="ft"
                />
                <Input
                  type="number"
                  placeholder="10"
                  value={data.heightInches || ''}
                  onChange={(e) => onChange({ heightInches: e.target.value ? Number(e.target.value) : null })}
                  suffix="in"
                />
              </div>
            )}
          </div>

          {/* Weight */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Weight</label>
              <UnitToggle
                options={['kg', 'lbs']}
                value={data.weightUnit}
                onChange={(v) => onChange({ weightUnit: v as 'kg' | 'lbs' })}
              />
            </div>
            <Input
              type="number"
              placeholder={data.weightUnit === 'kg' ? '75' : '165'}
              value={data.weight || ''}
              onChange={(e) => onChange({ weight: e.target.value ? Number(e.target.value) : null })}
              suffix={data.weightUnit}
            />
          </div>
        </div>
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
