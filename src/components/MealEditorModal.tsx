import { useState, useEffect } from 'react';
import type { Meal, Macro } from '../types/diet';
import { updateMeal } from '../services/ai';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface MealEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: Meal;
  mealIndex: number;
  dailyTargets: Macro;
  onMealUpdated: (updatedMeal: Meal, index: number) => void;
}

export function MealEditorModal({
  isOpen,
  onClose,
  meal,
  mealIndex,
  dailyTargets,
  onMealUpdated,
}: MealEditorModalProps) {
  const [instruction, setInstruction] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens with new meal
  useEffect(() => {
    if (isOpen) {
      setInstruction('');
      setError(null);
    }
  }, [isOpen, meal]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !updating) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, updating]);

  const handleUpdate = async () => {
    if (!instruction.trim()) return;

    setUpdating(true);
    setError(null);

    try {
      const updated = await updateMeal(meal, instruction, dailyTargets);
      onMealUpdated(updated, mealIndex);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to update meal. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && instruction.trim() && !updating) {
      e.preventDefault();
      handleUpdate();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => !updating && onClose()}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => !updating && onClose()}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              disabled={updating}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h2 className="font-bold text-lg">Edit {meal.name}</h2>
              {meal.time && <p className="text-xs text-gray-500">{meal.time}</p>}
            </div>
          </div>
          <button
            onClick={() => !updating && onClose()}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            disabled={updating}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Current Items */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Current Items</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 space-y-2">
              {meal.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="text-gray-500">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Macros */}
          {meal.totalMacros && (
            <div className="flex gap-2 text-xs">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                {meal.totalMacros.calories} kcal
              </span>
              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                {meal.totalMacros.protein}g P
              </span>
              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                {meal.totalMacros.carbs}g C
              </span>
              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                {meal.totalMacros.fats}g F
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl">
              {error}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            What do you want to change?
          </label>
          <div className="flex gap-2">
            <Input
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., swap eggs for bacon..."
              disabled={updating}
              autoFocus
            />
            <Button
              onClick={handleUpdate}
              disabled={updating || !instruction.trim()}
            >
              {updating ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                'Update'
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Press Enter to submit
          </p>
        </div>
      </div>
    </div>
  );
}
