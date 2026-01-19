import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { ProgressBar } from '../../ui/ProgressBar';
import { workSchedules, fastingOptions } from '../../../data/options';
import type { AdvancedFormData, SleepQuality, StressLevel, Frequency } from '../../../types';

interface AdvancedLifestyleScreenProps {
  data: AdvancedFormData;
  onChange: (data: Partial<AdvancedFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const sleepQualities = [
  { id: 'poor', label: 'Poor' },
  { id: 'average', label: 'Average' },
  { id: 'good', label: 'Good' },
  { id: 'excellent', label: 'Excellent' },
] as const;

const stressLevels = [
  { id: 'low', label: 'Low' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'high', label: 'High' },
  { id: 'very_high', label: 'Very High' },
] as const;

const frequencies = [
  { id: 'none', label: 'None' },
  { id: 'occasional', label: '1-2/week' },
  { id: 'regular', label: '3+/week' },
] as const;

const eatingOutOptions = [
  { id: 'none', label: 'Rarely' },
  { id: 'occasional', label: '1-2x/week' },
  { id: 'frequent', label: '3+/week' },
] as const;

const cookingForOptions = [
  { id: 'self', label: 'Just me' },
  { id: 'partner', label: 'Partner' },
  { id: 'family', label: 'Family' },
] as const;

export function AdvancedLifestyleScreen({ data, onChange, onNext, onBack }: AdvancedLifestyleScreenProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <ProgressBar current={5} total={8} label="Step 5 of 8 - Lifestyle" />
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

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Lifestyle & Timing</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Help us understand your daily routine</p>

        {/* Sleep Schedule */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Sleep Schedule</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input
            label="Wake up time"
            type="time"
            value={data.wakeTime}
            onChange={(e) => onChange({ wakeTime: e.target.value })}
          />
          <Input
            label="Bedtime"
            type="time"
            value={data.sleepTime}
            onChange={(e) => onChange({ sleepTime: e.target.value })}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sleep quality</label>
          <div className="flex gap-2">
            {sleepQualities.map((q) => (
              <button
                key={q.id}
                onClick={() => onChange({ sleepQuality: q.id as SleepQuality })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${data.sleepQuality === q.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Work & Stress */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Work & Stress</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Work schedule</label>
          <div className="flex flex-wrap gap-2">
            {workSchedules.map((w) => (
              <button
                key={w.id}
                onClick={() => onChange({ workSchedule: w.id })}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all
                  ${data.workSchedule === w.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stress level</label>
          <div className="flex gap-2">
            {stressLevels.map((s) => (
              <button
                key={s.id}
                onClick={() => onChange({ stressLevel: s.id as StressLevel })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${data.stressLevel === s.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Intermittent Fasting */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Intermittent Fasting</h2>
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {fastingOptions.map((f) => (
              <button
                key={f.id}
                onClick={() => onChange({ intermittentFasting: f.id })}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all
                  ${data.intermittentFasting === f.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lifestyle Factors */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Lifestyle Factors</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alcohol consumption</label>
          <div className="flex gap-2">
            {frequencies.map((f) => (
              <button
                key={f.id}
                onClick={() => onChange({ alcohol: f.id as Frequency })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${data.alcohol === f.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Eating out frequency</label>
          <div className="flex gap-2">
            {eatingOutOptions.map((e) => (
              <button
                key={e.id}
                onClick={() => onChange({ eatingOut: e.id as Frequency })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${data.eatingOut === e.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cooking for</label>
          <div className="flex gap-2">
            {cookingForOptions.map((c) => (
              <button
                key={c.id}
                onClick={() => onChange({ cookingFor: c.id as 'self' | 'partner' | 'family' })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${data.cookingFor === c.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <Button fullWidth size="lg" onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}
