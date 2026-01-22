import { CheckboxGroup } from '../../ui/CheckboxGroup';
import { TextArea } from '../../ui/TextArea';
import { Button } from '../../ui/Button';
import { ProgressBar } from '../../ui/ProgressBar';
import { BackButton } from '../../ui/BackButton';
import {
  dietaryRestrictions,
  proteinOptions,
  carbOptions,
  vegetableOptions,
  fatOptions,
} from '../../../data/options';
import type { AdvancedFormData } from '../../../types';

interface AdvancedFoodScreenProps {
  data: AdvancedFormData;
  onChange: (data: Partial<AdvancedFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AdvancedFoodScreen({ data, onChange, onNext, onBack }: AdvancedFoodScreenProps) {
  const canProceed = data.preferredProteins.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Back button then Progress bar */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 space-y-4">
        <BackButton onClick={onBack} />
        <ProgressBar current={4} total={8} label="Step 4 of 8 - Food Preferences" />
      </div>

      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Food Preferences</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Select foods you enjoy eating</p>

        {/* Dietary Restrictions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Dietary Restrictions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Select all that apply</p>
          <CheckboxGroup
            options={dietaryRestrictions}
            selected={data.dietaryRestrictions}
            onChange={(restrictions) => onChange({ dietaryRestrictions: restrictions })}
            columns={2}
          />
        </div>

        <TextArea
          label="Other allergies or restrictions"
          placeholder="e.g., soy allergy, histamine intolerance..."
          value={data.otherAllergies}
          onChange={(e) => onChange({ otherAllergies: e.target.value })}
          className="mb-6"
        />

        <TextArea
          label="Foods you HATE (will be avoided)"
          placeholder="e.g., brussels sprouts, liver, cottage cheese..."
          value={data.foodsToAvoid}
          onChange={(e) => onChange({ foodsToAvoid: e.target.value })}
          className="mb-6"
        />

        {/* Proteins */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Preferred Proteins</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Select all you enjoy</p>
          <CheckboxGroup
            options={proteinOptions}
            selected={data.preferredProteins}
            onChange={(proteins) => onChange({ preferredProteins: proteins })}
            columns={2}
          />
        </div>

        {/* Carbs */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Preferred Carbs</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Select all you enjoy</p>
          <CheckboxGroup
            options={carbOptions}
            selected={data.preferredCarbs}
            onChange={(carbs) => onChange({ preferredCarbs: carbs })}
            columns={2}
          />
        </div>

        {/* Vegetables */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Preferred Vegetables</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Select all you enjoy</p>
          <CheckboxGroup
            options={vegetableOptions}
            selected={data.preferredVegetables}
            onChange={(veggies) => onChange({ preferredVegetables: veggies })}
            columns={2}
          />
        </div>

        {/* Fats */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Preferred Healthy Fats</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Select all you enjoy</p>
          <CheckboxGroup
            options={fatOptions}
            selected={data.preferredFats}
            onChange={(fats) => onChange({ preferredFats: fats })}
            columns={2}
          />
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
