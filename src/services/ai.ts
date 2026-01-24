import { DietPlanSchema } from '../types/diet';
import type { DietPlan, WeeklySchedule } from '../types/diet';
import type { SimpleFormData, AdvancedFormData } from '../types';
import { generateSimplePrompt } from '../utils/simplePromptGenerator';
import { generateAdvancedPrompt } from '../utils/advancedPromptGenerator';
import { MealSchema } from '../types/diet';
import type { Meal, Macro } from '../types/diet';

const MOCK_PLAN: DietPlan = {
  summary: "Oatmeal, chicken, rice, broccoli, salmon, quinoa - high protein plan for muscle building with balanced macros throughout the day.",
  dailyTargets: { calories: 2400, protein: 180, carbs: 250, fats: 80 },
  meals: [
    {
      name: "Breakfast",
      time: "8:00 AM",
      items: [
        { name: "Oatmeal", amount: "1 cup cooked" },
        { name: "Whey Protein", amount: "1 scoop" },
        { name: "Berries", amount: "1/2 cup" }
      ],
      totalMacros: { calories: 450, protein: 30, carbs: 60, fats: 10 },
      instructions: "Mix protein into cooked oatmeal."
    },
    {
      name: "Lunch",
      time: "1:00 PM",
      items: [
        { name: "Chicken Breast", amount: "150g" },
        { name: "Rice", amount: "1 cup cooked" },
        { name: "Broccoli", amount: "1 cup" }
      ],
      totalMacros: { calories: 600, protein: 45, carbs: 70, fats: 10 }
    },
     {
      name: "Dinner",
      time: "7:00 PM",
      items: [
        { name: "Salmon", amount: "150g" },
        { name: "Quinoa", amount: "1 cup cooked" },
        { name: "Asparagus", amount: "1 cup" }
      ],
      totalMacros: { calories: 700, protein: 40, carbs: 60, fats: 25 }
    }
  ],
  tips: ["Drink 3L of water", "Prep meals on Sunday"]
};

// Recalculate accurate totals from item macros (AI is bad at math)
function recalculatePlanTotals(plan: DietPlan): DietPlan {
  const recalculatedMeals = plan.meals.map(meal => {
    // Sum up item macros to get accurate meal totals
    const totalMacros = meal.items.reduce((acc, item) => {
      if (item.macros) {
        return {
          calories: acc.calories + (item.macros.calories || 0),
          protein: acc.protein + (item.macros.protein || 0),
          carbs: acc.carbs + (item.macros.carbs || 0),
          fats: acc.fats + (item.macros.fats || 0),
        };
      }
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

    // Only update if we have item macros to sum
    const hasItemMacros = meal.items.some(item => item.macros);
    return {
      ...meal,
      totalMacros: hasItemMacros ? totalMacros : meal.totalMacros,
    };
  });

  // Sum all meal totals to get accurate daily totals
  const actualDailyTotals = recalculatedMeals.reduce((acc, meal) => {
    if (meal.totalMacros) {
      return {
        calories: acc.calories + meal.totalMacros.calories,
        protein: acc.protein + meal.totalMacros.protein,
        carbs: acc.carbs + meal.totalMacros.carbs,
        fats: acc.fats + meal.totalMacros.fats,
      };
    }
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

  return {
    ...plan,
    meals: recalculatedMeals,
    // Replace daily targets with actual totals (what they'll really eat)
    dailyTargets: actualDailyTotals,
  };
}

export async function generateDietPlan(data: SimpleFormData, userId?: string): Promise<DietPlan> {
  const userPrompt = generateSimplePrompt(data);

  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, prompt: userPrompt, action: 'generate' }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const json = await response.json();
    const plan = DietPlanSchema.parse(json);
    return recalculatePlanTotals(plan);
  } catch (error) {
    console.error("AI Generation Error:", error);
    console.warn("Falling back to mock data");
    await new Promise(r => setTimeout(r, 1500));
    return MOCK_PLAN;
  }
}

export async function updateDietPlan(currentPlan: DietPlan, instruction: string, userId?: string): Promise<DietPlan> {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, currentPlan, instruction, action: 'update' }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const json = await response.json();
    const plan = DietPlanSchema.parse(json);
    return recalculatePlanTotals(plan);
  } catch (error) {
    console.error("AI Update Error:", error);
    if (!userId) {
      console.warn("Falling back to mock update (no userId)");
      await new Promise(r => setTimeout(r, 1500));
      return {
          ...currentPlan,
          summary: "Updated based on: " + instruction,
          meals: currentPlan.meals.map(m => ({
            ...m,
            name: m.name + (instruction.includes("chicken") ? " (Chicken added)" : "")
          }))
      };
    }
    throw error;
  }
}

export async function generateAdvancedDietPlan(data: AdvancedFormData, userId?: string): Promise<DietPlan> {
  const userPrompt = generateAdvancedPrompt(data, 'detailed');

  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, prompt: userPrompt, action: 'generate' }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const json = await response.json();
    const plan = DietPlanSchema.parse(json);
    return recalculatePlanTotals(plan);
  } catch (error) {
    console.error("AI Generation Error:", error);
    console.warn("Falling back to mock data");
    await new Promise(r => setTimeout(r, 1500));
    return MOCK_PLAN;
  }
}

export async function updateMeal(
  meal: Meal,
  instruction: string,
  dailyTargets: Macro,
  userId?: string
): Promise<Meal> {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, meal, instruction, dailyTargets, action: 'meal_update' }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const json = await response.json();
    const updatedMeal = MealSchema.parse(json);

    // Recalculate meal totals from item macros
    const hasItemMacros = updatedMeal.items.some(item => item.macros);
    if (hasItemMacros) {
      const totalMacros = updatedMeal.items.reduce((acc, item) => {
        if (item.macros) {
          return {
            calories: acc.calories + (item.macros.calories || 0),
            protein: acc.protein + (item.macros.protein || 0),
            carbs: acc.carbs + (item.macros.carbs || 0),
            fats: acc.fats + (item.macros.fats || 0),
          };
        }
        return acc;
      }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
      return { ...updatedMeal, totalMacros };
    }
    return updatedMeal;
  } catch (error) {
    console.error("AI Meal Update Error:", error);
    if (!userId) {
       console.warn("Falling back to mock meal update (no userId)");
       return {
        ...meal,
        items: meal.items.map(item => ({
          ...item,
          name: instruction.toLowerCase().includes('bacon') && item.name.toLowerCase().includes('egg')
            ? 'Bacon' : item.name
        }))
      };
    }
    throw error;
  }
}

export async function generateShoppingList(ingredients: string[], userId?: string): Promise<string> {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ingredients, action: 'shopping_list' }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const json = await response.json();
    return json.content || "Could not generate list.";
  } catch (error) {
    console.error("AI Shopping List Error:", error);
    if (!userId) {
       console.warn("Falling back to mock shopping list (no userId)");
       await new Promise(r => setTimeout(r, 1500));
       return "Mock Shopping List:\n\nProduce:\n- Apples: 5\n- Bananas: 2\n\nProteins:\n- Chicken Breast: 500g\n- Eggs: 12";
    }
    throw error;
  }
}

// Placeholder for future chat implementation
export async function processChatRequest(_userMsg: string, _schedule: WeeklySchedule): Promise<{ response: string; action: 'reply' | 'update'; targetDay?: string; updatedPlan?: DietPlan }> {
  return { response: "Chat feature coming soon!", action: 'reply' };
}
