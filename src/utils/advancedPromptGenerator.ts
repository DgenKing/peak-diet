import type { AdvancedFormData, PromptType } from '../types';

const goalLabels: Record<string, string> = {
  fat_loss: 'Fat Loss / Cut - Lose body fat while preserving muscle',
  muscle_building: 'Muscle Building / Bulk - Maximize muscle gain with controlled surplus',
  recomposition: 'Body Recomposition - Build muscle AND lose fat simultaneously',
  weight_gain: 'Weight Gain - Healthy weight gain',
  maintenance: 'Maintenance - Maintain current physique',
  athletic_performance: 'Athletic Performance - Fuel for sport-specific performance',
};

const secondaryGoalLabels: Record<string, string> = {
  increase_energy: 'Increase Energy',
  improve_sleep: 'Improve Sleep Quality',
  better_digestion: 'Better Digestion',
  reduce_inflammation: 'Reduce Inflammation',
  improve_skin_hair: 'Improve Skin/Hair',
  hormone_optimization: 'Hormone Optimization',
};

const activityLabels: Record<string, string> = {
  sedentary: 'Sedentary - Desk job, minimal movement',
  lightly_active: 'Lightly Active - Some walking, light activity',
  moderately_active: 'Moderately Active - On feet most of day',
  very_active: 'Very Active - Physical job, lots of movement',
  extremely_active: 'Extremely Active - Hard labor, professional athlete',
};

const trainingTimeLabels: Record<string, string> = {
  early_morning: 'Early morning (before work)',
  morning: 'Morning',
  lunchtime: 'Lunchtime',
  afternoon: 'Afternoon',
  evening: 'Evening (after work)',
  late_night: 'Late night',
  varies: 'Varies / Irregular',
};

export function generateAdvancedPrompt(data: AdvancedFormData, promptType: PromptType = 'detailed'): string {
  const height = data.heightUnit === 'ft'
    ? `${data.height}'${data.heightInches || 0}"`
    : `${data.height} cm`;

  const weight = `${data.weight} ${data.weightUnit}`;
  const targetWeight = data.targetWeight ? `${data.targetWeight} ${data.weightUnit}` : 'Maintain current';

  const secondaryGoals = data.secondaryGoals.map(g => secondaryGoalLabels[g] || g).join(', ') || 'None';

  if (promptType === 'quick') {
    return generateQuickPrompt(data, height, weight);
  }

  return `Act as an expert sports nutritionist, registered dietitian, and bodybuilding coach with 15+ years of experience creating personalized meal plans. I need you to create a highly detailed, science-based nutrition plan tailored to my exact specifications.

## MY GOAL
**Primary Goal:** ${goalLabels[data.primaryGoal || ''] || data.primaryGoal}
**Secondary Goals:** ${secondaryGoals}
**Target Timeline:** Sustainable, long-term approach

## MY BODY STATS
- Age: ${data.age} years old
- Gender: ${data.gender}
- Height: ${height}
- Current Weight: ${weight}
- Target Weight: ${targetWeight}
- Estimated Body Fat: ${data.bodyFatPercent ? `${data.bodyFatPercent}%` : 'Unknown'}
- Body Type: ${data.bodyType || 'Unsure'}

## MY CURRENT BASELINE
- Estimated current intake: ${data.currentCalories ? `${data.currentCalories} calories` : 'Unknown'}
- Current protein habits: ${data.currentProtein || 'Unknown'}
- Water intake: ${formatWaterIntake(data.waterIntake)}

## MY ACTIVITY & TRAINING
- Daily Activity Level: ${activityLabels[data.activityLevel || ''] || data.activityLevel}
- Training Frequency: ${data.trainingDaysPerWeek} days per week
- Session Duration: ${data.sessionDuration} minutes average
- Training Style: ${data.trainingTypes.join(', ') || 'Not specified'}
- Training Split: ${data.trainingSplit || 'Not specified'}
- Training Time: ${trainingTimeLabels[data.trainingTime || ''] || data.trainingTime || 'Not specified'}
- Injuries/Limitations: ${data.injuries || 'None'}

## MY FOOD PREFERENCES
**Dietary Restrictions:** ${data.dietaryRestrictions.join(', ') || 'None'}
**Other Allergies:** ${data.otherAllergies || 'None'}
**Foods I HATE (please avoid):** ${data.foodsToAvoid || 'None specified'}

**Proteins I Enjoy:** ${data.preferredProteins.join(', ') || 'No preference'}
**Carbs I Enjoy:** ${data.preferredCarbs.join(', ') || 'No preference'}
**Vegetables I Enjoy:** ${data.preferredVegetables.join(', ') || 'No preference'}
**Healthy Fats I Enjoy:** ${data.preferredFats.join(', ') || 'No preference'}

**Cooking Ability:** ${data.cookingAbility || 'Moderate'}
**Meal Prep Preference:** ${data.mealPrepStyle || 'Mix of both'}
**Budget:** ${data.budget || 'Moderate'}

## MY LIFESTYLE
- Sleep Schedule: Wake ${data.wakeTime || 'Not specified'}, Sleep ${data.sleepTime || 'Not specified'}
- Sleep Quality: ${data.sleepQuality || 'Not specified'}
- Stress Level: ${data.stressLevel || 'Not specified'}
- Work Schedule: ${data.workSchedule || 'Not specified'}
- Intermittent Fasting: ${data.intermittentFasting || 'No'}
- Alcohol: ${data.alcohol || 'None'}
- Eating Out: ${data.eatingOut || 'Rarely'}
- Cooking For: ${data.cookingFor || 'Just myself'}

## MY CHALLENGES
**Biggest Struggles:** ${data.struggles.join(', ') || 'None specified'}
**Previous Diets Tried:** ${data.previousDiets.join(', ') || 'None'}
**What Worked Before:** ${data.whatWorked || 'Not specified'}
**What Didn't Work:** ${data.whatDidntWork || 'Not specified'}

## MY PREFERENCES
- Meals Per Day: ${data.mealsPerDay}
- Include Snacks: ${data.includeSnacks ? 'Yes' : 'No'}
- Cheat Meal/Refeed: ${data.cheatMeal || 'No'}
- Pre/Post Workout: ${data.prePostWorkout || 'No preference'}
- Current Supplements: ${data.supplements.join(', ') || 'None'}
- Caffeine Intake: ${data.caffeineIntake || 'Not specified'}

## SPECIAL REQUESTS
${data.specialRequests || 'None'}

---

## WHAT I NEED FROM YOU

Please provide a comprehensive nutrition plan including:

### 1. CALCULATIONS & TARGETS
- Calculate my estimated BMR (Basal Metabolic Rate)
- Calculate my TDEE (Total Daily Energy Expenditure)
- Explain the calculation methodology
- Recommend daily calorie target for my goal
- Set macro targets: Protein (g) | Carbs (g) | Fats (g)
- Explain WHY these macros are optimal for my goal

### 2. MEAL TIMING STRATEGY
- Optimal meal schedule based on my training time
- Pre-workout nutrition timing and composition
- Post-workout nutrition timing and composition
- How to structure eating around my sleep schedule

### 3. DETAILED DAILY MEAL PLAN
For each meal provide:
- Exact foods and portions (in grams AND household measures)
- Macro breakdown (protein/carbs/fats/calories)
- Simple preparation instructions
- Why this meal fits my goals

### 4. WEEKLY MEAL SCHEDULE
- Sample 7-day meal rotation
- Training day vs rest day adjustments
${data.cheatMeal !== 'no' ? '- How to handle my cheat/refeed meal' : ''}

### 5. PRACTICAL GUIDANCE
- Meal prep tips for my cooking level
- Budget-friendly swaps if needed
- Eating out strategies
${data.struggles.length > 0 ? `- How to handle my specific struggles: ${data.struggles.join(', ')}` : ''}
- What to do if I miss a meal

### 6. SUPPLEMENT RECOMMENDATIONS
- Which of my current supplements to continue
- Any recommended additions for my goals
- Timing of supplements

### 7. TRACKING & ADJUSTMENTS
- Key metrics to monitor
- When and how to adjust calories
- Signs the plan is working
- Signs I need to adjust

### 8. IMPORTANT MICRONUTRIENTS
- Key vitamins/minerals to prioritize
- Any potential deficiencies to watch for my diet type

${data.allowAiFlexibility ? `### 9. ADDITIONAL SUGGESTIONS
Feel free to suggest foods not on my list if they would significantly improve my results. Explain why you're recommending them.` : ''}

---

Please be extremely specific with all quantities. Use both grams AND practical measures (cups, tablespoons, palm-size, etc.). Prioritize the foods I listed as preferences while ensuring nutritional completeness.`;
}

function generateQuickPrompt(data: AdvancedFormData, height: string, weight: string): string {
  return `Act as a sports nutritionist. Create a meal plan for me.

**Goal:** ${goalLabels[data.primaryGoal || ''] || data.primaryGoal}

**Stats:**
- ${data.age} years old, ${data.gender}
- Height: ${height}, Weight: ${weight}
- Activity: ${data.activityLevel}, Training ${data.trainingDaysPerWeek}x/week

**Food:**
- Restrictions: ${data.dietaryRestrictions.join(', ') || 'None'}
- Proteins: ${data.preferredProteins.join(', ') || 'Any'}
- ${data.mealsPerDay} meals per day

**Please provide:**
1. Daily calorie and macro targets
2. Simple daily meal plan with portions
3. Grocery list
4. Basic meal prep tips`;
}

function formatWaterIntake(intake: string | null): string {
  const labels: Record<string, string> = {
    less_1L: 'Less than 1L per day',
    '1_2L': '1-2L per day',
    '2_3L': '2-3L per day',
    '3L_plus': '3L+ per day',
  };
  return labels[intake || ''] || 'Not specified';
}
