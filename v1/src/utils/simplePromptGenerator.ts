import type { SimpleFormData } from '../types';

const goalLabels: Record<string, string> = {
  lose_fat: 'Lose fat while maintaining muscle',
  build_muscle: 'Build muscle and gain strength',
  both: 'Body recomposition (lose fat and build muscle)',
  get_fitter: 'Improve overall fitness and health',
};

const activityLabels: Record<string, string> = {
  sitting: 'Sedentary (desk job, mostly sitting)',
  some_movement: 'Lightly active (some walking and movement)',
  very_active: 'Very active (physical job, lots of movement)',
};

const trainingLabels: Record<string, string> = {
  gym: 'Weight training at the gym',
  cardio: 'Cardio and running',
  sports: 'Sports and recreational activities',
  mix: 'Mix of weight training and cardio',
};

const cookingLabels: Record<string, string> = {
  basic: 'Basic (keep recipes simple)',
  can_cook: 'Comfortable cooking (can follow any recipe)',
};

const presetLabels: Record<string, string> = {
  busy_professional: 'Busy Professional',
  athlete: 'Athlete',
  beginner: 'Beginner',
  student: 'Student',
  parent: 'Parent',
  vegan: 'Vegan',
  keto: 'Keto',
  gluten_free: 'Gluten Free',
  paleo: 'Paleo',
  intermittent_fasting: 'Intermittent Fasting',
};

export function generateSimplePrompt(data: SimpleFormData): string {
  const height = data.heightUnit === 'ft'
    ? `${data.height}'${data.heightInches || 0}"`
    : `${data.height} cm`;

  const weight = `${data.weight} ${data.weightUnit}`;

  const restriction = data.dietaryRestriction === 'other'
    ? data.otherRestriction
    : data.dietaryRestriction === 'none'
    ? 'No restrictions'
    : data.dietaryRestriction;

  const presetText = data.preset ? `- Context: I am a ${presetLabels[data.preset] || data.preset}` : '';

  return `Act as a nutrition coach. Create a simple, easy-to-follow meal plan for me.

**My Goal:** ${goalLabels[data.goal || ''] || data.goal}

**About Me:**
- Age: ${data.age} years old
- Gender: ${data.gender}
- Height: ${height}
- Weight: ${weight}
${presetText}
- Daily Activity: ${activityLabels[data.dailyActivity || ''] || data.dailyActivity}
- Training: ${data.trainingDays} days per week (${trainingLabels[data.trainingType || ''] || data.trainingType})

**Food Preferences:**
- Diet: ${restriction}
- Proteins I like: ${[...data.proteins, data.otherProtein].filter(Boolean).join(', ') || 'No preference'}
- Cooking level: ${cookingLabels[data.cookingLevel || ''] || data.cookingLevel}
- Meals per day: ${data.mealsPerDay}

**Please provide:**
1. My recommended daily calories and protein target (with calculation explanation)
2. A simple daily meal plan with exact portions (grams and household measures)
3. Macro breakdown for each meal (protein/carbs/fats)
4. A basic grocery list for the week
5. Simple meal prep tips to make this easy to follow

Keep it simple and practical. I want something I can actually stick to!`;
}
