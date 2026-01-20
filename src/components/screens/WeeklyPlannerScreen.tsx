import { useState } from 'react';
import type { DayOfWeek, WeeklySchedule } from '../../types/diet';
import { generateShoppingList } from '../../services/ai';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface WeeklyPlannerScreenProps {
  schedule: WeeklySchedule;
  onSelectDay: (day: DayOfWeek) => void;
  onClearDay: (day: DayOfWeek) => void;
  onGenerateNew: () => void;
}

const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function WeeklyPlannerScreen({ schedule, onSelectDay, onClearDay, onGenerateNew }: WeeklyPlannerScreenProps) {
  const hasAnyPlans = Object.values(schedule).some(p => p !== null);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    day: DayOfWeek | null;
  }>({
    isOpen: false,
    day: null,
  });

  const [shoppingListModal, setShoppingListModal] = useState(false);
  const [shoppingListLoading, setShoppingListLoading] = useState(false);
  const [shoppingListContent, setShoppingListContent] = useState<string>('');

  const handleDeleteClick = (e: React.MouseEvent, day: DayOfWeek) => {
    e.stopPropagation();
    setModalConfig({ isOpen: true, day });
  };

  const handleGenerateList = async () => {
    setShoppingListModal(true);
    setShoppingListLoading(true);
    setShoppingListContent('');

    const rawItems: string[] = [];
    days.forEach(day => {
      const plan = schedule[day];
      if (plan) {
        plan.meals.forEach(meal => {
          meal.items.forEach(item => {
            rawItems.push(`${item.amount} ${item.name}`);
          });
        });
      }
    });

    try {
      const list = await generateShoppingList(rawItems);
      setShoppingListContent(list);
    } catch (err) {
      console.error(err);
      setShoppingListContent("Error generating list. Please try again.");
    } finally {
      setShoppingListLoading(false);
    }
  };

  const isFullWeek = days.every(day => schedule[day] !== null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 pb-24">
      {/* Modal Container */}
      <Modal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ isOpen: false, day: null })}
        onConfirm={() => modalConfig.day && onClearDay(modalConfig.day)}
        title="Clear Day?"
        message={`Are you sure you want to remove the diet plan for ${modalConfig.day}? This action cannot be undone.`}
        variant="danger"
        confirmText="Clear Plan"
      />

      {/* Shopping List Modal */}
      {shoppingListModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShoppingListModal(false)} />
           <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
             <div className="p-6 border-b border-gray-100 dark:border-gray-800">
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Shopping List</h3>
               <p className="text-sm text-gray-500">AI-Optimized List</p>
             </div>
             
             <div className="flex-1 overflow-auto p-6">
               {shoppingListLoading ? (
                 <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                   <div className="animate-spin text-3xl mb-3">🛒</div>
                   <p className="text-sm animate-pulse">Organizing your ingredients...</p>
                 </div>
               ) : (
                 <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                   {shoppingListContent.split('\n').map((line, i) => {
                     const trimmed = line.trim();
                     if (trimmed === '') return null;

                     // Headers (### **Category**)
                     if (trimmed.startsWith('###')) {
                       const title = trimmed.replace(/[#\*]/g, '').trim();
                       return <h4 key={i} className="text-base font-bold text-primary mt-6 mb-2 border-b border-primary/10 pb-1">{title}</h4>;
                     }

                     // List Items (* **Item:** Details)
                     if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
                        const content = trimmed.replace(/^[\*\-]\s*/, '');
                        // Handle bold parts: **Item:**
                        const parts = content.split('**');
                        if (parts.length >= 3) {
                            return (
                                <div key={i} className="flex items-start gap-2 ml-1 my-1">
                                    <span className="text-primary/60 mt-1.5 text-[10px]">●</span>
                                    <span className="leading-relaxed">
                                        <strong className="text-gray-900 dark:text-gray-100">{parts[1]}</strong>
                                        {parts[2]}
                                    </span>
                                </div>
                            );
                        }
                        return (
                           <div key={i} className="flex items-start gap-2 ml-1 my-1">
                               <span className="text-primary/60 mt-1.5 text-[10px]">●</span>
                               <span className="leading-relaxed italic text-gray-500">{content.replace(/\*/g, '')}</span>
                           </div>
                        );
                     }
                     
                     return <p key={i} className="text-gray-500 dark:text-gray-400 italic mb-2">{trimmed.replace(/\*/g, '')}</p>;
                   })}
                 </div>
               )}
             </div>

             <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
               <Button variant="outline" onClick={() => {
                  navigator.clipboard.writeText(shoppingListContent);
                  alert('Copied to clipboard!');
               }} disabled={shoppingListLoading}>Copy</Button>
               <Button onClick={() => setShoppingListModal(false)}>Close</Button>
             </div>
           </div>
         </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-30 flex justify-between items-center">
        <div>
           <h1 className="text-xl font-bold flex items-center gap-2">Your Week</h1>
           <p className="text-xs text-gray-500">7 Day Overview</p>
        </div>
        <div className="mr-[35px] flex gap-2">
          {isFullWeek && (
            <Button variant="secondary" size="sm" onClick={handleGenerateList}>
              🛒 List
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onGenerateNew}>
            + New Plan
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 max-w-md mx-auto w-full">
        {!hasAnyPlans ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 mt-4">
            <div className="text-4xl mb-4">📅</div>
            <h2 className="text-lg font-bold mb-2">No plans yet</h2>
            <p className="text-gray-500 text-sm mb-6">Start by generating a diet plan for any day of the week.</p>
            <Button onClick={onGenerateNew}>Generate First Plan</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {days.map((day) => {
              const plan = schedule[day];
              return (
                <div 
                  key={day}
                  className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between group"
                >
                  <div className="flex-1 cursor-pointer" onClick={() => onSelectDay(day)}>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{day}</div>
                    {plan ? (
                      <div>
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="font-bold text-primary text-lg">{plan.dailyTargets.calories} kcal</span>
                          <span className="text-xs text-gray-500 font-medium dark:text-gray-400">
                            {plan.dailyTargets.protein} Protein • {plan.dailyTargets.carbs} Carbs • {plan.dailyTargets.fats} Fat
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 line-clamp-1">{plan.summary}</div>
                      </div>
                    ) : (
                      <div className="text-gray-300 dark:text-gray-700 italic text-sm mt-1">Empty</div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {plan ? (
                      <button 
                        onClick={(e) => handleDeleteClick(e, day)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Clear Day"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => onSelectDay(day)}>
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Weekly Summary Card */}
            {(() => {
              const plannedDays = days.filter(d => schedule[d] !== null);
              const count = plannedDays.length;
              
              const totals = plannedDays.reduce((acc, d) => {
                const target = schedule[d]?.dailyTargets;
                if (!target) return acc;
                return {
                  calories: acc.calories + target.calories,
                  protein: acc.protein + target.protein,
                  carbs: acc.carbs + target.carbs,
                  fats: acc.fats + target.fats,
                };
              }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

              const avgs = count > 0 ? {
                calories: Math.round(totals.calories / count),
                protein: Math.round(totals.protein / count),
                carbs: Math.round(totals.carbs / count),
                fats: Math.round(totals.fats / count),
              } : totals;

              return (
                <div className="mt-6 bg-primary/5 dark:bg-primary/10 rounded-2xl p-5 border border-primary/10">
                  <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 opacity-70">Weekly Averages ({count} days)</div>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="text-3xl font-black text-gray-900 dark:text-white leading-none mb-1">
                        {totals.calories.toLocaleString()}
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Total Weekly Calories</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-gray-900 dark:text-white leading-none mb-1">
                        {avgs.calories.toLocaleString()}
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Avg Daily Calories</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-primary/10 pt-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{avgs.protein}g</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase">Protein</div>
                    </div>
                    <div className="text-center border-l border-primary/10">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{avgs.carbs}g</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase">Carbs</div>
                    </div>
                    <div className="text-center border-l border-primary/10">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{avgs.fats}g</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase">Fats</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
