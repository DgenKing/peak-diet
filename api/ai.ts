import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { recordTokenUsage } from './lib/token.js';

// Hardcoded for local dev - vercel dev loads wrong env var
const API_KEY = "${DEEPSEEK_API_KEY:-REDACTED}";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action } = req.body;

  if (action === 'generate') {
    return handleGenerate(req, res);
  } else if (action === 'update') {
    return handleUpdate(req, res);
  }

  return res.status(400).json({ error: 'Valid action (generate/update) is required in body' });
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
