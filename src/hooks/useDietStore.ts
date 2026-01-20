import { useState, useEffect } from 'react';
import type { DayOfWeek, DietPlan, SavedPlan, WeeklySchedule } from '../types/diet';

const STORAGE_KEY = 'peak_diet_store';

interface UserStats {
  age: number | null;
  gender: 'male' | 'female' | 'other' | null;
  height: number | null;
  heightUnit: 'cm' | 'ft';
  heightInches: number | null;
  weight: number | null;
  weightUnit: 'kg' | 'lbs';
}

interface DietStore {
  weeklySchedule: WeeklySchedule;
  savedPlans: SavedPlan[];
  userStats: UserStats | null;
  cachedShoppingList: string | null;
  shoppingListHash: string | null;
}

const initialSchedule: WeeklySchedule = {
  Monday: null,
  Tuesday: null,
  Wednesday: null,
  Thursday: null,
  Friday: null,
  Saturday: null,
  Sunday: null,
};

export function useDietStore() {
  const [store, setStore] = useState<DietStore>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse diet store', e);
      }
    }
    return {
      weeklySchedule: initialSchedule,
      savedPlans: [],
      userStats: null,
      cachedShoppingList: null,
      shoppingListHash: null,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  const saveUserStats = (stats: UserStats) => {
    setStore(prev => ({ ...prev, userStats: stats }));
  };

  // Generate a hash from the schedule to detect changes
  const generateScheduleHash = (schedule: WeeklySchedule): string => {
    const items: string[] = [];
    const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    days.forEach(day => {
      const plan = schedule[day];
      if (plan) {
        plan.meals.forEach(meal => {
          meal.items.forEach(item => {
            items.push(`${item.amount} ${item.name}`);
          });
        });
      }
    });
    return items.sort().join('|');
  };

  const currentScheduleHash = generateScheduleHash(store.weeklySchedule);
  const hasScheduleChanged = currentScheduleHash !== store.shoppingListHash;

  const saveShoppingList = (list: string) => {
    setStore(prev => ({
      ...prev,
      cachedShoppingList: list,
      shoppingListHash: generateScheduleHash(prev.weeklySchedule),
    }));
  };

  const clearShoppingListCache = () => {
    setStore(prev => ({
      ...prev,
      cachedShoppingList: null,
      shoppingListHash: null,
    }));
  };

  const setDayPlan = (day: DayOfWeek, plan: DietPlan | null) => {
    setStore(prev => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: plan ? JSON.parse(JSON.stringify(plan)) : null // Deep copy to ensure independence
      }
    }));
  };

  const saveToLibrary = (name: string, plan: DietPlan) => {
    const newSaved: SavedPlan = {
      id: crypto.randomUUID(),
      name,
      plan: JSON.parse(JSON.stringify(plan)),
      createdAt: Date.now(),
    };
    setStore(prev => ({
      ...prev,
      savedPlans: [...prev.savedPlans, newSaved],
    }));
    return newSaved.id;
  };

  const deleteFromLibrary = (id: string) => {
    setStore(prev => ({
      ...prev,
      savedPlans: prev.savedPlans.filter(p => p.id !== id),
    }));
  };

  const copyToDays = (plan: DietPlan, days: DayOfWeek[]) => {
    setStore(prev => {
      const newSchedule = { ...prev.weeklySchedule };
      days.forEach(day => {
        newSchedule[day] = JSON.parse(JSON.stringify(plan));
      });
      return { ...prev, weeklySchedule: newSchedule };
    });
  };

  return {
    weeklySchedule: store.weeklySchedule,
    savedPlans: store.savedPlans,
    userStats: store.userStats,
    cachedShoppingList: store.cachedShoppingList,
    hasScheduleChanged,
    setDayPlan,
    saveToLibrary,
    deleteFromLibrary,
    copyToDays,
    saveUserStats,
    saveShoppingList,
    clearShoppingListCache,
  };
}
