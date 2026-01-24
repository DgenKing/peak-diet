import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { recordTokenUsage } from './lib/token.js';

// Hardcoded for local dev - vercel dev loads wrong env var
const API_KEY = "sk-ed5a720028c2406180217f19e1ca47e6";

const client = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: API_KEY,
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

CRITICAL RULE for "summary": Start the summary with the main foods/ingredients for the day (e.g., "Chicken, rice, broccoli, eggs, oats - ..." then continue with the plan strategy).

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action } = req.body;

  if (action === 'generate') {
    return handleGenerate(req, res);
  } else if (action === 'update') {
    return handleUpdate(req, res);
  } else if (action === 'meal_update') {
    return handleMealUpdate(req, res);
  } else if (action === 'shopping_list') {
    return handleShoppingList(req, res);
  }

  return res.status(400).json({ error: 'Valid action (generate/update/meal_update/shopping_list) is required in body' });
}

async function handleGenerate(req: VercelRequest, res: VercelResponse) {
  const { userId, prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }

  try {
    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt + "\n\nReturn strict JSON." }
      ],
      model: "deepseek-chat",
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content returned from AI");

    if (userId && completion.usage) {
      await recordTokenUsage({
        userId,
        tokensInput: completion.usage.prompt_tokens,
        tokensOutput: completion.usage.completion_tokens,
        model: "deepseek-chat",
        requestType: 'generate'
      });
    }

    const plan = JSON.parse(content);
    return res.status(200).json(plan);
  } catch (error) {
    console.error('AI Generation Error:', error);
    return res.status(500).json({ error: 'AI generation failed' });
  }
}

async function handleUpdate(req: VercelRequest, res: VercelResponse) {
  const { userId, currentPlan, instruction } = req.body;

  if (!currentPlan || !instruction) {
    return res.status(400).json({ error: 'currentPlan and instruction are required' });
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
    if (!content) throw new Error("No content returned from AI");

    if (userId && completion.usage) {
      await recordTokenUsage({
        userId,
        tokensInput: completion.usage.prompt_tokens,
        tokensOutput: completion.usage.completion_tokens,
        model: "deepseek-chat",
        requestType: 'update'
      });
    }

    const plan = JSON.parse(content);
    return res.status(200).json(plan);
  } catch (error) {
    console.error('AI Update Error:', error);
    return res.status(500).json({ error: 'AI update failed' });
  }
}

async function handleMealUpdate(req: VercelRequest, res: VercelResponse) {
  const { userId, meal, instruction, dailyTargets } = req.body;

  if (!meal || !instruction || !dailyTargets) {
    return res.status(400).json({ error: 'meal, instruction, and dailyTargets are required' });
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
    if (!content) throw new Error("No content returned from AI");

    if (userId && completion.usage) {
      await recordTokenUsage({
        userId,
        tokensInput: completion.usage.prompt_tokens,
        tokensOutput: completion.usage.completion_tokens,
        model: "deepseek-chat",
        requestType: 'meal_update'
      });
    }

    const updatedMeal = JSON.parse(content);
    return res.status(200).json(updatedMeal);
  } catch (error) {
    console.error('AI Meal Update Error:', error);
    return res.status(500).json({ error: 'AI meal update failed' });
  }
}

async function handleShoppingList(req: VercelRequest, res: VercelResponse) {
  const { userId, ingredients } = req.body;

  if (!ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: 'ingredients array is required' });
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

    if (userId && completion.usage) {
      await recordTokenUsage({
        userId,
        tokensInput: completion.usage.prompt_tokens,
        tokensOutput: completion.usage.completion_tokens,
        model: "deepseek-chat",
        requestType: 'shopping_list'
      });
    }

    return res.status(200).json({ content: completion.choices[0].message.content });
  } catch (error) {
    console.error('AI Shopping List Error:', error);
    return res.status(500).json({ error: 'AI shopping list generation failed' });
  }
}