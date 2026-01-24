import { useState, useEffect } from 'react';
import type { DietPlan, DayOfWeek, Meal } from '../../types/diet';
import { updateDietPlan } from '../../services/ai';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { MealEditorModal } from '../MealEditorModal';
import { useUser } from '../../hooks/useUser';

interface DietDashboardScreenProps {
  generatePlan?: () => Promise<DietPlan>;
  initialPlan?: DietPlan;
  dayName?: DayOfWeek;
  onBack: () => void;
  onSave?: (plan: DietPlan) => void;
  onCopyToDays?: (days: DayOfWeek[]) => void;
  occupiedDays?: DayOfWeek[];
  // For burger menu navigation guard
  pendingNavigation?: (() => void) | null;
  onClearPendingNavigation?: () => void;
}

const daysList: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Module-level promise cache to prevent StrictMode double-generation
// Stores the in-flight promise so we can reuse it across remounts
let pendingGeneration: Promise<DietPlan> | null = null;

export function DietDashboardScreen({ generatePlan, initialPlan, dayName, onBack, onSave, onCopyToDays, occupiedDays = [], pendingNavigation, onClearPendingNavigation }: DietDashboardScreenProps) {
  const { userId } = useUser();
  const [plan, setPlan] = useState<DietPlan | null>(initialPlan || null);
  const [loading, setLoading] = useState(!initialPlan && !!generatePlan);
  const [updating, setUpdating] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [editingMeal, setEditingMeal] = useState<{ meal: Meal; index: number } | null>(null);

  // Track if plan has been saved to a day (already saved if viewing existing day)
  const [hasSaved, setHasSaved] = useState(!!dayName);
  const [flashCopyButton, setFlashCopyButton] = useState(false);

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'primary';
    confirmText?: string;
    cancelText?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Initial generation with promise caching to prevent StrictMode double-call
  useEffect(() => {
    if (initialPlan || !generatePlan) return;

    const load = async () => {
      try {
        // Reuse in-flight promise if exists, otherwise start new generation
        if (!pendingGeneration) {
          pendingGeneration = generatePlan();
        }
        const generated = await pendingGeneration;
        setPlan(generated);
        setLoading(false);
        onSave?.(generated);
      } catch (err) {
        console.error(err);
        setError('Failed to generate plan. Please try again.');
        setLoading(false);
      } finally {
        pendingGeneration = null; // Clear for next generation
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = async () => {
    if (!chatInput.trim() || !plan) return;
    setUpdating(true);
    try {
      const updated = await updateDietPlan(plan, chatInput, userId || undefined);
      setPlan(updated);
      onSave?.(updated);
      setChatInput('');
    } catch (err) {
        console.error(err);
      setModalConfig({
        isOpen: true,
        title: 'Error',
        message: 'Failed to update plan. Please try again.',
        onConfirm: () => {},
      });
    } finally {
      setUpdating(false);
    }
  };

  const toggleDaySelection = (day: DayOfWeek) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  // Handle back button - warn if plan not saved
  const handleBack = () => {
    if (!hasSaved && plan) {
      setModalConfig({
        isOpen: true,
        title: 'Unsaved Plan',
        message: 'You haven\'t saved this plan to any day yet. Use "Copy to..." to save it.',
        variant: 'danger',
        confirmText: 'Leave Anyway',
        cancelText: 'Stay & Save',
        onConfirm: () => {
          // User chose to leave anyway
          onBack();
        },
      });
    } else {
      onBack();
    }
  };

  // Flash the copy button when modal closes without saving
  const triggerCopyFlash = () => {
    setFlashCopyButton(true);
    setTimeout(() => setFlashCopyButton(false), 1500); // 3 flashes at 500ms each
  };

  // Handle burger menu navigation attempts
  useEffect(() => {
    if (pendingNavigation && !hasSaved && plan) {
      // Show the unsaved modal
      setModalConfig({
        isOpen: true,
        title: 'Unsaved Plan',
        message: 'You haven\'t saved this plan to any day yet. Use "Copy to..." to save it.',
        variant: 'danger',
        confirmText: 'Leave Anyway',
        cancelText: 'Stay & Save',
        onConfirm: () => {
          pendingNavigation();
          onClearPendingNavigation?.();
        },
      });
    } else if (pendingNavigation && (hasSaved || !plan)) {
      // Already saved or no plan, just navigate
      pendingNavigation();
      onClearPendingNavigation?.();
    }
  }, [pendingNavigation]);

  const handleCopySelected = () => {
    if (selectedDays.length === 0 || !onCopyToDays || !plan) return;

    const hasOccupied = selectedDays.some(day => occupiedDays.includes(day));

    const performCopy = () => {
      onCopyToDays(selectedDays);
      const dayNames = selectedDays.length === 1 ? selectedDays[0] : `${selectedDays.length} days`;
      setModalConfig({
        isOpen: true,
        title: 'Success!',
        message: `Your diet plan has been copied to ${dayNames}.`,
        onConfirm: () => {},
      });
      setSelectedDays([]);
      setShowCopyMenu(false);
    };

    if (hasOccupied) {
      const occupiedSelected = selectedDays.filter(day => occupiedDays.includes(day));
      setModalConfig({
        isOpen: true,
        title: 'Overwrite Plans?',
        message: `Diet plans already exist for ${occupiedSelected.join(', ')}. Are you sure you want to replace them?`,
        variant: 'danger',
        onConfirm: () => {
          performCopy();
          setHasSaved(true);
        },
      });
    } else {
      performCopy();
      setHasSaved(true);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner
        title="Generating your perfect diet..."
        subtitle="Consulting the AI nutritionist"
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
        <h2 className="text-xl font-bold text-red-500 mb-4">{error}</h2>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 pb-24">
       {/* Updating Overlay */}
       {updating && (
         <LoadingSpinner
           title="Updating your diet..."
           subtitle="Making changes"
           overlay
         />
       )}

       {/* Modal Container */}
       <Modal
          isOpen={modalConfig.isOpen}
          onClose={() => {
            // If closing the unsaved plan modal without confirming, flash the copy button
            if (modalConfig.title === 'Unsaved Plan') {
              triggerCopyFlash();
              onClearPendingNavigation?.(); // Clear any pending burger menu navigation
            }
            setModalConfig(prev => ({ ...prev, isOpen: false }));
          }}
          onConfirm={modalConfig.onConfirm}
          title={modalConfig.title}
          message={modalConfig.message}
          variant={modalConfig.variant}
          confirmText={modalConfig.confirmText}
          cancelText={modalConfig.cancelText}
       />

       {/* Meal Editor Modal */}
       {editingMeal && (
         <MealEditorModal
           isOpen={!!editingMeal}
           onClose={() => setEditingMeal(null)}
           meal={editingMeal.meal}
           mealIndex={editingMeal.index}
           dailyTargets={plan.dailyTargets}
           onMealUpdated={(updatedMeal, index) => {
             const newMeals = [...plan.meals];
             newMeals[index] = updatedMeal;
             const newPlan = { ...plan, meals: newMeals };
             setPlan(newPlan);
             onSave?.(newPlan);
             setEditingMeal(null);
           }}
         />
       )}

       {/* Dashboard Header */}
       <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-30 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                {dayName ? dayName : 'New Diet Plan'}
              </h1>
              <p className="text-xs text-gray-500">AI Powered</p>
            </div>
          </div>
          <div className="relative mr-[40px]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCopyMenu(!showCopyMenu)}
              className={flashCopyButton ? 'animate-flash-green' : ''}
            >
              Copy to...
            </Button>
            
            {showCopyMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Select Days
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                  {daysList.filter(d => d !== dayName).map(day => {
                    const isOccupied = occupiedDays.includes(day);
                    const isSelected = selectedDays.includes(day);
                    return (
                      <label
                        key={day}
                        className="w-full px-4 py-3 text-sm hover:bg-primary/5 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0 flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleDaySelection(day)}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="font-medium flex-1">{day}</span>
                        {isOccupied && (
                          <span className="text-[10px] bg-primary/10 dark:bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                            Exists
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
                <div className="p-3 border-t border-gray-100 dark:border-gray-800">
                  <Button
                    size="sm"
                    className="w-full"
                    disabled={selectedDays.length === 0}
                    onClick={handleCopySelected}
                  >
                    Copy to {selectedDays.length === 0 ? 'Selected' : selectedDays.length === 1 ? '1 Day' : `${selectedDays.length} Days`}
                  </Button>
                </div>
              </div>
            )}
          </div>
       </div>

       <div className="flex-1 overflow-auto p-4 space-y-6">
          {/* Summary */}
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold mb-2">Summary</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{plan.summary}</p>
          </div>

          {/* Daily Targets */}
          <div className="grid grid-cols-2 gap-3">
             <MacroCard label="Calories" value={plan.dailyTargets.calories} unit="kcal" />
             <MacroCard label="Protein" value={plan.dailyTargets.protein} unit="g" />
             <MacroCard label="Carbs" value={plan.dailyTargets.carbs} unit="g" />
             <MacroCard label="Fats" value={plan.dailyTargets.fats} unit="g" />
          </div>

          {/* Meals */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Daily Schedule</h3>
            {plan.meals.map((meal, idx) => (
              <div
                key={idx}
                onClick={() => setEditingMeal({ meal, index: idx })}
                className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:ring-2 hover:ring-primary/50 hover:border-primary/50 transition-all active:scale-[0.99]"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-primary text-lg flex items-center gap-2">
                      {meal.name}
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </h4>
                    {meal.time && <span className="text-xs text-gray-500 font-medium">{meal.time}</span>}
                  </div>
                  {meal.totalMacros && (
                     <div className="text-right">
                       <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                         {meal.totalMacros.calories} kcal
                       </span>
                       <div className="flex gap-2 mt-1 text-[10px] text-gray-500">
                         <span>{meal.totalMacros.protein}g protein</span>
                         <span>{meal.totalMacros.carbs}g carbs</span>
                         <span>{meal.totalMacros.fats}g fat</span>
                       </div>
                     </div>
                  )}
                </div>

                <ul className="space-y-2 mb-3">
                  {meal.items.map((item, i) => (
                    <li key={i} className="flex justify-between text-sm border-b border-gray-50 dark:border-gray-800 last:border-0 pb-1 last:pb-0">
                      <span>{item.name}</span>
                      <span className="text-gray-500">{item.amount}</span>
                    </li>
                  ))}
                </ul>

                {meal.instructions && (
                  <p className="text-xs text-gray-500 italic border-t border-gray-100 dark:border-gray-800 pt-2 mt-2">
                    Tip: {meal.instructions}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Tips */}
          {plan.tips && plan.tips.length > 0 && (
            <div className="bg-primary-light dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-xl p-4">
              <h3 className="font-semibold text-primary-dark dark:text-primary mb-2">Pro Tips</h3>
              <ul className="text-sm text-primary-dark dark:text-primary/80 space-y-1">
                {plan.tips.map((tip, idx) => (
                  <li key={idx}>• {tip}</li>
                ))}
              </ul>
            </div>
          )}
       </div>

       {/* Chat Interface */}
       <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 fixed bottom-0 w-full left-0 z-20">
          <div className="max-w-md mx-auto w-full">
            <div className="flex gap-2">
                <Input 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                placeholder="e.g. Swap chicken for tofu..." 
                disabled={updating}
                />
                <Button onClick={handleUpdate} disabled={updating || !chatInput.trim()}>
                {updating ? '...' : 'Update'}
                </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
                Ask the AI to adjust meals, macros, or swap ingredients.
            </p>
          </div>
       </div>
    </div>
  );
}

function MacroCard({ label, value, unit }: { label: string, value: number, unit: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-xl font-bold text-primary">
        {value}<span className="text-xs font-normal text-gray-400 ml-1">{unit}</span>
      </div>
    </div>
  );
}
