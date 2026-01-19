import { useEffect } from 'react';
import { RadioCard } from '../../ui/RadioCard';
import { CheckboxGroup } from '../../ui/CheckboxGroup';
import { NumberSelect } from '../../ui/NumberSelect';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { ProgressBar } from '../../ui/ProgressBar';
import { simpleProteinOptions } from '../../../data/options';
import type { SimpleFormData } from '../../../types';

interface SimpleFoodScreenProps {
  data: SimpleFormData;
  onChange: (data: Partial<SimpleFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const restrictions = [
  { id: 'none', icon: '✅', title: 'None', description: 'I eat everything' },
  { id: 'vegetarian', icon: '🥬', title: 'Vegetarian', description: 'No meat' },
  { id: 'vegan', icon: '🌱', title: 'Vegan', description: 'No animal products' },
  { id: 'other', icon: '📝', title: 'Other', description: 'Specify below' },
] as const;

const cookingLevels = [
  { id: 'basic', icon: '🍳', title: 'Basic', description: 'Keep it simple' },
  { id: 'can_cook', icon: '👨‍🍳', title: 'I Can Cook', description: 'Any recipe is fine' },
] as const;

export function SimpleFoodScreen({ data, onChange, onNext, onBack }: SimpleFoodScreenProps) {
  const canProceed = data.dietaryRestriction && data.cookingLevel && data.proteins.length > 0;

  // Auto-select restriction based on preset
  useEffect(() => {
    if (data.preset === 'vegan' && data.dietaryRestriction !== 'vegan') {
      onChange({ dietaryRestriction: 'vegan' });
    } else if (data.preset === 'vegetarian' && data.dietaryRestriction !== 'vegetarian') {
      onChange({ dietaryRestriction: 'vegetarian' }); // Note: 'vegetarian' preset doesn't exist yet but good to handle if added
    }
  }, [data.preset, data.dietaryRestriction, onChange]);

  // Filter proteins based on restriction
  const filteredProteins = simpleProteinOptions.filter(p => {
    if (data.dietaryRestriction === 'vegan') {
      return !['chicken', 'beef', 'fish', 'eggs', 'greek_yogurt', 'cottage_cheese'].includes(p.id);
    }
    if (data.dietaryRestriction === 'vegetarian') {
      return !['chicken', 'beef', 'fish'].includes(p.id);
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <ProgressBar current={3} total={4} />
      </div>

      {/* Content */}
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

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Food Preferences
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          What can you eat?
        </p>

        {/* Dietary Restrictions */}
        <div className="space-y-3 mb-6">
          {restrictions.map((r) => (
            <RadioCard
              key={r.id}
              selected={data.dietaryRestriction === r.id}
              onClick={() => {
                // Clear proteins if switching to a restrictive diet to avoid invalid selections
                if (r.id === 'vegan' || r.id === 'vegetarian') {
                  onChange({ dietaryRestriction: r.id, proteins: [] });
                } else {
                  onChange({ dietaryRestriction: r.id });
                }
              }}
              icon={r.icon}
              title={r.title}
              description={r.description}
            />
          ))}
        </div>

        {data.dietaryRestriction === 'other' && (
          <div className="mb-6">
            <Input
              placeholder="e.g., Gluten free, dairy free..."
              value={data.otherRestriction}
              onChange={(e) => onChange({ otherRestriction: e.target.value })}
            />
          </div>
        )}

        {/* Protein Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Favorite Proteins
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Select all you enjoy</p>
          <CheckboxGroup
            options={filteredProteins}
            selected={data.proteins}
            onChange={(proteins) => onChange({ proteins })}
            columns={2}
          />
          <div className="mt-3">
            <Input
              placeholder="Any other proteins? (e.g. Seitan, Lentils)"
              value={data.otherProtein || ''}
              onChange={(e) => onChange({ otherProtein: e.target.value })}
            />
          </div>
        </div>

        {/* Cooking Level */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            How's your cooking?
          </h2>
          <div className="space-y-3">
            {cookingLevels.map((level) => (
              <RadioCard
                key={level.id}
                selected={data.cookingLevel === level.id}
                onClick={() => onChange({ cookingLevel: level.id })}
                icon={level.icon}
                title={level.title}
                description={level.description}
              />
            ))}
          </div>
        </div>

        {/* Meals per day */}
        <NumberSelect
          label="Meals per day"
          value={data.mealsPerDay}
          onChange={(mealsPerDay) => onChange({ mealsPerDay })}
          options={[3, 4, 5]}
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <Button fullWidth size="lg" onClick={onNext} disabled={!canProceed}>
          Generate My Prompt
        </Button>
      </div>
    </div>
  );
}
