import { z } from 'zod';

export const MacroSchema = z.object({
  protein: z.number().describe('Protein in grams'),
  carbs: z.number().describe('Carbs in grams'),
  fats: z.number().describe('Fats in grams'),
  calories: z.number().describe('Total calories'),
});

export const MealItemSchema = z.object({
  name: z.string(),
  amount: z.string().describe('e.g., "100g", "1 cup"'),
  macros: MacroSchema.optional(),
});

export const MealSchema = z.object({
  name: z.string().describe('e.g., "Breakfast", "Snack 1"'),
  time: z.string().optional().describe('Suggested time, e.g., "8:00 AM"'),
  items: z.array(MealItemSchema),
  totalMacros: MacroSchema.optional(),
  instructions: z.string().optional().describe('Cooking or prep instructions'),
});

export const DietPlanSchema = z.object({
  summary: z.string().describe('Brief summary of the plan strategy'),
  dailyTargets: MacroSchema,
  meals: z.array(MealSchema),
  tips: z.array(z.string()).optional(),
});

export type DietPlan = z.infer<typeof DietPlanSchema>;

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface SavedPlan {
  id: string;
  name: string;
  plan: DietPlan;
  createdAt: number;
}

export type WeeklySchedule = Record<DayOfWeek, DietPlan | null>;
