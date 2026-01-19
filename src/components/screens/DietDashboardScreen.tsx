import { useState, useEffect } from 'react';
import type { DietPlan } from '../../types/diet';
import { updateDietPlan } from '../../services/ai';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface DietDashboardScreenProps {
  generatePlan: () => Promise<DietPlan>;
  onBack: () => void;
}

export function DietDashboardScreen({ generatePlan, onBack }: DietDashboardScreenProps) {
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Initial generation
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const generated = await generatePlan();
        if (mounted) {
          setPlan(generated);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (mounted) {
          setError('Failed to generate plan. Please try again.');
          setLoading(false);
        }
      }
    };
    load();
    return () => { mounted = false; };
  }, [generatePlan]);

  const handleUpdate = async () => {
    if (!chatInput.trim() || !plan) return;
    setUpdating(true);
    try {
      const updated = await updateDietPlan(plan, chatInput);
      setPlan(updated);
      setChatInput('');
    } catch (err) {
        console.error(err);
      alert('Failed to update plan.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
        <div className="animate-spin text-4xl mb-4">🥗</div>
        <h2 className="text-xl font-bold">Generating your perfect diet...</h2>
        <p className="text-gray-500">Consulting the AI nutritionist</p>
      </div>
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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
       {/* Dashboard Header */}
       <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Your Diet Plan</h1>
            <p className="text-xs text-gray-500">AI Generated • Dynamic</p>
          </div>
          <button onClick={onBack} className="text-sm text-gray-500 hover:text-red-500 transition-colors">Exit</button>
       </div>

       <div className="flex-1 overflow-auto p-4 space-y-6 pb-24">
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
              <div key={idx} className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-primary text-lg">{meal.name}</h4>
                    {meal.time && <span className="text-xs text-gray-500 font-medium">{meal.time}</span>}
                  </div>
                  {meal.totalMacros && (
                     <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                       {meal.totalMacros.calories} kcal
                     </span>
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
