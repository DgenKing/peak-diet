import { useState, useEffect } from 'react';
import type { AppMode, SimpleFormData, AdvancedFormData, SimpleStep, AdvancedStep } from './types';
import { useTheme } from './hooks/useTheme';
import { ThemeToggle } from './components/ui/ThemeToggle';

// Screens
import { LandingScreen } from './components/screens/LandingScreen';
import { ModeSelectScreen } from './components/screens/ModeSelectScreen';

// Simple Mode
import { SimpleGoalScreen } from './components/screens/simple/SimpleGoalScreen';
import { SimpleActivityScreen } from './components/screens/simple/SimpleActivityScreen';
import { SimpleFoodScreen } from './components/screens/simple/SimpleFoodScreen';
import { SimplePromptScreen } from './components/screens/simple/SimplePromptScreen';

// Advanced Mode
import { AdvancedGoalScreen } from './components/screens/advanced/AdvancedGoalScreen';
import { AdvancedStatsScreen } from './components/screens/advanced/AdvancedStatsScreen';
import { AdvancedActivityScreen } from './components/screens/advanced/AdvancedActivityScreen';
import { AdvancedFoodScreen } from './components/screens/advanced/AdvancedFoodScreen';
import { AdvancedLifestyleScreen } from './components/screens/advanced/AdvancedLifestyleScreen';
import { AdvancedProblemsScreen } from './components/screens/advanced/AdvancedProblemsScreen';
import { AdvancedOptionsScreen } from './components/screens/advanced/AdvancedOptionsScreen';
import { AdvancedPromptScreen } from './components/screens/advanced/AdvancedPromptScreen';

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

type Screen = 'landing' | 'mode-select' | 'simple' | 'advanced';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [screen, setScreen] = useState<Screen>('landing');
  const [mode, setMode] = useState<AppMode | null>(null);
  const [simpleStep, setSimpleStep] = useState<SimpleStep>('goal');
  const [advancedStep, setAdvancedStep] = useState<AdvancedStep>('goal');
  const [simpleData, setSimpleData] = useState<SimpleFormData>(initialSimpleData);
  const [advancedData, setAdvancedData] = useState<AdvancedFormData>(initialAdvancedData);

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

  const handleStartOver = () => {
    setScreen('landing');
    setMode(null);
    setSimpleStep('goal');
    setAdvancedStep('goal');
    setSimpleData(initialSimpleData);
    setAdvancedData(initialAdvancedData);
  };

  const handleSwitchToAdvanced = () => {
    setMode('advanced');
    setScreen('advanced');
    setAdvancedStep('goal');
    setAdvancedData((prev) => ({
      ...prev,
      age: simpleData.age,
      gender: simpleData.gender,
      height: simpleData.height,
      heightUnit: simpleData.heightUnit,
      heightInches: simpleData.heightInches,
      weight: simpleData.weight,
      weightUnit: simpleData.weightUnit,
    }));
  };

  // Theme toggle - fixed position
  const themeToggleElement = (
    <div className="fixed top-4 right-4 z-50">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
    </div>
  );

  // Landing
  if (screen === 'landing') {
    return (
      <>
        {themeToggleElement}
        <LandingScreen onStart={() => setScreen('mode-select')} />
      </>
    );
  }

  // Mode Select
  if (screen === 'mode-select') {
    return (
      <>
        {themeToggleElement}
        <ModeSelectScreen
          onSelect={(m) => {
            setMode(m);
            setScreen(m);
          }}
          onBack={() => setScreen('landing')}
        />
      </>
    );
  }

  // Simple Mode
  if (screen === 'simple' && mode === 'simple') {
    const simpleSteps: SimpleStep[] = ['goal', 'activity', 'food', 'prompt'];

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
        case 'prompt':
          return (
            <SimplePromptScreen
              data={simpleData}
              onBack={goBack}
              onStartOver={handleStartOver}
              onSwitchMode={handleSwitchToAdvanced}
            />
          );
      }
    })();

    return (
      <>
        {themeToggleElement}
        {content}
      </>
    );
  }

  // Advanced Mode
  if (screen === 'advanced' && mode === 'advanced') {
    const advancedSteps: AdvancedStep[] = [
      'goal', 'stats', 'activity', 'food', 'lifestyle', 'problems', 'options', 'prompt'
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
        case 'prompt':
          return (
            <AdvancedPromptScreen
              data={advancedData}
              onBack={goBack}
              onStartOver={handleStartOver}
            />
          );
      }
    })();

    return (
      <>
        {themeToggleElement}
        {content}
      </>
    );
  }

  return null;
}

export default App;
