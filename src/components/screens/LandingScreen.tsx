import { Button } from '../ui/Button';
import logo from '../../assets/logo.png';

interface LandingScreenProps {
  onStart: () => void;
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md mx-auto">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="PeakDiet Logo" className="w-32 h-auto" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          PeakDiet
        </h1>
        <p className="text-xs font-semibold tracking-wider text-primary mb-3 uppercase">
          Perfect Eating Architecture Kit
        </p>

        {/* Tagline */}
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          AI-powered meal plans you can talk to. Swap ingredients, adjust macros, customize meals - just ask.
        </p>

        {/* Value Props */}
        <div className="space-y-3 mb-10 text-left">
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <span className="text-2xl">🤖</span>
            <span className="text-gray-700 dark:text-gray-300">Chat with your plan - modify meals instantly</span>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <span className="text-2xl">📅</span>
            <span className="text-gray-700 dark:text-gray-300">Plan your whole week in one place</span>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <span className="text-2xl">🎯</span>
            <span className="text-gray-700 dark:text-gray-300">Personalized macros calculated for YOU</span>
          </div>
        </div>

        {/* CTA */}
        <Button size="lg" fullWidth onClick={onStart}>
          Get Started
        </Button>

        <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">
          Free • No sign-up required
        </p>
      </div>
    </div>
  );
}
