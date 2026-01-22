import { CheckboxGroup } from '../../ui/CheckboxGroup';
import { TextArea } from '../../ui/TextArea';
import { Button } from '../../ui/Button';
import { ProgressBar } from '../../ui/ProgressBar';
import { BackButton } from '../../ui/BackButton';
import { struggles, previousDiets } from '../../../data/options';
import type { AdvancedFormData } from '../../../types';

interface AdvancedProblemsScreenProps {
  data: AdvancedFormData;
  onChange: (data: Partial<AdvancedFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AdvancedProblemsScreen({ data, onChange, onNext, onBack }: AdvancedProblemsScreenProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Back button then Progress bar */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 space-y-4">
        <BackButton onClick={onBack} />
        <ProgressBar current={6} total={8} label="Step 6 of 8 - Challenges" />
      </div>

      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Challenges & History</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Understanding your struggles helps create a better plan</p>

        {/* Struggles */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Biggest Nutrition Struggles</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Select all that apply</p>
          <CheckboxGroup
            options={struggles}
            selected={data.struggles}
            onChange={(s) => onChange({ struggles: s })}
            columns={1}
          />
        </div>

        {/* Previous Diets */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Previous Diet Experience</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">What have you tried before?</p>
          <CheckboxGroup
            options={previousDiets}
            selected={data.previousDiets}
            onChange={(d) => onChange({ previousDiets: d })}
            columns={2}
          />
        </div>

        {/* What Worked */}
        <TextArea
          label="What worked before? (optional)"
          placeholder="e.g., Meal prepping on Sundays, eating the same breakfast daily..."
          value={data.whatWorked}
          onChange={(e) => onChange({ whatWorked: e.target.value })}
          className="mb-4"
        />

        {/* What Didn't Work */}
        <TextArea
          label="What didn't work? (optional)"
          placeholder="e.g., Counting every calorie, eating 6 meals a day..."
          value={data.whatDidntWork}
          onChange={(e) => onChange({ whatDidntWork: e.target.value })}
        />
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <Button fullWidth size="lg" onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}
