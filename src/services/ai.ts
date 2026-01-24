import OpenAI from 'openai';
import { DietPlanSchema } from '../types/diet';
import type { DietPlan, WeeklySchedule } from '../types/diet';
import type { SimpleFormData, AdvancedFormData } from '../types';
import { generateSimplePrompt } from '../utils/simplePromptGenerator';
import { generateAdvancedPrompt } from '../utils/advancedPromptGenerator';

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

const client = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: API_KEY || 'mock-key',
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `You are an expert nutritionist. You must output STRICT JSON only.
Your goal is to generate a personalized diet plan based on the user's profile.

CRITICAL MATH RULE - YOU MUST VERIFY THIS BEFORE RESPONDING:
1. Add up ALL meal calories - must equal dailyTargets.calories (±5%)
2. Add up ALL meal protein - must equal dailyTargets.protein (±5%)
3. Add up ALL meal carbs - must equal dailyTargets.carbs (±5%)
4. Add up ALL meal fats - must equal dailyTargets.fats (±5%)

EXAMPLE: If target is 2000 kcal and 180g protein, meals must add to ~2000 kcal and ~180g protein.
If your meals only add to 1500 kcal, INCREASE PORTIONS until they reach 2000 kcal.

DO NOT output a plan where meals don't add up. Verify the math mentally before responding.

CRITICAL RULE: Do NOT include a "weekly grocery list" in the tips. This is a single-day plan. Only list ingredients needed for THIS day if asked, otherwise focus on preparation tips.

CRITICAL RULE for "summary": Start the summary with the main foods/ingredients for the day (e.g., "Chicken, rice, broccoli, eggs, oats - ..." then continue with the plan strategy). This helps users quickly see what foods they'll be eating.

Follow the following JSON schema strictly:
{
  "summary": "string (START with main foods, then describe strategy)",
  "dailyTargets": { "protein": number, "carbs": number, "fats": number, "calories": number },
  "meals": [
    {
      "name": "string",
      "time": "string (optional)",
      "items": [{ "name": "string", "amount": "string", "macros": { "protein": number, "carbs": number, "fats": number, "calories": number } (optional) }],
      "totalMacros": { "protein": number, "carbs": number, "fats": number, "calories": number } (optional),
      "instructions": "string (optional)"
    }
  ],
  "tips": ["string"]
}
`;

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
    // Call server-side API for token tracking
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, prompt: userPrompt }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const json = await response.json();
    const plan = DietPlanSchema.parse(json);
    return recalculatePlanTotals(plan);
  } catch (error) {
    console.error("AI Generation Error:", error);
    // Fallback to mock if API fails
    console.warn("Falling back to mock data");
    await new Promise(r => setTimeout(r, 1500));
    return MOCK_PLAN;
  }
}

export async function updateDietPlan(currentPlan: DietPlan, instruction: string, userId?: string): Promise<DietPlan> {
  try {
    const response = await fetch('/api/ai/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, currentPlan, instruction }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const json = await response.json();
    const plan = DietPlanSchema.parse(json);
    return recalculatePlanTotals(plan);
  } catch (error) {
    console.error("AI Update Error:", error);
    // Fallback logic for development if API is unavailable
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
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, prompt: userPrompt }),
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

// Placeholder for future chat implementation
export async function processChatRequest(_userMsg: string, _schedule: WeeklySchedule): Promise<{ response: string; action: 'reply' | 'update'; targetDay?: string; updatedPlan?: DietPlan }> {
  return { response: "Chat feature coming soon!", action: 'reply' };
}

// Update a single meal with focused AI
import { MealSchema } from '../types/diet';
import type { Meal, Macro } from '../types/diet';

const MEAL_UPDATE_PROMPT = `You are an expert nutritionist. Update a single meal based on the user's instruction.

CRITICAL RULES:
1. Make the change the user asks for
2. Keep the meal name and time unchanged unless specifically asked
3. IMPORTANT: Try to keep the meal's total macros (calories, protein, carbs, fats) as close to the original as possible by adjusting portion sizes of OTHER items in the meal
4. If swapping one protein for another with more protein, reduce portions of other protein-containing items to balance
5. If the swap makes balancing impossible (e.g., only one item in meal), do your best but prioritize the user's requested change
6. Return valid JSON matching the meal schema exactly
7. Each item should have realistic macros
8. IMPORTANT: The "instructions" field should be a SHORT, practical cooking tip for the MAIN protein or central item only (e.g., "Grill chicken at 180°C for 6 mins per side" or "Scramble eggs on medium heat with butter"). Do NOT try to explain how to combine all items or reference side items like oatmeal, spinach, etc. Keep it to 1 sentence max.

Meal JSON Schema:
{
  "name": "string",
  "time": "string (optional)",
  "items": [{ "name": "string", "amount": "string", "macros": { "protein": number, "carbs": number, "fats": number, "calories": number } }],
  "totalMacros": { "protein": number, "carbs": number, "fats": number, "calories": number },
  "instructions": "string (optional)"
}
`;

export async function updateMeal(
  meal: Meal,
  instruction: string,
  dailyTargets: Macro
): Promise<Meal> {
  if (!API_KEY) {
    console.warn("No API Key found, returning mock update.");
    await new Promise(r => setTimeout(r, 1000));
    return {
      ...meal,
      items: meal.items.map(item => ({
        ...item,
        name: instruction.toLowerCase().includes('bacon') && item.name.toLowerCase().includes('egg')
          ? 'Bacon' : item.name
      }))
    };
  }

  try {
    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: MEAL_UPDATE_PROMPT },
        {
          role: "user",
          content: `Current meal (${meal.name}):\n${JSON.stringify(meal, null, 2)}\n\nDaily targets for context: ${dailyTargets.calories}kcal, ${dailyTargets.protein}g protein, ${dailyTargets.carbs}g carbs, ${dailyTargets.fats}g fats\n\nUser instruction: "${instruction}"\n\nReturn the updated meal as JSON only.`
        }
      ],
      model: "deepseek-chat",
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content returned");

    const json = JSON.parse(content);
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
    throw error;
  }
}

export async function generateShoppingList(ingredients: string[]): Promise<string> {
  if (!API_KEY) {
    await new Promise(r => setTimeout(r, 1500));
    return "Mock Shopping List:\n\nProduce:\n- Apples: 5\n- Bananas: 2\n\nProteins:\n- Chicken Breast: 500g\n- Eggs: 12";
  }

  const prompt = `
    You are a highly precise kitchen assistant.
    Here is a raw list of ingredients for a weekly diet plan:
    
    ${ingredients.join('\n')}

    Your task is to create a consolidated shopping list with extreme accuracy.
    
    RULES:
    1. MERGE CAREFULLY: Sum up the exact quantities for identical items (e.g., "150g Chicken" + "200g Chicken" = "350g Chicken").
    2. DO NOT MISS ANYTHING: Every single ingredient from the raw list must be accounted for.
    3. UNIT CONVERSION: Convert to standard shopping units where sensible (e.g. 1000g -> 1kg), but keep specific counts (e.g. "2 Apples").
    4. PANTRY BUFFERS: Round up slightly for oils, spices, and staples to ensure the user has enough.
    5. CATEGORIZE: Group by Produce, Meat/Protein, Dairy, Pantry, Frozen, etc.
    6. FORMAT: Output in Markdown with headers (### Category) and bullet points (* **Item:** Quantity).

    Output the final clean list now.
  `;

  try {
    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant that creates organized shopping lists." },
        { role: "user", content: prompt }
      ],
      model: "deepseek-chat",
    });

    return completion.choices[0].message.content || "Could not generate list.";
  } catch (error) {
    console.error("AI Shopping List Error:", error);
    throw error;
  }
}