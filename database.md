# PeakDiet Database Schema

## Overview
Database for PeakDiet app using Vercel Postgres. Tracks users (anonymous and registered), AI token usage, and saved diet plans.

## User Flow

### Anonymous Users (Free)
- Auto-generated fitness username on first visit (e.g., "IronKing_42")
- Tracked by device_id (localStorage UUID)
- Plans stored in localStorage
- Token usage tracked in DB
- Can change username anytime

### Registered Users
- Email + password required to upgrade
- Username already set (or chosen during signup)
- Plans stored in DB (persistent across devices)
- Can log in from any device
- Token history preserved from anonymous usage

## Tables

### users
Primary user table for both anonymous and registered users.

```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id       VARCHAR(255) NOT NULL,
  username        VARCHAR(50) NOT NULL,
  email           VARCHAR(255),
  password_hash   VARCHAR(255),
  is_anonymous    BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT unique_device_id UNIQUE (device_id),
  CONSTRAINT unique_email UNIQUE (email),
  CONSTRAINT unique_username UNIQUE (username)
);

CREATE INDEX idx_users_device_id ON users(device_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

### token_usage
Tracks every AI API call for usage monitoring and potential billing.

```sql
CREATE TABLE token_usage (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tokens_input    INTEGER NOT NULL,
  tokens_output   INTEGER NOT NULL,
  tokens_total    INTEGER GENERATED ALWAYS AS (tokens_input + tokens_output) STORED,
  model           VARCHAR(50) NOT NULL,
  request_type    VARCHAR(50) NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_token_usage_user_id ON token_usage(user_id);
CREATE INDEX idx_token_usage_created_at ON token_usage(created_at);
CREATE INDEX idx_token_usage_user_date ON token_usage(user_id, created_at);
```

**request_type values:**
- `generate` - New diet plan generation
- `update` - AI chat update to existing plan
- `shopping_list` - Shopping list generation

**model values:**
- `deepseek-chat` - Current model

### saved_plans
Individual diet plans saved by registered users.

```sql
CREATE TABLE saved_plans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name            VARCHAR(100) NOT NULL,
  plan_data       JSONB NOT NULL,
  is_favorite     BOOLEAN DEFAULT false,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_saved_plans_user_id ON saved_plans(user_id);
CREATE INDEX idx_saved_plans_favorite ON saved_plans(user_id, is_favorite);
```

**plan_data structure (JSONB):**
```json
{
  "summary": "string",
  "dailyTargets": {
    "calories": 2000,
    "protein": 150,
    "carbs": 200,
    "fats": 67
  },
  "meals": [
    {
      "name": "Breakfast",
      "time": "8:00 AM",
      "items": [
        { "name": "Oatmeal", "amount": "1 cup" }
      ],
      "totalMacros": { "calories": 400, "protein": 20, "carbs": 60, "fats": 10 },
      "instructions": "optional"
    }
  ],
  "tips": ["string"]
}
```

### weekly_schedules
Full 7-day meal plan layouts for registered users.

```sql
CREATE TABLE weekly_schedules (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name            VARCHAR(100) NOT NULL,
  schedule_data   JSONB NOT NULL,
  is_active       BOOLEAN DEFAULT false,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_weekly_schedules_user_id ON weekly_schedules(user_id);
CREATE INDEX idx_weekly_schedules_active ON weekly_schedules(user_id, is_active);
```

**schedule_data structure (JSONB):**
```json
{
  "Monday": { "plan_data": {...} },
  "Tuesday": { "plan_data": {...} },
  "Wednesday": null,
  "Thursday": { "plan_data": {...} },
  "Friday": { "plan_data": {...} },
  "Saturday": null,
  "Sunday": { "plan_data": {...} }
}
```

## Random Username Generator

Generate fitness-themed usernames on first visit.

**Target:** 10,000+ unique combinations (without numbers)

**Prefixes (100):**
Iron, Steel, Flex, Gains, Beast, Alpha, Titan, Power, Muscle, Protein,
Lean, Shred, Bulk, Pump, Lift, Strong, Fit, Peak, Prime, Max,
Ripped, Swole, Grind, Hustle, Core, Apex, Elite, Epic, Fury, Storm,
Thunder, Blaze, Savage, Fierce, Bold, Brave, Swift, Rapid, Turbo, Nitro,
Hyper, Ultra, Mega, Super, Atomic, Cosmic, Solar, Lunar, Nova, Venom,
Rage, Chaos, Force, Strike, Blast, Shock, Volt, Spark, Flash, Blitz,
Primal, Raw, Pure, True, Real, Hard, Heavy, Solid, Dense, Thick,
Deep, Dark, Night, Shadow, Ghost, Phantom, Stealth, Silent, Ninja, Samurai,
Viking, Spartan, Gladiator, Knight, King, Chief, Boss, Lord, Duke, Baron,
Omega, Sigma, Delta, Gamma, Zeta, Neon, Cyber, Tech, Mech, Robo

**Suffixes (100):**
Muscle, King, Mode, Master, Machine, Warrior, Champion, Legend, Beast, Force,
Power, Crusher, Slayer, Hunter, Chief, Wolf, Bear, Lion, Tiger, Hawk,
Eagle, Falcon, Cobra, Viper, Dragon, Phoenix, Titan, Giant, Colossus, Goliath,
Atlas, Zeus, Thor, Odin, Mars, Ares, Apollo, Hercules, Achilles, Spartan,
Gladiator, Knight, Samurai, Ninja, Ronin, Shogun, Warlord, Commander, Captain, General,
Soldier, Trooper, Ranger, Scout, Sniper, Striker, Bomber, Brawler, Fighter, Boxer,
Lifter, Presser, Squatter, Bencher, Deadlifter, Curler, Pumper, Repper, Setter, Getter,
Grinder, Hustler, Chaser, Seeker, Finder, Builder, Maker, Shaper, Forger, Smith,
Runner, Sprinter, Jumper, Climber, Swimmer, Rower, Cyclist, Athlete, Player, Gamer,
Winner, Victor, Champ, Pro, Star, Ace, Hero, Icon, Boss, Lord

**Unique combinations:** 100 × 100 = **10,000** (without numbers)
**With number suffix (0-99):** 10,000 × 100 = **1,000,000** combinations

**Format:** `{Prefix}{Suffix}_{number}`

**Examples:**
- IronKing_42
- BeastMode_77
- SteelWarrior_15
- GainsMaster_91
- FlexChampion_33

```typescript
function generateFitnessUsername(): string {
  const prefixes = [
    'Iron', 'Steel', 'Flex', 'Gains', 'Beast', 'Alpha', 'Titan', 'Power', 'Muscle', 'Protein',
    'Lean', 'Shred', 'Bulk', 'Pump', 'Lift', 'Strong', 'Fit', 'Peak', 'Prime', 'Max',
    'Ripped', 'Swole', 'Grind', 'Hustle', 'Core', 'Apex', 'Elite', 'Epic', 'Fury', 'Storm',
    'Thunder', 'Blaze', 'Savage', 'Fierce', 'Bold', 'Brave', 'Swift', 'Rapid', 'Turbo', 'Nitro',
    'Hyper', 'Ultra', 'Mega', 'Super', 'Atomic', 'Cosmic', 'Solar', 'Lunar', 'Nova', 'Venom',
    'Rage', 'Chaos', 'Force', 'Strike', 'Blast', 'Shock', 'Volt', 'Spark', 'Flash', 'Blitz',
    'Primal', 'Raw', 'Pure', 'True', 'Real', 'Hard', 'Heavy', 'Solid', 'Dense', 'Thick',
    'Deep', 'Dark', 'Night', 'Shadow', 'Ghost', 'Phantom', 'Stealth', 'Silent', 'Ninja', 'Samurai',
    'Viking', 'Spartan', 'Gladiator', 'Knight', 'King', 'Chief', 'Boss', 'Lord', 'Duke', 'Baron',
    'Omega', 'Sigma', 'Delta', 'Gamma', 'Zeta', 'Neon', 'Cyber', 'Tech', 'Mech', 'Robo'
  ];

  const suffixes = [
    'Muscle', 'King', 'Mode', 'Master', 'Machine', 'Warrior', 'Champion', 'Legend', 'Beast', 'Force',
    'Power', 'Crusher', 'Slayer', 'Hunter', 'Chief', 'Wolf', 'Bear', 'Lion', 'Tiger', 'Hawk',
    'Eagle', 'Falcon', 'Cobra', 'Viper', 'Dragon', 'Phoenix', 'Titan', 'Giant', 'Colossus', 'Goliath',
    'Atlas', 'Zeus', 'Thor', 'Odin', 'Mars', 'Ares', 'Apollo', 'Hercules', 'Achilles', 'Spartan',
    'Gladiator', 'Knight', 'Samurai', 'Ninja', 'Ronin', 'Shogun', 'Warlord', 'Commander', 'Captain', 'General',
    'Soldier', 'Trooper', 'Ranger', 'Scout', 'Sniper', 'Striker', 'Bomber', 'Brawler', 'Fighter', 'Boxer',
    'Lifter', 'Presser', 'Squatter', 'Bencher', 'Deadlifter', 'Curler', 'Pumper', 'Repper', 'Setter', 'Getter',
    'Grinder', 'Hustler', 'Chaser', 'Seeker', 'Finder', 'Builder', 'Maker', 'Shaper', 'Forger', 'Smith',
    'Runner', 'Sprinter', 'Jumper', 'Climber', 'Swimmer', 'Rower', 'Cyclist', 'Athlete', 'Player', 'Gamer',
    'Winner', 'Victor', 'Champ', 'Pro', 'Star', 'Ace', 'Hero', 'Icon', 'Boss', 'Lord'
  ];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const number = Math.floor(Math.random() * 100);

  return `${prefix}${suffix}_${number}`;
}
```

## Useful Queries

### Get user's total token usage
```sql
SELECT
  user_id,
  SUM(tokens_total) as total_tokens,
  COUNT(*) as request_count
FROM token_usage
WHERE user_id = $1
GROUP BY user_id;
```

### Get user's daily token usage
```sql
SELECT
  DATE(created_at) as date,
  SUM(tokens_total) as daily_tokens,
  COUNT(*) as requests
FROM token_usage
WHERE user_id = $1
  AND created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Get token usage by request type
```sql
SELECT
  request_type,
  SUM(tokens_total) as total_tokens,
  COUNT(*) as request_count,
  AVG(tokens_total) as avg_tokens
FROM token_usage
WHERE user_id = $1
GROUP BY request_type;
```

### Find user by device_id (for anonymous)
```sql
SELECT * FROM users WHERE device_id = $1;
```

### Upgrade anonymous user to registered
```sql
UPDATE users
SET
  email = $2,
  password_hash = $3,
  is_anonymous = false,
  updated_at = CURRENT_TIMESTAMP
WHERE device_id = $1;
```

### Get user's saved plans
```sql
SELECT * FROM saved_plans
WHERE user_id = $1
ORDER BY is_favorite DESC, updated_at DESC;
```

### Get user's active weekly schedule
```sql
SELECT * FROM weekly_schedules
WHERE user_id = $1 AND is_active = true;
```

## API Endpoints Needed

### Auth
- `POST /api/auth/register` - Create account (upgrade anonymous)
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Users
- `POST /api/users/init` - Initialize anonymous user (create device_id + username)
- `PATCH /api/users/username` - Update username
- `GET /api/users/usage` - Get token usage stats

### Plans
- `GET /api/plans` - Get all saved plans
- `POST /api/plans` - Save a new plan
- `PATCH /api/plans/:id` - Update a plan
- `DELETE /api/plans/:id` - Delete a plan

### Schedules
- `GET /api/schedules` - Get all weekly schedules
- `POST /api/schedules` - Save a new schedule
- `PATCH /api/schedules/:id` - Update a schedule
- `PATCH /api/schedules/:id/activate` - Set as active schedule
- `DELETE /api/schedules/:id` - Delete a schedule

### AI (existing, add tracking)
- `POST /api/ai/generate` - Generate diet plan (track tokens)
- `POST /api/ai/update` - Update diet plan via chat (track tokens)
- `POST /api/ai/shopping-list` - Generate shopping list (track tokens)

## Vercel Postgres Setup

1. Go to Vercel Dashboard > Storage > Create Database > Postgres
2. Copy connection string to `.env.local`:
   ```
   POSTGRES_URL="postgres://..."
   POSTGRES_PRISMA_URL="postgres://..."
   POSTGRES_URL_NON_POOLING="postgres://..."
   ```
3. Install: `npm install @vercel/postgres`
4. Run migrations (or use Vercel's SQL editor)

## Implementation Progress

### Done ✅
- [x] **Database Schema**: Defined in `database.md`.
- [x] **Username Generator**: Implemented in `src/utils/usernameGenerator.ts` and `api/lib/utils.ts`.
- [x] **DB Connection**: Set up in `api/lib/db.ts` using `@vercel/postgres`.
- [x] **Auth System**:
    - [x] JWT-based authentication in `api/lib/auth.ts`.
    - [x] `POST /api/auth/register` (Account creation/upgrade).
    - [x] `POST /api/auth/login` (Authentication).
    - [x] `GET /api/auth/me` (Profile retrieval).
- [x] **User Initialization**: `POST /api/users/init` for anonymous device tracking.
- [x] **Plan Management**: `GET/POST /api/plans` for saving and retrieving plans.
- [x] **Routing**: Configured `vercel.json` for API rewrites.

- [x] **Weekly Schedules API**: `GET/POST/PATCH/DELETE /api/schedules` for managing 7-day layouts.
- [x] **Deployed to Production**: All API endpoints live on Vercel with Neon Postgres.
- [x] **Token Usage Tracking (Generate)**: Server-side AI generation with token recording.
  - [x] `api/lib/token.ts` - Token recording helper (recordTokenUsage function)
  - [x] `api/ai/generate.ts` - Server-side diet plan generation with tracking
  - [x] `src/services/ai.ts` - Updated generateDietPlan & generateAdvancedDietPlan to call server API
  - [x] `api/lib/db.ts` - Fixed connection string fallback for local dev
  - [x] `src/hooks/useUser.ts` - Auto-registers users on app load, provides userId
  - [x] `src/App.tsx` - Passes userId to AI generation functions
  - [x] `src/components/screens/DietDashboardScreen.tsx` - Promise caching to prevent StrictMode double-calls
  - [x] `api/users/init.ts` - UPSERT pattern for race condition handling

**Tested & Working:**
- Token tracking verified in database (input/output tokens recorded per request)
- API key now hidden on server (no more `dangerouslyAllowBrowser`)
- Foreign key to users table ensures only valid users tracked
- Single token_usage entry per generation (StrictMode double-call fixed)
- Auto user registration on first visit

### Pending ⏳
- [ ] **Remaining AI Routes**: Migrate update, meal, shopping-list to server-side with tracking
  - [ ] `api/ai/update.ts` - Update plans via chat (still client-side)
  - [ ] `api/ai/meal.ts` - Update single meals (still client-side)
  - [ ] `api/ai/shopping-list.ts` - Generate shopping lists (still client-side)
- [ ] **Frontend Integration**: Updating `useDietStore.ts` to sync with the database.
- [ ] **User Profile UI**: Screens for login, register, and changing usernames.
- [ ] **Usage Dashboard**: Show users their token consumption stats

## Future Considerations

### Saved Plans with Slots
- Limit saves to 3 slots (free users), more for premium
- Add `slot_number` column to `saved_plans` table:
  ```sql
  ALTER TABLE saved_plans ADD COLUMN slot_number INTEGER DEFAULT 1;
  ALTER TABLE saved_plans ADD CONSTRAINT unique_user_slot UNIQUE (user_id, slot_number);
  ```
- UI: Show 3 save slots, user picks which to overwrite
- Call them "Saved Plans" or "My Diets" in UI
