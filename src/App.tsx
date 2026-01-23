import { useState, useEffect } from 'react';
import type { AppMode, SimpleFormData, AdvancedFormData, SimpleStep, AdvancedStep } from './types';
import { useTheme } from './hooks/useTheme';
import { BurgerMenu } from './components/ui/BurgerMenu';

// Screens
import { LandingScreen } from './components/screens/LandingScreen';
import { ModeSelectScreen } from './components/screens/ModeSelectScreen';
import { WeeklyPlannerScreen } from './components/screens/WeeklyPlannerScreen';

// Simple Mode
import { SimpleGoalScreen } from './components/screens/simple/SimpleGoalScreen';
import { SimpleActivityScreen } from './components/screens/simple/SimpleActivityScreen';
import { SimpleFoodScreen } from './components/screens/simple/SimpleFoodScreen';
import { DietDashboardScreen } from './components/screens/DietDashboardScreen';

// Advanced Mode
import { AdvancedGoalScreen } from './components/screens/advanced/AdvancedGoalScreen';
import { AdvancedStatsScreen } from './components/screens/advanced/AdvancedStatsScreen';
import { AdvancedActivityScreen } from './components/screens/advanced/AdvancedActivityScreen';
import { AdvancedFoodScreen } from './components/screens/advanced/AdvancedFoodScreen';
import { AdvancedLifestyleScreen } from './components/screens/advanced/AdvancedLifestyleScreen';
import { AdvancedProblemsScreen } from './components/screens/advanced/AdvancedProblemsScreen';
import { AdvancedOptionsScreen } from './components/screens/advanced/AdvancedOptionsScreen';

import { GettingStartedScreen } from './components/screens/GettingStartedScreen';
import { FeedbackScreen } from './components/screens/FeedbackScreen';

// AI Services
import { generateDietPlan, generateAdvancedDietPlan } from './services/ai';
import { useDietStore } from './hooks/useDietStore';
import type { DayOfWeek, DietPlan } from './types/diet';

const initialSimpleData: SimpleFormData = {
  goal: null,
  preset: null,
  age: null,
  gender: null,
  height: null,
  heightUnit: 'cm',
  heightInches: null,
  weight: null,
  weightUnit: 'kg',
  dailyActivity: null,
  trainingDays: 3,
  trainingType: null,
  dietaryRestriction: null,
  otherRestriction: '',
  proteins: [],
  cookingLevel: null,
  mealsPerDay: 3,
};

const initialAdvancedData: AdvancedFormData = {
  primaryGoal: null,
  secondaryGoals: [],
  age: null,
  gender: null,
  height: null,
  heightUnit: 'cm',
  heightInches: null,
  weight: null,
  weightUnit: 'kg',
  targetWeight: null,
  bodyFatPercent: null,
  bodyType: null,
  currentCalories: null,
  currentProtein: 'unknown',
  waterIntake: null,
  activityLevel: null,
  trainingDaysPerWeek: 3,
  sessionDuration: 45,
  trainingTypes: [],
  trainingSplit: '',
  trainingTime: null,
  injuries: '',
  dietaryRestrictions: [],
  otherAllergies: '',
  foodsToAvoid: '',
  preferredProteins: [],
  preferredCarbs: [],
  preferredVegetables: [],
  preferredFats: [],
  wakeTime: '07:00',
  sleepTime: '23:00',
  sleepQuality: null,
  stressLevel: null,
  workSchedule: '',
  intermittentFasting: 'no',
  alcohol: 'none',
  eatingOut: 'none',
  travelForWork: false,
  cookingFor: 'self',
  struggles: [],
  previousDiets: [],
  whatWorked: '',
  whatDidntWork: '',
  mealsPerDay: 4,
  includeSnacks: true,
  cheatMeal: 'no',
  mealPrepStyle: 'mix',
  cookingAbility: 'moderate',
  budget: 'moderate',
  prePostWorkout: 'no_preference',
  supplements: [],
  caffeineIntake: 'moderate',
  specialRequests: '',
  allowAiFlexibility: true,
  allowSupplementRecs: true,
};

type Screen = 'landing' | 'getting-started' | 'feedback' | 'mode-select' | 'simple' | 'advanced' | 'planner' | 'dashboard';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { weeklySchedule, setDayPlan, copyToDays, userStats, saveUserStats, cachedShoppingList, hasScheduleChanged, saveShoppingList, clearWeek } = useDietStore();
  
  const [screen, setScreen] = useState<Screen>('landing');
  const [previousScreen, setPreviousScreen] = useState<Screen>('landing');
  const [mode, setMode] = useState<AppMode | null>(null);
  const [simpleStep, setSimpleStep] = useState<SimpleStep>('goal');
  const [advancedStep, setAdvancedStep] = useState<AdvancedStep>('goal');
  const [simpleData, setSimpleData] = useState<SimpleFormData>(initialSimpleData);
  const [advancedData, setAdvancedData] = useState<AdvancedFormData>(initialAdvancedData);
  
  const [activeDay, setActiveDay] = useState<DayOfWeek | null>(null);
  const [activePlan, setActivePlan] = useState<DietPlan | null>(null);

  const occupiedDays = (Object.keys(weeklySchedule) as DayOfWeek[]).filter(d => weeklySchedule[d] !== null);

  // Autofill stats if available when starting
  useEffect(() => {
    if (userStats) {
      const commonStats = {
        age: userStats.age,
        gender: userStats.gender,
        height: userStats.height,
        heightUnit: userStats.heightUnit,
        heightInches: userStats.heightInches,
        weight: userStats.weight,
        weightUnit: userStats.weightUnit,
      };
      
      setSimpleData(prev => ({ ...prev, ...commonStats }));
      setAdvancedData(prev => ({ ...prev, ...commonStats }));
    }
  }, [userStats]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen, simpleStep, advancedStep]);

  const updateSimpleData = (data: Partial<SimpleFormData>) => {
    setSimpleData((prev) => ({ ...prev, ...data }));
  };

  const updateAdvancedData = (data: Partial<AdvancedFormData>) => {
    setAdvancedData((prev) => ({ ...prev, ...data }));
  };

  const handleDaySelect = (day: DayOfWeek) => {
    setActiveDay(day);
    if (weeklySchedule[day]) {
      setActivePlan(weeklySchedule[day]);
      setScreen('dashboard');
    } else {
      setScreen('mode-select');
    }
  };

  const handlePlanGenerated = (plan: DietPlan) => {
    // Save user stats for next time
    const currentStats = mode === 'simple' ? simpleData : advancedData;
    saveUserStats({
      age: currentStats.age,
      gender: currentStats.gender,
      height: currentStats.height,
      heightUnit: currentStats.heightUnit,
      heightInches: currentStats.heightInches,
      weight: currentStats.weight,
      weightUnit: currentStats.weightUnit,
    });

    if (activeDay) {
      setDayPlan(activeDay, plan);
    }
    setActivePlan(plan);
    setScreen('dashboard');
  };

  const handleUpdatePlan = (updatedPlan: DietPlan) => {
    if (activeDay) {
      setDayPlan(activeDay, updatedPlan);
    }
    setActivePlan(updatedPlan);
  };

  // Burger menu - fixed position (only shown on non-wizard screens)
  const menuElement = (
    <div className="fixed top-[19px] right-[14px] z-50">
      <BurgerMenu
        theme={theme}
        onToggleTheme={toggleTheme}
        onYourWeek={() => setScreen('planner')}
        onHowToUse={() => { setPreviousScreen(screen); setScreen('getting-started'); }}
        onFeedback={() => { setPreviousScreen(screen); setScreen('feedback'); }}
        onClearWeek={() => {
          if (confirm('Clear all meal plans for the week?')) {
            clearWeek();
          }
        }}
      />
    </div>
  );

  // Landing
  if (screen === 'landing') {
    return (
      <>
        {menuElement}
        <LandingScreen 
          onStart={() => setScreen('planner')} 
          onTutorial={() => { setPreviousScreen('landing'); setScreen('getting-started'); }}
        />
      </>
    );
  }

  // Getting Started Tutorial
  if (screen === 'getting-started') {
    return (
      <>
        {menuElement}
        <GettingStartedScreen onBack={() => setScreen(previousScreen)} />
      </>
    );
  }

  // Feedback
  if (screen === 'feedback') {
    return (
      <>
        {menuElement}
        <FeedbackScreen onBack={() => setScreen(previousScreen)} />
      </>
    );
  }

  // Planner
  if (screen === 'planner') {
    return (
      <>
        {menuElement}
        <WeeklyPlannerScreen
          schedule={weeklySchedule}
          onSelectDay={handleDaySelect}
          onClearDay={(day) => setDayPlan(day, null)}
          onGenerateNew={() => {
            setActiveDay(null);
            setScreen('mode-select');
          }}
          cachedShoppingList={cachedShoppingList}
          hasScheduleChanged={hasScheduleChanged}
          onSaveShoppingList={saveShoppingList}
        />
      </>
    );
  }

  // Mode Select - no menu (part of wizard flow)
  if (screen === 'mode-select') {
    return (
      <ModeSelectScreen
        onSelect={(m) => {
          setMode(m);
          setScreen(m);
          setSimpleStep('goal');
          setAdvancedStep('goal');
        }}
        onBack={() => setScreen('planner')}
      />
    );
  }

  // Simple Mode
  if (screen === 'simple' && mode === 'simple') {
    const simpleSteps: SimpleStep[] = ['goal', 'activity', 'food', 'dashboard'];

    const goNext = () => {
      const idx = simpleSteps.indexOf(simpleStep);
      if (idx < simpleSteps.length - 1) {
        setSimpleStep(simpleSteps[idx + 1]);
      }
    };

    const goBack = () => {
      const idx = simpleSteps.indexOf(simpleStep);
      if (idx > 0) {
        setSimpleStep(simpleSteps[idx - 1]);
      } else {
        setScreen('mode-select');
      }
    };

    const content = (() => {
      switch (simpleStep) {
        case 'goal':
          return (
            <SimpleGoalScreen
              data={simpleData}
              onChange={updateSimpleData}
              onNext={goNext}
              onBack={goBack}
            />
          );
        case 'activity':
          return (
            <SimpleActivityScreen
              data={simpleData}
              onChange={updateSimpleData}
              onNext={goNext}
              onBack={goBack}
            />
          );
        case 'food':
          return (
            <SimpleFoodScreen
              data={simpleData}
              onChange={updateSimpleData}
              onNext={goNext}
              onBack={goBack}
            />
          );
        case 'dashboard':
          return (
            <DietDashboardScreen
              generatePlan={() => generateDietPlan(simpleData)}
              onBack={goBack}
              onSave={handlePlanGenerated}
              onCopyToDays={(days) => activePlan && copyToDays(activePlan, days)}
              occupiedDays={occupiedDays}
            />
          );
      }
    })();

    // No menu on wizard steps (goal, activity, food) - only on dashboard
    const showMenu = simpleStep === 'dashboard';

    return (
      <>
        {showMenu && menuElement}
        {content}
      </>
    );
  }

  // Advanced Mode
  if (screen === 'advanced' && mode === 'advanced') {
    const advancedSteps: AdvancedStep[] = [
      'goal', 'stats', 'activity', 'food', 'lifestyle', 'problems', 'options', 'dashboard'
    ];

    const goNext = () => {
      const idx = advancedSteps.indexOf(advancedStep);
      if (idx < advancedSteps.length - 1) {
        setAdvancedStep(advancedSteps[idx + 1]);
      }
    };

    const goBack = () => {
      const idx = advancedSteps.indexOf(advancedStep);
      if (idx > 0) {
        setAdvancedStep(advancedSteps[idx - 1]);
      } else {
        setScreen('mode-select');
      }
    };

    const content = (() => {
      switch (advancedStep) {
        case 'goal':
          return (
            <AdvancedGoalScreen
              data={advancedData}
              onChange={updateAdvancedData}
              onNext={goNext}
              onBack={goBack}
            />
          );
        case 'stats':
          return (
            <AdvancedStatsScreen
              data={advancedData}
              onChange={updateAdvancedData}
              onNext={goNext}
              onBack={goBack}
            />
          );
        case 'activity':
          return (
            <AdvancedActivityScreen
              data={advancedData}
              onChange={updateAdvancedData}
              onNext={goNext}
              onBack={goBack}
            />
          );
        case 'food':
          return (
            <AdvancedFoodScreen
              data={advancedData}
              onChange={updateAdvancedData}
              onNext={goNext}
              onBack={goBack}
            />
          );
        case 'lifestyle':
          return (
            <AdvancedLifestyleScreen
              data={advancedData}
              onChange={updateAdvancedData}
              onNext={goNext}
              onBack={goBack}
            />
          );
        case 'problems':
          return (
            <AdvancedProblemsScreen
              data={advancedData}
              onChange={updateAdvancedData}
              onNext={goNext}
              onBack={goBack}
            />
          );
        case 'options':
          return (
            <AdvancedOptionsScreen
              data={advancedData}
              onChange={updateAdvancedData}
              onNext={goNext}
              onBack={goBack}
            />
          );
        case 'dashboard':
          return (
            <DietDashboardScreen
              generatePlan={() => generateAdvancedDietPlan(advancedData)}
              onBack={goBack}
              onSave={handlePlanGenerated}
              onCopyToDays={(days) => activePlan && copyToDays(activePlan, days)}
              occupiedDays={occupiedDays}
            />
          );
      }
    })();

    // No menu on wizard steps - only on dashboard
    const showMenu = advancedStep === 'dashboard';

    return (
      <>
        {showMenu && menuElement}
        {content}
      </>
    );
  }

  // Final Dashboard View (Existing Plan)
  if (screen === 'dashboard' && activePlan) {
    return (
      <>
        {menuElement}
        <DietDashboardScreen
          initialPlan={activePlan}
          dayName={activeDay || undefined}
          onBack={() => setScreen('planner')}
          onSave={handleUpdatePlan}
          onCopyToDays={(days) => activePlan && copyToDays(activePlan, days)}
          occupiedDays={occupiedDays}
        />
      </>
    );
  }

  return null;
}

export default App;
