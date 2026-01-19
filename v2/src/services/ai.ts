import OpenAI from 'openai';
import { DietPlanSchema } from '../types/diet';
import type { DietPlan } from '../types/diet';
import type { SimpleFormData } from '../types';
import { generateSimplePrompt } from '../utils/simplePromptGenerator';

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

const client = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: API_KEY || 'mock-key',
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `You are an expert nutritionist. You must output STRICT JSON only.
Your goal is to generate a personalized diet plan based on the user's profile.
Follow the following JSON schema strictly:
{
  "summary": "string",
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
  summary: "Based on your goal to build muscle, this plan focuses on high protein intake evenly distributed throughout the day.",
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
