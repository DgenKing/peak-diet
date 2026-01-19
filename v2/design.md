# PeakDiet (Perfect Eating Architecture Kit) - AI Diet Prompt Generator

## Overview
A mobile-first React/TypeScript web app that collects user information and generates the perfect, comprehensive prompt for AI diet plan creation. Features **Simple Mode** for beginners and **Advanced Mode** for serious users. Hosted on Vercel.

---

## Tech Stack
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS (mobile-first)
- **Build Tool**: Vite
- **Hosting**: Vercel (free tier)
- **State**: React useState (simple, no need for Redux)

---

## Two Modes Philosophy

### Simple Mode (Beginner-Friendly)
- **5 quick steps** - Get a prompt in under 2 minutes
- Minimal choices, smart defaults
- No overwhelming options
- Perfect for: First-timers, casual dieters, people who just want something that works

### Advanced Mode (Power Users)
- **8 detailed steps** - Comprehensive data collection
- Every possible customization
- Fine-tuned control over every aspect
- Perfect for: Bodybuilders, athletes, experienced dieters, coaches

**Mode Selection**: First screen after landing - big clear choice between Simple & Advanced

---

## App Flow

### Simple Mode Flow (5 Steps)
```
[Landing] → [Mode Select] → [Goal + Quick Stats] → [Activity] → [Food Basics] → [Generate]
```

### Advanced Mode Flow (8 Steps)
```
[Landing] → [Mode Select] → [Goal] → [Body Stats] → [Activity & Training] → [Food Preferences] → [Lifestyle & Timing] → [Problem Areas] → [Final Options] → [Generate]
```

---

## Quick Start Presets (Simple Mode)

On the Goal screen in Simple Mode, offer these one-click presets:

| Preset | Auto-fills |
|--------|-----------|
| **"Busy Professional"** | 3 meals, meal prep friendly, moderate cooking, quick recipes |
| **"Bodybuilder/Athlete"** | 5-6 meals, high protein focus, batch cooking, performance timing |
| **"Weight Loss Beginner"** | 3-4 meals, simple foods, portion focus, no complex cooking |
| **"Student on Budget"** | Budget-conscious, batch cooking, simple ingredients |
| **"Parent/Family Meals"** | Family-friendly foods, scalable recipes, kid-approved options |

---

## Screens Breakdown

---

### Screen 1: Landing Page (Both Modes)
- App name & logo
- Tagline: "Generate the perfect AI prompt for your personalized diet plan"
- Brief value prop (3 bullets max)
- **"Get Started"** button

---

### Screen 2: Mode Selection
Big, clear cards:

```
┌─────────────────────────────────┐
│  ⚡ SIMPLE MODE                 │
│                                 │
│  Quick & Easy                   │
│  5 steps • 2 minutes            │
│  Perfect for beginners          │
│                                 │
│  [Start Simple]                 │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  🎯 ADVANCED MODE               │
│                                 │
│  Fully Customized               │
│  8 steps • 5 minutes            │
│  Maximum precision              │
│                                 │
│  [Start Advanced]               │
└─────────────────────────────────┘
```

Small toggle: "Not sure? Start Simple - you can always switch"

---

## SIMPLE MODE SCREENS

---

### Simple Step 1: Goal + Quick Stats (Combined)

**What's your goal?** (Single select, large buttons)
- 🔥 Lose Fat
- 💪 Build Muscle
- ⚖️ Both (Recomp)
- 🏃 Get Fitter

**Quick Stats** (Essential only)
- Age: [number]
- Gender: [M / F / Other]
- Height: [with unit toggle]
- Weight: [with unit toggle]

**Optional Quick Preset**:
"I am a..." → [Busy Professional] [Athlete] [Beginner] [Student] [Parent]

---

### Simple Step 2: Activity Level

**How active is your day job?**
- 🪑 Mostly sitting (desk job)
- 🚶 Some movement (retail, teaching)
- 🏃 Very active (construction, trainer)

**Do you exercise?**
- Training days per week: [slider 0-7]
- What type? [Gym / Cardio / Sports / Mix] (single select)

---

### Simple Step 3: Food Basics

**Any dietary restrictions?**
- None
- Vegetarian
- Vegan
- Other (specify)

**Pick your favorite proteins** (multi-select, show top 6)
- Chicken, Beef, Fish, Eggs, Tofu, Protein Shake

**How's your cooking?**
- 🍳 Basic (keep it simple)
- 👨‍🍳 I can cook

**Meals per day**: [3] [4] [5]

---

### Simple Step 4: Generate Prompt
- Show generated prompt
- **[Copy Prompt]** - Big primary button
- Tips for using with ChatGPT/Claude
- "Want more control? [Switch to Advanced Mode]"

---

## ADVANCED MODE SCREENS

---

### Advanced Step 1: Goal Selection

**Primary Goal** (single select, detailed descriptions):
| Goal | Description |
|------|-------------|
| 🔥 Fat Loss / Cut | Lose body fat while preserving muscle |
| 💪 Muscle Building / Bulk | Maximize muscle gain, controlled surplus |
| ⚖️ Body Recomposition | Build muscle AND lose fat simultaneously |
| 📈 Weight Gain | Healthy weight gain for underweight |
| 🎯 Maintenance | Maintain current physique |
| 🏆 Athletic Performance | Fuel for sport-specific performance |

**Secondary Goals** (multi-select, optional):
- [ ] Increase Energy
- [ ] Improve Sleep Quality
- [ ] Better Digestion
- [ ] Reduce Inflammation
- [ ] Improve Skin/Hair
- [ ] Hormone Optimization

---

### Advanced Step 2: Body Stats

**Required:**
- Age: [16-100]
- Gender: [Male / Female / Other]
- Height: [number] + [cm / ft'in"]
- Current Weight: [number] + [kg / lbs]

**Optional but Recommended:**
- Target Weight: [number] + [kg / lbs]
- Body Fat %: [number or "I don't know"]
- Body Type:
  - Ectomorph (naturally thin, fast metabolism)
  - Mesomorph (naturally muscular, medium build)
  - Endomorph (naturally broader, slower metabolism)
  - Not sure

**Current Diet Baseline** (helps AI make realistic plan):
- Current daily calories (estimate): [number or "No idea"]
- Current protein intake: [Low / Moderate / High / No idea]
- Daily water intake: [Less than 1L / 1-2L / 2-3L / 3L+]

---

### Advanced Step 3: Activity & Training

**Daily Activity Level:**
| Level | Description |
|-------|-------------|
| Sedentary | Desk job, minimal movement |
| Lightly Active | Some walking, light activity |
| Moderately Active | On feet most of day |
| Very Active | Physical job, lots of movement |
| Extremely Active | Hard labor, professional athlete |

**Training Details:**
- Training days per week: [slider 0-7]
- Average session duration: [15 / 30 / 45 / 60 / 90 / 120 mins]

**Training Type** (multi-select):
- [ ] Weight Training / Resistance
- [ ] Cardio / Running
- [ ] HIIT
- [ ] CrossFit
- [ ] Sports (specify)
- [ ] Swimming
- [ ] Yoga / Flexibility
- [ ] Martial Arts
- [ ] Cycling
- [ ] Calisthenics
- [ ] Other

**Training Split** (if weight training):
- Full Body
- Upper/Lower
- Push/Pull/Legs
- Bro Split (body part per day)
- Custom (specify)

**Any Injuries/Limitations?** (text, optional)

---

### Advanced Step 4: Food Preferences

**Dietary Restrictions** (multi-select):
- [ ] None
- [ ] Vegetarian
- [ ] Vegan
- [ ] Pescatarian
- [ ] Keto / Low Carb
- [ ] Gluten Free
- [ ] Dairy Free
- [ ] Lactose Intolerant
- [ ] Halal
- [ ] Kosher
- [ ] Nut Allergy
- [ ] Shellfish Allergy
- [ ] Other Allergies: [text]

**Preferred Proteins** (multi-select):
- [ ] Chicken
- [ ] Beef / Steak
- [ ] Ground Beef/Turkey
- [ ] Turkey
- [ ] Pork
- [ ] Fish (white - cod, tilapia)
- [ ] Salmon
- [ ] Tuna
- [ ] Shrimp/Prawns
- [ ] Eggs
- [ ] Egg Whites
- [ ] Tofu
- [ ] Tempeh
- [ ] Greek Yogurt
- [ ] Cottage Cheese
- [ ] Protein Powder (whey)
- [ ] Protein Powder (plant)
- [ ] Beans/Legumes
- [ ] Other: [text]

**Foods You HATE** (avoid these): [text input]

**Preferred Carbs** (multi-select):
- [ ] White Rice
- [ ] Brown Rice
- [ ] Oats / Oatmeal
- [ ] Potatoes
- [ ] Sweet Potatoes
- [ ] Pasta
- [ ] Whole Grain Bread
- [ ] Quinoa
- [ ] Couscous
- [ ] Fruits
- [ ] Cream of Rice
- [ ] Bagels
- [ ] Wraps/Tortillas
- [ ] Other: [text]

**Preferred Vegetables** (multi-select):
- [ ] Broccoli
- [ ] Spinach
- [ ] Asparagus
- [ ] Green Beans
- [ ] Mixed Salad
- [ ] Peppers
- [ ] Carrots
- [ ] Zucchini
- [ ] Cauliflower
- [ ] Brussels Sprouts
- [ ] Kale
- [ ] Cucumber
- [ ] Tomatoes
- [ ] Mushrooms
- [ ] Other: [text]

**Preferred Healthy Fats** (multi-select):
- [ ] Olive Oil
- [ ] Avocado
- [ ] Nuts (almonds, cashews)
- [ ] Peanut Butter
- [ ] Almond Butter
- [ ] Coconut Oil
- [ ] Cheese
- [ ] Whole Eggs (yolks)
- [ ] Fatty Fish
- [ ] Other: [text]

---

### Advanced Step 5: Lifestyle & Timing

**Sleep Schedule:**
- Wake up time: [time picker]
- Bedtime: [time picker]
- Sleep quality: [Poor / Average / Good / Excellent]

**When do you train?**
- Early morning (before work)
- Morning
- Lunchtime
- Afternoon
- Evening (after work)
- Late night
- Varies / Irregular

**Do you intermittent fast?**
- No
- Yes - 16:8 (8 hour eating window)
- Yes - 18:6 (6 hour eating window)
- Yes - 20:4 (4 hour eating window)
- Yes - Other pattern

**Work Schedule:**
- Regular 9-5
- Shift work (rotating)
- Work from home
- Irregular / Freelance
- Night shifts

**Lifestyle Factors:**
- Stress level: [Low / Moderate / High / Very High]
- Alcohol consumption: [None / Occasional (1-2/week) / Regular (3+/week)]
- Do you eat out frequently? [Rarely / 1-2x week / 3+ times week]
- Do you travel for work? [No / Sometimes / Frequently]
- Cooking for: [Just myself / Partner / Family with kids]

---

### Advanced Step 6: Problem Areas & History

**What's your biggest nutrition struggle?** (multi-select)
- [ ] Late night eating/cravings
- [ ] Sugar cravings
- [ ] Skipping meals
- [ ] Overeating / Portion control
- [ ] Eating out too much
- [ ] Not eating enough protein
- [ ] Inconsistency / Falling off track
- [ ] Boredom with food
- [ ] Emotional eating
- [ ] Weekend overeating
- [ ] Not enough time to cook
- [ ] Don't know what to eat

**Previous diet experience:**
- [ ] Never really dieted before
- [ ] Counting calories/macros
- [ ] Keto / Low carb
- [ ] Intermittent fasting
- [ ] Meal replacement shakes
- [ ] Weight Watchers / Points
- [ ] Paleo
- [ ] Clean eating
- [ ] Competition prep
- [ ] Other

**What worked before?** [text, optional]
**What didn't work?** [text, optional]

---

### Advanced Step 7: Final Options & Preferences

**Meal Structure:**
- Meals per day: [2 / 3 / 4 / 5 / 6]
- Include snacks? [Yes / No]
- Include a cheat meal/refeed? [No / Weekly / Bi-weekly]

**Meal Prep Style:**
- Fresh meals daily
- Batch cooking / Meal prep
- Mix of both

**Cooking Ability:**
- Minimal (microwave, very basic)
- Moderate (can follow recipes)
- Advanced (comfortable with anything)

**Budget:**
- Budget-conscious (affordable staples)
- Moderate (quality ingredients)
- No constraints (premium options OK)

**Pre/Post Workout Nutrition:**
- Real food only
- Shakes are fine
- No preference

**Supplements Currently Using** (multi-select):
- [ ] Protein powder
- [ ] Creatine
- [ ] Pre-workout
- [ ] BCAAs / EAAs
- [ ] Multivitamin
- [ ] Fish oil / Omega 3
- [ ] Vitamin D
- [ ] Caffeine pills
- [ ] Fat burners
- [ ] Other: [text]

**Caffeine Intake:**
- None
- Light (1 coffee/day)
- Moderate (2-3 coffees/day)
- Heavy (4+ coffees/day)

**Special Requests** (text, optional):
"Anything else the AI should know?"

**AI Flexibility:**
☑️ Allow AI to suggest additional foods for optimal nutrition
☑️ Allow AI to recommend supplements if beneficial

---

### Advanced Step 8: Generate Prompt

**Prompt Output Options:**
- [Detailed Prompt] - Full comprehensive (default)
- [Quick Prompt] - Essentials only
- [ChatGPT Optimized] - Structured for GPT
- [Claude Optimized] - Structured for Claude

**Display:**
- Generated prompt in styled, readable box
- Character count shown
- **[Copy to Clipboard]** - Primary action
- **[Download as .txt]** - Secondary action

**Post-Generation:**
- Tips for using the prompt
- "Expected output" preview/example
- [Start Over] button
- [Edit Answers] button

---

## Generated Prompt Templates

### Detailed Prompt (Advanced Mode)

```
Act as an expert sports nutritionist, registered dietitian, and bodybuilding coach with 15+ years of experience creating personalized meal plans. I need you to create a highly detailed, science-based nutrition plan tailored to my exact specifications.

## MY GOAL
**Primary Goal:** [goal]
**Secondary Goals:** [goals if any]
**Target Timeline:** Sustainable, long-term approach

## MY BODY STATS
- Age: [age] years old
- Gender: [gender]
- Height: [height]
- Current Weight: [weight]
- Target Weight: [target or "maintain current"]
- Estimated Body Fat: [bf% or "unknown"]
- Body Type: [type or "unsure"]

## MY CURRENT BASELINE
- Estimated current intake: [calories or "unknown"]
- Current protein habits: [level]
- Water intake: [amount]

## MY ACTIVITY & TRAINING
- Daily Activity Level: [level] - [description]
- Training Frequency: [X] days per week
- Session Duration: [Y] minutes average
- Training Style: [types]
- Training Split: [split]
- Training Time: [when]
- Injuries/Limitations: [any or "none"]

## MY FOOD PREFERENCES
**Dietary Restrictions:** [list or "none"]
**Foods I CANNOT eat:** [allergies/restrictions]
**Foods I HATE (please avoid):** [list]

**Proteins I Enjoy:** [list]
**Carbs I Enjoy:** [list]
**Vegetables I Enjoy:** [list]
**Healthy Fats I Enjoy:** [list]

**Cooking Ability:** [level]
**Meal Prep Preference:** [style]
**Budget:** [level]

## MY LIFESTYLE
- Sleep Schedule: Wake [time], Sleep [time]
- Sleep Quality: [level]
- Stress Level: [level]
- Work Schedule: [type]
- Intermittent Fasting: [yes/no + window]
- Alcohol: [frequency]
- Eating Out: [frequency]
- Cooking For: [who]

## MY CHALLENGES
**Biggest Struggles:** [list]
**Previous Diets Tried:** [list]
**What Worked:** [text]
**What Didn't Work:** [text]

## MY PREFERENCES
- Meals Per Day: [number]
- Include Snacks: [yes/no]
- Cheat Meal/Refeed: [frequency]
- Pre/Post Workout: [preference]
- Current Supplements: [list]
- Caffeine Intake: [level]

## SPECIAL REQUESTS
[any additional notes]

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
- [If applicable] How to handle my cheat/refeed meal

### 5. PRACTICAL GUIDANCE
- Meal prep tips for my cooking level
- Budget-friendly swaps if needed
- Eating out strategies
- How to handle my specific struggles: [struggles]
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

[If AI flexibility enabled]
### 9. ADDITIONAL SUGGESTIONS
Feel free to suggest foods not on my list if they would significantly improve my results. Explain why you're recommending them.

---

Please be extremely specific with all quantities. Use both grams AND practical measures (cups, tablespoons, palm-size, etc.). Prioritize the foods I listed as preferences while ensuring nutritional completeness.
```

### Simple Prompt (Simple Mode)

```
Act as a nutrition coach. Create a simple, easy-to-follow meal plan for me.

**My Goal:** [goal]

**About Me:**
- Age: [age], [gender]
- Height: [height]
- Weight: [weight]
- Activity: [activity level], training [X] days/week ([type])

**Food Preferences:**
- Diet: [restrictions or "no restrictions"]
- Proteins I like: [list]
- Cooking level: [level]
- Meals per day: [number]

**Please provide:**
1. My recommended daily calories and protein target
2. A simple daily meal plan with exact portions
3. A basic grocery list
4. Meal prep tips to make this easy

Keep it simple and practical. I want something I can actually stick to!
```

---

## File Structure

```
diet-perfect/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── CheckboxGroup.tsx
│   │   │   ├── RadioGroup.tsx
│   │   │   ├── Slider.tsx
│   │   │   ├── Toggle.tsx
│   │   │   ├── TimePicker.tsx
│   │   │   ├── TextArea.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── Tooltip.tsx
│   │   ├── screens/
│   │   │   ├── LandingScreen.tsx
│   │   │   ├── ModeSelectScreen.tsx
│   │   │   ├── simple/
│   │   │   │   ├── SimpleGoalScreen.tsx
│   │   │   │   ├── SimpleActivityScreen.tsx
│   │   │   │   ├── SimpleFoodScreen.tsx
│   │   │   │   └── SimplePromptScreen.tsx
│   │   │   └── advanced/
│   │   │       ├── GoalScreen.tsx
│   │   │       ├── BodyStatsScreen.tsx
│   │   │       ├── ActivityScreen.tsx
│   │   │       ├── FoodPreferencesScreen.tsx
│   │   │       ├── LifestyleScreen.tsx
│   │   │       ├── ProblemAreasScreen.tsx
│   │   │       ├── FinalOptionsScreen.tsx
│   │   │       └── AdvancedPromptScreen.tsx
│   │   ├── shared/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── PromptDisplay.tsx
│   │   └── Layout.tsx
│   ├── hooks/
│   │   ├── useFormData.ts
│   │   ├── useLocalStorage.ts
│   │   └── useCopyToClipboard.ts
│   ├── utils/
│   │   ├── promptGenerator.ts
│   │   ├── simplePromptGenerator.ts
│   │   ├── calculations.ts
│   │   └── presets.ts
│   ├── types/
│   │   └── index.ts
│   ├── data/
│   │   ├── foodOptions.ts
│   │   ├── goals.ts
│   │   └── presets.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── vercel.json
```

---

## TypeScript Types

```typescript
// Mode
type AppMode = 'simple' | 'advanced';

// Goals
type PrimaryGoal =
  | 'fat_loss'
  | 'muscle_building'
  | 'recomposition'
  | 'weight_gain'
  | 'maintenance'
  | 'athletic_performance';

type SecondaryGoal =
  | 'increase_energy'
  | 'improve_sleep'
  | 'better_digestion'
  | 'reduce_inflammation'
  | 'improve_skin_hair'
  | 'hormone_optimization';

// Activity
type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extremely_active';

type TrainingTime =
  | 'early_morning'
  | 'morning'
  | 'lunchtime'
  | 'afternoon'
  | 'evening'
  | 'late_night'
  | 'varies';

// Lifestyle
type SleepQuality = 'poor' | 'average' | 'good' | 'excellent';
type StressLevel = 'low' | 'moderate' | 'high' | 'very_high';
type Frequency = 'none' | 'occasional' | 'regular' | 'frequent';
type CookingLevel = 'minimal' | 'moderate' | 'advanced';
type Budget = 'budget' | 'moderate' | 'unlimited';
type MealPrepStyle = 'fresh' | 'batch' | 'mix';

// Form Data
interface SimpleFormData {
  // Goal
  goal: 'lose_fat' | 'build_muscle' | 'both' | 'get_fitter';
  preset?: string;

  // Stats
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  heightUnit: 'cm' | 'ft';
  weight: number;
  weightUnit: 'kg' | 'lbs';

  // Activity
  dailyActivity: 'sitting' | 'some_movement' | 'very_active';
  trainingDays: number;
  trainingType: 'gym' | 'cardio' | 'sports' | 'mix';

  // Food
  dietaryRestriction: 'none' | 'vegetarian' | 'vegan' | 'other';
  otherRestriction?: string;
  proteins: string[];
  cookingLevel: 'basic' | 'can_cook';
  mealsPerDay: number;
}

interface AdvancedFormData {
  // Goals
  primaryGoal: PrimaryGoal;
  secondaryGoals: SecondaryGoal[];

  // Body Stats
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  heightUnit: 'cm' | 'ft';
  heightInches?: number; // for ft/in
  weight: number;
  weightUnit: 'kg' | 'lbs';
  targetWeight?: number;
  bodyFatPercent?: number;
  bodyType?: 'ectomorph' | 'mesomorph' | 'endomorph';

  // Current Baseline
  currentCalories?: number;
  currentProtein: 'low' | 'moderate' | 'high' | 'unknown';
  waterIntake: 'less_1L' | '1_2L' | '2_3L' | '3L_plus';

  // Activity
  activityLevel: ActivityLevel;
  trainingDaysPerWeek: number;
  sessionDuration: number;
  trainingTypes: string[];
  trainingSplit?: string;
  trainingTime: TrainingTime;
  injuries?: string;

  // Food Preferences
  dietaryRestrictions: string[];
  otherAllergies?: string;
  foodsToAvoid?: string;
  preferredProteins: string[];
  preferredCarbs: string[];
  preferredVegetables: string[];
  preferredFats: string[];

  // Lifestyle
  wakeTime: string;
  sleepTime: string;
  sleepQuality: SleepQuality;
  stressLevel: StressLevel;
  workSchedule: string;
  intermittentFasting: string;
  alcohol: Frequency;
  eatingOut: Frequency;
  travelForWork: boolean;
  cookingFor: 'self' | 'partner' | 'family';

  // Problem Areas
  struggles: string[];
  previousDiets: string[];
  whatWorked?: string;
  whatDidntWork?: string;

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
  specialRequests?: string;
  allowAiFlexibility: boolean;
  allowSupplementRecs: boolean;
}

// Prompt Options
type PromptType = 'detailed' | 'quick' | 'chatgpt' | 'claude';
```

---

## UI/UX Design Guidelines

### Mobile-First Principles
1. **Touch targets**: Minimum 48px height for all interactive elements
2. **Single column**: Everything stacks vertically
3. **Large text**: Body 16px, headings 24-32px
4. **Thumb zone**: Primary actions at bottom of screen
5. **Progress bar**: Always visible, shows step X of Y
6. **Swipe support**: Optional swipe between steps

### Visual Hierarchy
```
Screen Title (24px, bold)
↓
Section Label (18px, semibold, muted)
↓
Input/Selection (16px)
↓
Helper Text (14px, muted)
↓
[Navigation Buttons at Bottom]
```

### Mode-Specific Styling

**Simple Mode:**
- Larger touch targets
- Fewer options per screen
- More whitespace
- Friendly, encouraging copy
- Progress: "Step 2 of 4"

**Advanced Mode:**
- Compact but readable
- Collapsible sections for optional fields
- More detailed labels
- Professional tone
- Progress: "Step 3 of 8 - Activity & Training"

### Color Scheme
```css
/* Primary Palette */
--primary: #10B981;        /* Emerald - main actions */
--primary-dark: #059669;   /* Hover state */
--secondary: #3B82F6;      /* Blue - links, secondary */

/* Backgrounds */
--bg-light: #F9FAFB;       /* Page background */
--bg-card: #FFFFFF;        /* Card/input background */
--bg-muted: #F3F4F6;       /* Disabled, muted areas */

/* Text */
--text-primary: #1F2937;   /* Main text */
--text-secondary: #6B7280; /* Labels, helper text */
--text-muted: #9CA3AF;     /* Placeholder */

/* States */
--success: #10B981;
--error: #EF4444;
--warning: #F59E0B;

/* Mode Accents */
--simple-accent: #10B981;  /* Green - friendly */
--advanced-accent: #6366F1; /* Indigo - professional */
```

---

## Build Instructions

### 1. Initialize Project
```bash
npm create vite@latest diet-perfect -- --template react-ts
cd diet-perfect
npm install
```

### 2. Install Dependencies
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Configure Tailwind (tailwind.config.js)
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981',
          dark: '#059669',
        },
        secondary: '#3B82F6',
        advanced: '#6366F1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 4. Add Base Styles (src/index.css)
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  @apply bg-gray-50 text-gray-900 min-h-screen font-sans;
  -webkit-tap-highlight-color: transparent;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full;
}

/* Focus states */
input:focus, select:focus, textarea:focus, button:focus {
  @apply outline-none ring-2 ring-primary ring-opacity-50;
}
```

### 5. Create vercel.json
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### 6. Deploy
```bash
npm run build
npx vercel --prod
```

---

## Development Phases

### Phase 1: Foundation
- [ ] Project setup (Vite + React + TS + Tailwind)
- [ ] Basic routing/navigation
- [ ] UI components library
- [ ] Layout with progress bar

### Phase 2: Simple Mode
- [ ] Mode selection screen
- [ ] Simple mode 4 screens
- [ ] Simple prompt generator
- [ ] Copy to clipboard

### Phase 3: Advanced Mode
- [ ] All 8 advanced screens
- [ ] Advanced prompt generator
- [ ] Prompt type selection (detailed/quick/chatgpt/claude)

### Phase 4: Polish
- [ ] Animations/transitions
- [ ] Form validation
- [ ] Error handling
- [ ] Loading states
- [ ] LocalStorage persistence

### Phase 5: Launch
- [ ] Mobile testing
- [ ] Performance optimization
- [ ] SEO meta tags
- [ ] Deploy to Vercel

---

## Key Features Summary

### Core Features
- Two distinct modes (Simple & Advanced)
- Step-by-step wizard flow
- Smart presets for quick start
- Comprehensive data collection
- Multiple prompt output formats
- One-click copy to clipboard
- Mobile-first responsive design

### UX Features
- Progress indicator
- Form validation
- Unit toggles (metric/imperial)
- Optional field collapsing
- "Foods I hate" exclusion
- Edit answers before generating
- Switch modes mid-flow

### Quality of Life
- LocalStorage save/resume
- Download prompt as .txt
- Example output preview
- Tips for AI usage
- Dark mode (future)

---

## Success Metrics
- Time to complete Simple mode: < 2 minutes
- Time to complete Advanced mode: < 5 minutes
- Copy success rate: Track clipboard copies
- Mode split: Monitor Simple vs Advanced usage
