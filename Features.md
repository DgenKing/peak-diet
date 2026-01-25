# PeakDiet - Feature Documentation

## What is PeakDiet?

PeakDiet is an **AI-powered weekly meal planning app** that generates personalized diet plans using DeepSeek AI. Unlike a simple prompt generator, it directly creates structured meal plans, allows real-time modifications via natural language, and manages your entire week's nutrition with cloud synchronization.

---

## Core Features

### 1. Weekly Planner (Home Screen)

The central hub for managing your week's diet.

- **7-Day Calendar View**: Visual grid showing Monday through Sunday.
- **Day Status Indicators**: See which days have plans assigned.
- **Quick Actions**:
  - Tap any day to view/edit its plan.
  - Clear individual days or the entire week.
  - Generate new plans for empty days.
- **AI Shopping List**: Generate a consolidated grocery list from all filled days (appears when week is complete).
- **Macro Summaries**: Automatic calculation of weekly averages and daily totals.

---

### 2. Two Input Modes

#### Simple Mode (4 Steps)
Perfect for beginners who want quick results.

| Step | What You Enter |
|------|----------------|
| **1. Goal + Stats** | Goal (lose fat, build muscle, both, get fitter), Age, Gender, Height, Weight, Optional preset. |
| **2. Activity** | Daily activity level, Training days per week, Training type. |
| **3. Food** | Dietary restrictions, Preferred proteins, Cooking level, Meals per day. |
| **4. Dashboard** | AI generates your plan. |

#### Advanced Mode (8 Steps)
For serious users who want maximum control.

| Step | What You Enter |
|------|----------------|
| **1. Goals** | Primary goal + secondary goals (energy, sleep, digestion, etc.). |
| **2. Body Stats** | Full stats + target weight, body fat %, body type, current baseline. |
| **3. Activity** | Detailed activity level, training frequency, duration, types, split, injuries. |
| **4. Food** | Full dietary restrictions, preferred proteins/carbs/veggies/fats, foods to avoid. |
| **5. Lifestyle** | Sleep schedule, training time, fasting, work schedule, stress, alcohol, eating out. |
| **6. Problems** | Nutrition struggles, diet history, what worked/didn't work. |
| **7. Options** | Meals per day, snacks, cheat meals, meal prep style, budget, supplements, caffeine. |
| **8. Dashboard** | AI generates your plan. |

---

### 3. Diet Dashboard (Per Day)

The main interface for viewing and modifying a day's diet plan.

#### Plan Display
- **Summary**: AI-generated explanation of the plan's strategy.
- **Daily Macro Targets**: Calories, Protein, Carbs, Fats displayed in cards.
- **Meal Cards**: Interactive cards showing:
  - Meal name and suggested time.
  - Food items with portions and per-item macros.
  - Per-meal macro breakdown.
  - Optional cooking instructions (AI-generated tips).
- **Pro Tips**: AI-generated advice specific to your plan.

#### Interactive AI Editing
- **Full Plan Chat**: Modify the entire day via natural language commands (e.g., "Swap chicken for beef").
- **Focused Meal Editor**: Tap any meal to open a dedicated modal for specific changes (e.g., "Swap eggs for bacon"). The AI balances other ingredients to maintain meal macros.

#### Copy to Days
- Copy current plan to other days of the week.
- Select multiple days at once.
- Visual feedback on occupied days.

---

### 4. AI Shopping List

Automatically generates a consolidated grocery list from your weekly meal plans.

**Features:**
- **Smart Aggregation**: Combines identical ingredients (e.g., "150g chicken" + "200g chicken" = "350g chicken").
- **Categorized Output**: Organized by Produce, Meat/Protein, Dairy, Pantry, etc.
- **Caching & Hash Detection**: List is cached and only prompts for "Rebuild" when plans have changed.
- **Copy to Clipboard**: One-click copy for easy shopping.

---

### 5. Data Persistence & Sync

Real-time synchronization between LocalStorage and Cloud Database (Vercel Postgres/Neon).

**Local Storage (All Users):**
- Offline access to current weekly schedule.
- User stats auto-fill for new plan generation.
- Shopping list cache.
- Anonymous Device ID tracking.

**Cloud Sync (Registered Users):**
- **Real-time Synchronization**: Every change to the weekly schedule or library is synced to the database.
- **Cross-Device Access**: Access your diet from any device by signing in.
- **Library Persistence**: Permanent storage for "Saved Plans" beyond the 7-day week.

---

### 6. User Accounts & Profile

#### Anonymous Users (Default)
- **Auto-generated Identity**: Fitness-themed username on first visit (e.g., "IronKing_42").
- **1,000,000+ Combinations**: Large pool of unique usernames.
- **Seamless Upgrade**: Register with email/password to convert anonymous data to a cloud account.
- **Status Label**: "Device Only" (amber) - indicates data stored locally only.

#### Registered Users
- **Profile Management**: View stats and usage history.
- **Session Persistence**: Stays logged in via secure HTTP-only cookies.
- **Customization**: Ability to keep the auto-generated name or pick a new one.
- **Status Label**: "Cloud Sync ✓" (green) - indicates data backed up to cloud.

---

### 7. Usage Dashboard

A transparency feature showing your AI consumption.

- **Lifetime Stats**: Total tokens consumed and total AI requests.
- **Efficiency Metrics**: Average tokens per request.
- **Feature Breakdown**: Usage categorized by generation, updates, meal edits, and shopping lists.
- **Daily Activity**: 7-day bar chart showing consumption trends.

---

### 8. Navigation & UX

#### Burger Menu
- **User Status Card**: Shows current username and Anonymous/Registered status.
- **Quick Actions**: "Sign In to Sync", "Usage Stats", "Your Week", "Clear Week".
- **Theme Toggle**: Switch between Light and Dark modes.

#### User Experience
- **Smart Entry Logic**: Automatically detects existing meal plans on load, skipping the landing page to provide instant access to the weekly schedule.
- **Visual Day Highlighting**: The current system day is highlighted in the Weekly Planner with a high-contrast emerald theme, making it easy to track today's goals.
- **Animated Loading**: Pulsing logo spinner during AI generation.
- **500+ Nutrition Tips**: Cycling tips during wait times.
- **Success Feedback**: Modal confirmations for sign-out and library actions.
- **Mobile-First**: Fully responsive, touch-optimized UI.

---

## Technical Implementation

### Consolidated Backend (Hobby Plan Optimized)
The entire backend is consolidated into root serverless functions to fit within Vercel's Hobby plan (12 function limit).

| Handler | Purpose |
|---------|---------|
| `api/ai.ts` | Single entry for all AI tasks (Generate, Update, Meal Edit, List). |
| `api/auth.ts` | Login, Registration, Session verification, and Logout. |
| `api/users.ts` | Anonymous user initialization. |
| `api/plans.ts` | Full CRUD for saved diet plan library. |
| `api/schedules.ts` | Weekly schedule persistence. |
| `api/usage.ts` | Aggregated token usage statistics. |
| `api/schedules/[id].ts` | Individual schedule management. |

### Data Schema (DietPlan)
```typescript
interface DietPlan {
  summary: string;
  dailyTargets: { calories, protein, carbs, fats };
  meals: Array<{
    name: string;
    time?: string;
    items: Array<{ name, amount, macros? }>;
    totalMacros?: { calories, protein, carbs, fats };
    instructions?: string;
  }>;
  tips?: string[];
}
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 + TypeScript |
| **Styling** | Tailwind CSS v4 |
| **State** | React Context (User) + custom hooks (DietStore) |
| **Database** | Vercel Postgres (Neon) |
| **AI** | DeepSeek Chat API (sk-ed5a...) |
| **Auth** | JWT (Cookie-based) + bcryptjs |
| **Hosting** | Vercel (Serverless Functions) |

---

## Future Features (Planned)

- [ ] Conversational chat for questions without modifying plan.
- [ ] Meal reminders/notifications.
- [ ] Meal check-in tracking (log what you actually ate).
- [ ] Progress photos and weight tracking over time.
- [ ] Comprehensive recipe details and ingredient measurements.
- [ ] Nutritionist sharing (export PDF or share link).
- [ ] Voice input for modifications.
- [ ] Premium tier with infinite save slots and advanced analytics.
- [ ] "Recalibrate" button: Conditional option to fix remaining daily macros in one step after manual edits.