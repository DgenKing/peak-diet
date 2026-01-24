import { useState, useEffect, useCallback } from 'react';
import type { DayOfWeek, DietPlan, SavedPlan, WeeklySchedule } from '../types/diet';
import { useUser } from './useUser';

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
  const { isAnonymous, user } = useUser();
  const [loading, setLoading] = useState(false);
  
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

  // Fetch from database on login
  useEffect(() => {
    if (!isAnonymous && user) {
      const syncFromDB = async () => {
        setLoading(true);
        try {
          // Fetch plans
          const plansRes = await fetch('/api/plans');
          const plansData = await plansRes.json();
          
          // Fetch schedules
          const schedulesRes = await fetch('/api/schedules');
          const schedulesData = await schedulesRes.json();
          const activeSchedule = schedulesData.find((s: any) => s.is_active);

          setStore(prev => ({
            ...prev,
            savedPlans: Array.isArray(plansData) ? plansData.map((p: any) => ({
              id: p.id,
              name: p.name,
              plan: p.plan_data,
              createdAt: new Date(p.created_at).getTime()
            })) : prev.savedPlans,
            weeklySchedule: activeSchedule ? activeSchedule.schedule_data : prev.weeklySchedule
          }));
        } catch (err) {
          console.error('Failed to sync from DB:', err);
        } finally {
          setLoading(false);
        }
      };
      syncFromDB();
    }
  }, [isAnonymous, user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  const saveUserStats = (stats: UserStats) => {
    setStore(prev => ({ ...prev, userStats: stats }));
  };

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

  const syncScheduleToDB = useCallback(async (schedule: WeeklySchedule) => {
    if (isAnonymous) return;
    try {
      await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Current Schedule',
          schedule_data: schedule,
          is_active: true
        }),
      });
    } catch (err) {
      console.error('Failed to sync schedule to DB:', err);
    }
  }, [isAnonymous]);

  const setDayPlan = (day: DayOfWeek, plan: DietPlan | null) => {
    const newSchedule = {
      ...store.weeklySchedule,
      [day]: plan ? JSON.parse(JSON.stringify(plan)) : null
    };
    setStore(prev => ({
      ...prev,
      weeklySchedule: newSchedule
    }));
    syncScheduleToDB(newSchedule);
  };

  const saveToLibrary = async (name: string, plan: DietPlan) => {
    const planData = JSON.parse(JSON.stringify(plan));
    
    if (!isAnonymous) {
      try {
        const res = await fetch('/api/plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, plan_data: planData }),
        });
        const saved = await res.json();
        const newSaved: SavedPlan = {
          id: saved.id,
          name: saved.name,
          plan: saved.plan_data,
          createdAt: new Date(saved.created_at).getTime(),
        };
        setStore(prev => ({
          ...prev,
          savedPlans: [...prev.savedPlans, newSaved],
        }));
        return saved.id;
      } catch (err) {
        console.error('Failed to save plan to DB:', err);
      }
    }

    const newSaved: SavedPlan = {
      id: crypto.randomUUID(),
      name,
      plan: planData,
      createdAt: Date.now(),
    };
    setStore(prev => ({
      ...prev,
      savedPlans: [...prev.savedPlans, newSaved],
    }));
    return newSaved.id;
  };

  const deleteFromLibrary = async (id: string) => {
    if (!isAnonymous) {
      try {
        await fetch('/api/plans', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
      } catch (err) {
        console.error('Failed to delete plan from DB:', err);
      }
    }
    setStore(prev => ({
      ...prev,
      savedPlans: prev.savedPlans.filter(p => p.id !== id),
    }));
  };

  const copyToDays = (plan: DietPlan, days: DayOfWeek[]) => {
    const newSchedule = { ...store.weeklySchedule };
    days.forEach(day => {
      newSchedule[day] = JSON.parse(JSON.stringify(plan));
    });
    setStore(prev => ({ ...prev, weeklySchedule: newSchedule }));
    syncScheduleToDB(newSchedule);
  };

  const clearWeek = () => {
    const newSchedule = initialSchedule;
    setStore(prev => ({
      ...prev,
      weeklySchedule: newSchedule,
      cachedShoppingList: null,
      shoppingListHash: null,
    }));
    syncScheduleToDB(newSchedule);
  };

  return {
    weeklySchedule: store.weeklySchedule,
    savedPlans: store.savedPlans,
    userStats: store.userStats,
    cachedShoppingList: store.cachedShoppingList,
    hasScheduleChanged,
    loading,
    setDayPlan,
    saveToLibrary,
    deleteFromLibrary,
    copyToDays,
    saveUserStats,
    saveShoppingList,
    clearShoppingListCache,
    clearWeek,
  };
}