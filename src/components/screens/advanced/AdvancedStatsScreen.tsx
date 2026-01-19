import { Input } from '../../ui/Input';
import { UnitToggle } from '../../ui/UnitToggle';
import { RadioCard } from '../../ui/RadioCard';
import { Button } from '../../ui/Button';
import { ProgressBar } from '../../ui/ProgressBar';
import type { AdvancedFormData } from '../../../types';

interface AdvancedStatsScreenProps {
  data: AdvancedFormData;
  onChange: (data: Partial<AdvancedFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const bodyTypes = [
  { id: 'ectomorph', icon: '🏃', title: 'Ectomorph', description: 'Naturally thin, fast metabolism' },
  { id: 'mesomorph', icon: '💪', title: 'Mesomorph', description: 'Naturally muscular, medium build' },
  { id: 'endomorph', icon: '🐻', title: 'Endomorph', description: 'Naturally broader, slower metabolism' },
] as const;

const proteinLevels = [
  { id: 'low', label: 'Low' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'high', label: 'High' },
  { id: 'unknown', label: 'No idea' },
] as const;

const waterLevels = [
  { id: 'less_1L', label: '< 1L' },
  { id: '1_2L', label: '1-2L' },
  { id: '2_3L', label: '2-3L' },
  { id: '3L_plus', label: '3L+' },
] as const;

export function AdvancedStatsScreen({ data, onChange, onNext, onBack }: AdvancedStatsScreenProps) {
  const canProceed = data.age && data.gender && data.height && data.weight;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <ProgressBar current={2} total={8} label="Step 2 of 8 - Body Stats" />
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

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Body Stats</h1>

        <div className="space-y-5">
          {/* Basic Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Age"
              type="number"
              placeholder="25"
              value={data.age || ''}
              onChange={(e) => onChange({ age: e.target.value ? Number(e.target.value) : null })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gender</label>
              <div className="flex gap-1">
                {(['male', 'female', 'other'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => onChange({ gender: g })}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all capitalize
                      ${data.gender === g ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                  >
                    {g === 'other' ? '?' : g.charAt(0).toUpperCase()}
                  </button>
                ))}
              </div>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Weight</label>
                <UnitToggle
                  options={['kg', 'lbs']}
                  value={data.weightUnit}
                  onChange={(v) => onChange({ weightUnit: v as 'kg' | 'lbs' })}
                />
              </div>
              <Input
                type="number"
                placeholder="75"
                value={data.weight || ''}
                onChange={(e) => onChange({ weight: e.target.value ? Number(e.target.value) : null })}
                suffix={data.weightUnit}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Target Weight</label>
              <Input
                type="number"
                placeholder="Optional"
                value={data.targetWeight || ''}
                onChange={(e) => onChange({ targetWeight: e.target.value ? Number(e.target.value) : null })}
                suffix={data.weightUnit}
              />
            </div>
          </div>

          {/* Body Fat */}
          <Input
            label="Body Fat % (if known)"
            type="number"
            placeholder="15"
            value={data.bodyFatPercent || ''}
            onChange={(e) => onChange({ bodyFatPercent: e.target.value ? Number(e.target.value) : null })}
            suffix="%"
          />

          {/* Body Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Body Type (optional)</label>
            <div className="space-y-2">
              {bodyTypes.map((type) => (
                <RadioCard
                  key={type.id}
                  selected={data.bodyType === type.id}
                  onClick={() => onChange({ bodyType: data.bodyType === type.id ? null : type.id })}
                  icon={type.icon}
                  title={type.title}
                  description={type.description}
                />
              ))}
            </div>
          </div>

          {/* Current Baseline */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Diet Baseline</h2>

            <Input
              label="Estimated daily calories (if known)"
              type="number"
              placeholder="2000"
              value={data.currentCalories || ''}
              onChange={(e) => onChange({ currentCalories: e.target.value ? Number(e.target.value) : null })}
              suffix="cal"
            />

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current protein intake</label>
              <div className="flex gap-2">
                {proteinLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => onChange({ currentProtein: level.id })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${data.currentProtein === level.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Daily water intake</label>
              <div className="flex gap-2">
                {waterLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => onChange({ waterIntake: level.id })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${data.waterIntake === level.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <Button fullWidth size="lg" onClick={onNext} disabled={!canProceed}>
          Continue
        </Button>
      </div>
    </div>
  );
}
