# PeakDiet - Feature Documentation

## What is PeakDiet?

PeakDiet is an **AI-powered weekly meal planning app** that generates personalized diet plans using DeepSeek AI. Unlike a simple prompt generator, it directly creates structured meal plans, allows real-time modifications via natural language, and manages your entire week's nutrition.

---

## Core Features

### 1. Weekly Planner (Home Screen)

The central hub for managing your week's diet.

- **7-Day Calendar View**: Visual grid showing Monday through Sunday
- **Day Status Indicators**: See which days have plans assigned
- **Quick Actions**:
  - Tap any day to view/edit its plan
  - Clear individual days
  - Generate new plans for empty days
- **AI Shopping List**: Generate a consolidated grocery list from all filled days (appears when week is complete)

---

### 2. Two Input Modes

#### Simple Mode (4 Steps)
Perfect for beginners who want quick results.

| Step | What You Enter |
|------|----------------|
| **1. Goal + Stats** | Goal (lose fat, build muscle, both, get fitter), Age, Gender, Height, Weight, Optional preset (Busy Professional, Athlete, etc.) |
| **2. Activity** | Daily activity level, Training days per week, Training type |
| **3. Food** | Dietary restrictions, Preferred proteins, Cooking level, Meals per day |
| **4. Dashboard** | AI generates your plan |

#### Advanced Mode (8 Steps)
For serious users who want maximum control.

| Step | What You Enter |
|------|----------------|
| **1. Goals** | Primary goal + secondary goals (energy, sleep, digestion, etc.) |
| **2. Body Stats** | Full stats + target weight, body fat %, body type, current baseline |
| **3. Activity** | Detailed activity level, training frequency, duration, types, split, injuries |
| **4. Food** | Full dietary restrictions, preferred proteins/carbs/veggies/fats, foods to avoid |
| **5. Lifestyle** | Sleep schedule, training time, fasting, work schedule, stress, alcohol, eating out |
| **6. Problems** | Nutrition struggles, diet history, what worked/didn't work |
| **7. Options** | Meals per day, snacks, cheat meals, meal prep style, budget, supplements, caffeine |
| **8. Dashboard** | AI generates your plan |

---

### 3. Diet Dashboard (Per Day)

The main interface for viewing and modifying a day's diet plan.

#### Plan Display
- **Summary**: AI-generated explanation of the plan's strategy
- **Daily Macro Targets**: Calories, Protein, Carbs, Fats displayed in cards
- **Meal Cards**: Each meal shows:
  - Meal name and suggested time
  - Food items with portions
  - Per-meal macro breakdown
  - Optional cooking instructions
- **Pro Tips**: AI-generated advice specific to your plan

#### Interactive AI Editing
Type natural language instructions to modify your plan in real-time:

**Example Commands:**
- "Swap chicken for beef"
- "Make lunch vegetarian"
- "I'm going out drinking tonight, 4 pints of lager, adjust my diet"
- "Add a snack between lunch and dinner"
- "Reduce carbs and increase protein"
- "I skipped breakfast, redistribute those calories"
- "Make this meal bigger and dinner smaller"
- "Replace rice with sweet potato"

The AI takes your current plan + instruction and returns an updated plan with recalculated macros.

#### Copy to Days
- Copy current plan to other days of the week
- Select multiple days at once
- Shows which days are already occupied

---

### 4. AI Shopping List

Automatically generates a consolidated grocery list from your weekly meal plans.

**Features:**
- **Smart Aggregation**: Combines identical ingredients (e.g., "150g chicken" + "200g chicken" = "350g chicken")
- **Categorized Output**: Organized by Produce, Meat/Protein, Dairy, Pantry, etc.
- **Caching**: List is cached and only regenerates when meal plans change
- **Change Detection**: Shows "Rebuild List" button when plans have been modified
- **Copy to Clipboard**: One-click copy for easy shopping

---

### 5. Data Persistence

Data is saved locally and synced to the cloud for registered users.

**Local Storage (All Users):**
- Weekly schedule (all 7 days' plans)
- User stats (auto-fills next time you create a plan)
- Shopping list cache with change detection hash
- Device ID for anonymous user tracking

**Cloud Storage (Registered Users):**
- Saved plans library (up to 3 slots)
- Weekly schedules (multiple saved weeks)
- Token usage history
- Cross-device sync

---

### 6. User Accounts

#### Anonymous Users (Default)
- Auto-generated fitness username on first visit (e.g., "IronKing_42", "BeastMode_77")
- 1,000,000+ unique username combinations
- Tracked by device ID
- Plans stored locally
- Can upgrade to registered anytime

#### Registered Users
- Email + password to create account
- Keep your username or choose a new one
- Plans sync across devices
- Token usage history preserved
- Login from any device

---

### 7. Navigation

#### Burger Menu
- Accessible from top-left on all screens
- Quick links: Weekly Planner, Your Week Summary, Feedback
- Consistent navigation across the app

#### Your Week Summary
- Overview of all 7 days at a glance
- Shows which days have plans
- Quick macro totals for the week

---

### 8. Feedback Form
- Built-in feedback submission via Formspree
- Accessible from burger menu
- Direct line to developers

---

### 9. User Experience Features

#### Loading Experience
- **Animated Logo Spinner**: Pulsing logo animation during AI generation
- **Rotating Tips**: 504 nutrition tips that cycle every 7 seconds during loading
- **Progress Feedback**: Clear indication of what's happening

#### Theme Support
- **Dark/Light Mode**: Toggle in top-right corner
- **System Preference**: Respects user's OS setting
- **Persistent**: Remembers your choice

#### Getting Started Tutorial
- Accessible from landing page
- Explains how the app works
- Shows example workflows

#### Mobile-First Design
- Touch-friendly targets (48px minimum)
- Single-column layout
- Thumb-zone optimized navigation
- Responsive across all screen sizes

---

### 10. Unit Support

- **Height**: cm or ft/inches
- **Weight**: kg or lbs
- **Automatic Conversion**: Displayed in your preferred unit

---

## Technical Implementation

### AI Integration

**Provider**: DeepSeek API (OpenAI-compatible)

**Endpoints:**
| Function | Purpose |
|----------|---------|
| `generateDietPlan()` | Creates new plan from Simple Mode data |
| `generateAdvancedDietPlan()` | Creates new plan from Advanced Mode data |
| `updateDietPlan()` | Modifies existing plan via natural language |
| `generateShoppingList()` | Creates consolidated grocery list |

**Validation**: All AI responses are validated with Zod schemas to ensure correct structure.

### Data Schema

```typescript
interface DietPlan {
  summary: string;
  dailyTargets: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: Array<{
    name: string;
    time?: string;
    items: Array<{
      name: string;
      amount: string;
      macros?: { protein, carbs, fats, calories };
    }>;
    totalMacros?: { protein, carbs, fats, calories };
    instructions?: string;
  }>;
  tips?: string[];
}
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Styling | Tailwind CSS v4 |
| Build | Vite |
| AI | DeepSeek API |
| Validation | Zod |
| Local Storage | localStorage |
| Database | Vercel Postgres (Neon) |
| Auth | JWT + bcrypt |
| API | Vercel Serverless Functions |
| Hosting | Vercel |

---

## Screen Flow

```
Landing Page
    │
    ├── "Get Started" → Weekly Planner
    │                        │
    │                        ├── Tap empty day → Mode Select
    │                        │                      │
    │                        │                      ├── Simple Mode (4 steps) → Dashboard
    │                        │                      │
    │                        │                      └── Advanced Mode (8 steps) → Dashboard
    │                        │
    │                        ├── Tap filled day → Dashboard (view/edit)
    │                        │
    │                        └── Shopping List (when week complete)
    │
    └── "How It Works" → Getting Started Tutorial
```

---

## Quick Start Presets (Simple Mode)

One-click presets that auto-fill common configurations:

| Preset | Configuration |
|--------|---------------|
| **Busy Professional** | 3 meals, meal prep friendly, moderate cooking |
| **Bodybuilder/Athlete** | 5-6 meals, high protein, batch cooking |
| **Weight Loss Beginner** | 3-4 meals, simple foods, portion focus |
| **Student on Budget** | Budget-conscious, batch cooking, simple ingredients |
| **Parent/Family Meals** | Family-friendly, scalable recipes |

---

## API Endpoints

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Create account (upgrade from anonymous) |
| `/api/auth/login` | POST | Login with email/password |
| `/api/auth/me` | GET | Get current user profile |

### Users
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users/init` | POST | Initialize anonymous user with device ID |

### Plans
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/plans` | GET | Get all saved plans |
| `/api/plans` | POST | Save a new plan |

### Schedules
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/schedules` | GET | Get all weekly schedules |
| `/api/schedules` | POST | Create new schedule |
| `/api/schedules/:id` | GET | Get single schedule |
| `/api/schedules/:id` | PATCH | Update schedule |
| `/api/schedules/:id` | DELETE | Delete schedule |

---

## Future Features (Planned)

- [ ] Saved Plans UI (3 save slots for free users)
- [ ] User profile screen (login/register/change username)
- [ ] Token usage tracking and limits
- [ ] Conversational chat for questions without modifying plan
- [ ] Meal reminders/notifications
- [ ] Meal check-in tracking
- [ ] Progress photos
- [ ] Weight tracking over time
- [ ] Recipe details and cooking instructions
- [ ] Nutritionist sharing
- [ ] Voice input for modifications
- [ ] Premium tier with more save slots
