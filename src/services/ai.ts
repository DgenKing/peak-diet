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

CRITICAL RULE: The sum of calories from all meals MUST match the "dailyTargets.calories" (within 5% margin). Do not output a target of 2500kcal if the meals only add up to 2000kcal. Adjust portions to match the target.

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

export async function generateDietPlan(data: SimpleFormData): Promise<DietPlan> {
  if (!API_KEY) {
    console.warn("No API Key found, returning mock data.");
    await new Promise(r => setTimeout(r, 2000));
    return MOCK_PLAN;
  }

  const userPrompt = generateSimplePrompt(data);

  try {
    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt + "\n\nReturn strict JSON." }
      ],
      model: "deepseek-chat",
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content returned");

    const json = JSON.parse(content);
    return DietPlanSchema.parse(json);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}

export async function updateDietPlan(currentPlan: DietPlan, instruction: string): Promise<DietPlan> {
  if (!API_KEY) {
    console.warn("No API Key found, returning mock update.");
    await new Promise(r => setTimeout(r, 1500));
    // Mock update logic
    return {
        ...currentPlan,
        summary: "Updated based on: " + instruction,
        meals: currentPlan.meals.map(m => ({
          ...m,
          name: m.name + (instruction.includes("chicken") ? " (Chicken added)" : "")
        }))
    };
  }

  try {
    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Current Plan JSON:\n${JSON.stringify(currentPlan)}\n\nUser Instruction: ${instruction}\n\nUpdate the plan based on the instruction and return the full new JSON.` }
      ],
      model: "deepseek-chat",
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content returned");

    const json = JSON.parse(content);
    return DietPlanSchema.parse(json);
  } catch (error) {
    console.error("AI Update Error:", error);
    throw error;
  }
}

export async function generateAdvancedDietPlan(data: AdvancedFormData): Promise<DietPlan> {
  if (!API_KEY) {
    console.warn("No API Key found, returning mock data.");
    await new Promise(r => setTimeout(r, 2000));
    return MOCK_PLAN;
  }

  const userPrompt = generateAdvancedPrompt(data, 'detailed');

  try {
    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt + "\n\nReturn strict JSON following the schema." }
      ],
      model: "deepseek-chat",
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content returned");

    const json = JSON.parse(content);
    return DietPlanSchema.parse(json);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}

// Placeholder for future chat implementation
export async function processChatRequest(_userMsg: string, _schedule: WeeklySchedule): Promise<{ response: string; action: 'reply' | 'update'; targetDay?: string; updatedPlan?: DietPlan }> {
  return { response: "Chat feature coming soon!", action: 'reply' };
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