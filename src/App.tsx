import { useState, useEffect } from 'react';
import type { AppMode, SimpleFormData, AdvancedFormData, SimpleStep, AdvancedStep } from './types';
import { useTheme } from './hooks/useTheme';
import { BurgerMenu } from './components/ui/BurgerMenu';
import { AuthModal } from './components/AuthModal';
import { VerificationCodeModal } from './components/VerificationCodeModal';
import { Modal } from './components/ui/Modal';

// Screens
import { LandingScreen } from './components/screens/LandingScreen';
import { ModeSelectScreen } from './components/screens/ModeSelectScreen';
import { WeeklyPlannerScreen } from './components/screens/WeeklyPlannerScreen';
import { UsageDashboardScreen } from './components/screens/UsageDashboardScreen';

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
import { useUser } from './hooks/useUser';
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

type Screen = 'landing' | 'getting-started' | 'feedback' | 'mode-select' | 'simple' | 'advanced' | 'planner' | 'dashboard' | 'usage';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { weeklySchedule, setDayPlan, copyToDays, userStats, saveUserStats, cachedShoppingList, hasScheduleChanged, saveShoppingList, clearWeek } = useDietStore();
  const { user, userId, username, isAnonymous, isEmailVerified, logout } = useUser();
  
  const [screen, setScreen] = useState<Screen>(() => {
    const hasPlan = Object.values(weeklySchedule).some(p => p !== null);
    return hasPlan ? 'planner' : 'landing';
  });
  const [previousScreen, setPreviousScreen] = useState<Screen>('landing');
  const [mode, setMode] = useState<AppMode | null>(null);
  const [simpleStep, setSimpleStep] = useState<SimpleStep>('goal');
  const [advancedStep, setAdvancedStep] = useState<AdvancedStep>('goal');
  const [simpleData, setSimpleData] = useState<SimpleFormData>(initialSimpleData);
  const [advancedData, setAdvancedData] = useState<AdvancedFormData>(initialAdvancedData);
  
  const [activeDay, setActiveDay] = useState<DayOfWeek | null>(null);
  const [activePlan, setActivePlan] = useState<DietPlan | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogoutSuccessOpen, setIsLogoutSuccessOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // For burger menu navigation guard on unsaved plans
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

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

  const handleLogout = async () => {
    await logout();
    setIsLogoutSuccessOpen(true);
  };

  const renderMenu = (useGuard = false) => (
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
        username={username}
        isAnonymous={isAnonymous}
        isEmailVerified={isEmailVerified}
        onSignIn={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onUsage={() => { setPreviousScreen(screen); setScreen('usage'); }}
        onVerifyEmail={() => setIsVerificationModalOpen(true)}
        onBeforeNavigate={useGuard ? (navigateFn) => setPendingNavigation(() => navigateFn) : undefined}
      />
    </div>
  );

  const sharedUI = (
    <>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onRegisterSuccess={() => setIsVerificationModalOpen(true)}
      />
      <Modal
        isOpen={isLogoutSuccessOpen}
        onClose={() => setIsLogoutSuccessOpen(false)}
        title="Signed Out"
        message="You have been successfully signed out. Your data will now be stored locally until you sign in again."
        variant="success"
        showFooter={false}
      />
      <VerificationCodeModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        userEmail={user?.email || ''}
      />
    </>
  );

  // Landing
  if (screen === 'landing') {
    return (
      <>
        {renderMenu()}
        {sharedUI}
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
        {renderMenu()}
        {sharedUI}
        <GettingStartedScreen onBack={() => setScreen(previousScreen)} />
      </>
    );
  }

  // Feedback
  if (screen === 'feedback') {
    return (
      <>
        {renderMenu()}
        {sharedUI}
        <FeedbackScreen onBack={() => setScreen(previousScreen)} />
      </>
    );
  }

  // Usage Dashboard
  if (screen === 'usage') {
    return (
      <>
        {sharedUI}
        <UsageDashboardScreen onBack={() => setScreen(previousScreen)} />
      </>
    );
  }

  // Planner
  if (screen === 'planner') {
    return (
      <>
        {renderMenu()}
        {sharedUI}
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

  // Mode Select
  if (screen === 'mode-select') {
    return (
      <>
        {sharedUI}
        <ModeSelectScreen
          onSelect={(m) => {
            setMode(m);
            setScreen(m);
            setSimpleStep('goal');
            setAdvancedStep('goal');
          }}
          onBack={() => setScreen('planner')}
        />
      </>
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
          return <SimpleGoalScreen data={simpleData} onChange={updateSimpleData} onNext={goNext} onBack={goBack} />;
        case 'activity':
          return <SimpleActivityScreen data={simpleData} onChange={updateSimpleData} onNext={goNext} onBack={goBack} />;
        case 'food':
          return <SimpleFoodScreen data={simpleData} onChange={updateSimpleData} onNext={goNext} onBack={goBack} />;
        case 'dashboard':
          return (
            <DietDashboardScreen
              generatePlan={() => generateDietPlan(simpleData, userId || undefined)}
              onBack={goBack}
              onSave={handlePlanGenerated}
              onCopyToDays={(days) => activePlan && copyToDays(activePlan, days)}
              occupiedDays={occupiedDays}
              pendingNavigation={pendingNavigation}
              onClearPendingNavigation={() => setPendingNavigation(null)}
            />
          );
      }
    })();

    const showMenu = simpleStep === 'dashboard';

    return (
      <>
        {showMenu && renderMenu(true)}
        {sharedUI}
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
        case 'goal': return <AdvancedGoalScreen data={advancedData} onChange={updateAdvancedData} onNext={goNext} onBack={goBack} />;
        case 'stats': return <AdvancedStatsScreen data={advancedData} onChange={updateAdvancedData} onNext={goNext} onBack={goBack} />;
        case 'activity': return <AdvancedActivityScreen data={advancedData} onChange={updateAdvancedData} onNext={goNext} onBack={goBack} />;
        case 'food': return <AdvancedFoodScreen data={advancedData} onChange={updateAdvancedData} onNext={goNext} onBack={goBack} />;
        case 'lifestyle': return <AdvancedLifestyleScreen data={advancedData} onChange={updateAdvancedData} onNext={goNext} onBack={goBack} />;
        case 'problems': return <AdvancedProblemsScreen data={advancedData} onChange={updateAdvancedData} onNext={goNext} onBack={goBack} />;
        case 'options': return <AdvancedOptionsScreen data={advancedData} onChange={updateAdvancedData} onNext={goNext} onBack={goBack} />;
        case 'dashboard':
          return (
            <DietDashboardScreen
              generatePlan={() => generateAdvancedDietPlan(advancedData, userId || undefined)}
              onBack={goBack}
              onSave={handlePlanGenerated}
              onCopyToDays={(days) => activePlan && copyToDays(activePlan, days)}
              occupiedDays={occupiedDays}
              pendingNavigation={pendingNavigation}
              onClearPendingNavigation={() => setPendingNavigation(null)}
            />
          );
      }
    })();

    const showMenu = advancedStep === 'dashboard';

    return (
      <>
        {showMenu && renderMenu(true)}
        {sharedUI}
        {content}
      </>
    );
  }

  // Final Dashboard View
  if (screen === 'dashboard' && activePlan) {
    return (
      <>
        {renderMenu(true)}
        {sharedUI}
        <DietDashboardScreen
          initialPlan={activePlan}
          dayName={activeDay || undefined}
          onBack={() => setScreen('planner')}
          onSave={handleUpdatePlan}
          onCopyToDays={(days) => activePlan && copyToDays(activePlan, days)}
          occupiedDays={occupiedDays}
          pendingNavigation={pendingNavigation}
          onClearPendingNavigation={() => setPendingNavigation(null)}
        />
      </>
    );
  }

  return null;
}

export default App;