// Mode
export type AppMode = 'simple' | 'advanced';

// Screen/Step tracking
export type SimpleStep = 'goal' | 'activity' | 'food' | 'dashboard';
export type AdvancedStep = 'goal' | 'stats' | 'activity' | 'food' | 'lifestyle' | 'problems' | 'options' | 'prompt';

// Goals
export type SimpleGoal = 'lose_fat' | 'build_muscle' | 'both' | 'get_fitter';

export type PrimaryGoal =
  | 'fat_loss'
  | 'muscle_building'
  | 'recomposition'
  | 'weight_gain'
  | 'maintenance'
  | 'athletic_performance';

export type SecondaryGoal =
  | 'increase_energy'
  | 'improve_sleep'
  | 'better_digestion'
  | 'reduce_inflammation'
  | 'improve_skin_hair'
  | 'hormone_optimization';

// Activity
export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extremely_active';

export type SimpleActivity = 'sitting' | 'some_movement' | 'very_active';

export type TrainingType = 'gym' | 'cardio' | 'sports' | 'mix';

export type TrainingTime =
  | 'early_morning'
  | 'morning'
  | 'lunchtime'
  | 'afternoon'
  | 'evening'
  | 'late_night'
  | 'varies';

// Lifestyle
export type SleepQuality = 'poor' | 'average' | 'good' | 'excellent';
export type StressLevel = 'low' | 'moderate' | 'high' | 'very_high';
export type Frequency = 'none' | 'occasional' | 'regular' | 'frequent';
export type CookingLevel = 'minimal' | 'moderate' | 'advanced';
export type SimpleCooking = 'basic' | 'can_cook';
export type Budget = 'budget' | 'moderate' | 'unlimited';
export type MealPrepStyle = 'fresh' | 'batch' | 'mix';
export type ProteinLevel = 'low' | 'moderate' | 'high' | 'unknown';
export type WaterIntake = 'less_1L' | '1_2L' | '2_3L' | '3L_plus';

// Presets
export type Preset =
  | 'busy_professional'
  | 'athlete'
  | 'beginner'
  | 'student'
  | 'parent'
  | 'vegan'
  | 'vegetarian'
  | 'keto'
  | 'gluten_free'
  | 'paleo'
  | 'intermittent_fasting';

// Simple Form Data
export interface SimpleFormData {
  goal: SimpleGoal | null;
  preset: Preset | null;
  age: number | null;
  gender: 'male' | 'female' | 'other' | null;
  height: number | null;
  heightUnit: 'cm' | 'ft';
  heightInches: number | null;
  weight: number | null;
  weightUnit: 'kg' | 'lbs';
  dailyActivity: SimpleActivity | null;
  trainingDays: number;
  trainingType: TrainingType | null;
  dietaryRestriction: 'none' | 'vegetarian' | 'vegan' | 'other' | null;
  otherRestriction: string;
  proteins: string[];
  otherProtein?: string;
  cookingLevel: SimpleCooking | null;
  mealsPerDay: number;
}

// Advanced Form Data
export interface AdvancedFormData {
  // Goals
  primaryGoal: PrimaryGoal | null;
  secondaryGoals: SecondaryGoal[];

  // Body Stats
  age: number | null;
  gender: 'male' | 'female' | 'other' | null;
  height: number | null;
  heightUnit: 'cm' | 'ft';
  heightInches: number | null;
  weight: number | null;
  weightUnit: 'kg' | 'lbs';
  targetWeight: number | null;
  bodyFatPercent: number | null;
  bodyType: 'ectomorph' | 'mesomorph' | 'endomorph' | null;

  // Current Baseline
  currentCalories: number | null;
  currentProtein: ProteinLevel;
  waterIntake: WaterIntake | null;

  // Activity
  activityLevel: ActivityLevel | null;
  trainingDaysPerWeek: number;
  sessionDuration: number;
  trainingTypes: string[];
  trainingSplit: string;
  trainingTime: TrainingTime | null;
  injuries: string;

  // Food Preferences
  dietaryRestrictions: string[];
  otherAllergies: string;
  foodsToAvoid: string;
  preferredProteins: string[];
  preferredCarbs: string[];
  preferredVegetables: string[];
  preferredFats: string[];

  // Lifestyle
  wakeTime: string;
  sleepTime: string;
  sleepQuality: SleepQuality | null;
  stressLevel: StressLevel | null;
  workSchedule: string;
  intermittentFasting: string;
  alcohol: Frequency;
  eatingOut: Frequency;
  travelForWork: boolean;
  cookingFor: 'self' | 'partner' | 'family';

  // Problem Areas
  struggles: string[];
  previousDiets: string[];
  whatWorked: string;
  whatDidntWork: string;

  // Final Options
  mealsPerDay: number;
  includeSnacks: boolean;
  cheatMeal: 'no' | 'weekly' | 'biweekly';
  mealPrepStyle: MealPrepStyle;
  cookingAbility: CookingLevel;
  budget: Budget;
  prePostWorkout: 'real_food' | 'shakes' | 'no_preference';
  supplements: string[];
  caffeineIntake: 'none' | 'light' | 'moderate' | 'heavy';
  specialRequests: string;
  allowAiFlexibility: boolean;
  allowSupplementRecs: boolean;
}

// Prompt type
export type PromptType = 'detailed' | 'quick' | 'chatgpt' | 'claude';
