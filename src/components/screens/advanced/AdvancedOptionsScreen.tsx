import { NumberSelect } from '../../ui/NumberSelect';
import { Toggle } from '../../ui/Toggle';
import { CheckboxGroup } from '../../ui/CheckboxGroup';
import { TextArea } from '../../ui/TextArea';
import { Button } from '../../ui/Button';
import { ProgressBar } from '../../ui/ProgressBar';
import { supplements } from '../../../data/options';
import type { AdvancedFormData, CookingLevel, Budget, MealPrepStyle } from '../../../types';

interface AdvancedOptionsScreenProps {
  data: AdvancedFormData;
  onChange: (data: Partial<AdvancedFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const cookingLevels = [
  { id: 'minimal', label: 'Minimal' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'advanced', label: 'Advanced' },
] as const;

const budgets = [
  { id: 'budget', label: 'Budget' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'unlimited', label: 'Unlimited' },
] as const;

const mealPrepStyles = [
  { id: 'fresh', label: 'Fresh daily' },
  { id: 'batch', label: 'Batch cook' },
  { id: 'mix', label: 'Mix of both' },
] as const;

const cheatOptions = [
  { id: 'no', label: 'No' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'biweekly', label: 'Bi-weekly' },
] as const;

const workoutNutrition = [
  { id: 'real_food', label: 'Real food' },
  { id: 'shakes', label: 'Shakes OK' },
  { id: 'no_preference', label: 'No preference' },
] as const;

const caffeineOptions = [
  { id: 'none', label: 'None' },
  { id: 'light', label: '1/day' },
  { id: 'moderate', label: '2-3/day' },
  { id: 'heavy', label: '4+/day' },
] as const;

export function AdvancedOptionsScreen({ data, onChange, onNext, onBack }: AdvancedOptionsScreenProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <ProgressBar current={7} total={8} label="Step 7 of 8 - Final Options" />
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

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Final Preferences</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Almost done! Just a few more details</p>

        {/* Meal Structure */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Meal Structure</h2>

        <NumberSelect
          label="Meals per day"
          value={data.mealsPerDay}
          onChange={(v) => onChange({ mealsPerDay: v })}
          options={[2, 3, 4, 5, 6]}
        />

        <div className="mt-4 mb-4">
          <Toggle
            enabled={data.includeSnacks}
            onChange={(v) => onChange({ includeSnacks: v })}
            label="Include snacks"
            description="Add healthy snacks between meals"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cheat meal / refeed?</label>
          <div className="flex gap-2">
            {cheatOptions.map((c) => (
              <button
                key={c.id}
                onClick={() => onChange({ cheatMeal: c.id as 'no' | 'weekly' | 'biweekly' })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${data.cheatMeal === c.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cooking & Budget */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Cooking & Budget</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meal prep style</label>
          <div className="flex gap-2">
            {mealPrepStyles.map((m) => (
              <button
                key={m.id}
                onClick={() => onChange({ mealPrepStyle: m.id as MealPrepStyle })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${data.mealPrepStyle === m.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cooking ability</label>
          <div className="flex gap-2">
            {cookingLevels.map((c) => (
              <button
                key={c.id}
                onClick={() => onChange({ cookingAbility: c.id as CookingLevel })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${data.cookingAbility === c.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Budget</label>
          <div className="flex gap-2">
            {budgets.map((b) => (
              <button
                key={b.id}
                onClick={() => onChange({ budget: b.id as Budget })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${data.budget === b.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Workout Nutrition */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pre/post workout nutrition</label>
          <div className="flex gap-2">
            {workoutNutrition.map((w) => (
              <button
                key={w.id}
                onClick={() => onChange({ prePostWorkout: w.id as 'real_food' | 'shakes' | 'no_preference' })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${data.prePostWorkout === w.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        {/* Supplements */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Current Supplements</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Select any you're currently taking</p>
          <CheckboxGroup
            options={supplements}
            selected={data.supplements}
            onChange={(s) => onChange({ supplements: s })}
            columns={2}
          />
        </div>

        {/* Caffeine */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Caffeine intake (coffees/day)</label>
          <div className="flex gap-2">
            {caffeineOptions.map((c) => (
              <button
                key={c.id}
                onClick={() => onChange({ caffeineIntake: c.id as 'none' | 'light' | 'moderate' | 'heavy' })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${data.caffeineIntake === c.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Special Requests */}
        <TextArea
          label="Anything else the AI should know?"
          placeholder="e.g., I have a wedding in 3 months, I travel every other week..."
          value={data.specialRequests}
          onChange={(e) => onChange({ specialRequests: e.target.value })}
          className="mb-6"
        />

        {/* AI Flexibility */}
        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Toggle
            enabled={data.allowAiFlexibility}
            onChange={(v) => onChange({ allowAiFlexibility: v })}
            label="Allow AI suggestions"
            description="Let AI suggest additional foods for optimal nutrition"
          />
          <Toggle
            enabled={data.allowSupplementRecs}
            onChange={(v) => onChange({ allowSupplementRecs: v })}
            label="Allow supplement recommendations"
            description="Let AI recommend supplements if beneficial"
          />
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <Button fullWidth size="lg" onClick={onNext}>
          Generate My Diet
        </Button>
      </div>
    </div>
  );
}
