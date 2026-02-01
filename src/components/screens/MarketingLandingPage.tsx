import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import logo from '../../assets/logo.png';
import { track } from '@vercel/analytics';

interface MarketingLandingPageProps {
  onGetStarted: () => void;
  onViewGuide: () => void;
  onSkip?: () => void;
}

const SEEN_MARKETING_KEY = 'peak_diet_seen_marketing';

export function MarketingLandingPage({ onGetStarted, onViewGuide, onSkip }: MarketingLandingPageProps) {
  const [neverShowAgain, setNeverShowAgain] = useState(false);

  useEffect(() => {
    track('marketing_page_viewed');
  }, []);

  const handleGetStarted = () => {
    track('marketing_get_started_clicked');
    onGetStarted();
  };

  const handleViewGuide = () => {
    track('marketing_guide_clicked');
    onViewGuide();
  };

  const handleSkip = () => {
    track('marketing_skipped');
    if (onSkip) {
      onSkip();
    } else {
      onGetStarted();
    }
  };

  const handleNeverShowAgain = (checked: boolean) => {
    setNeverShowAgain(checked);
    if (checked) {
      localStorage.setItem(SEEN_MARKETING_KEY, 'true');
    } else {
      localStorage.removeItem(SEEN_MARKETING_KEY);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
      {/* Skip to App Link */}
      <div className="absolute top-6 right-6">
        <button
          onClick={handleSkip}
          className="text-sm text-gray-500 hover:text-primary transition-colors"
        >
          Skip to App →
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <img src={logo} alt="PeakDiet Logo" className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            <span role="img" aria-label="Weightlifting">🏋️</span> PeakDiet
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-2">
            AI-Powered Meal Planning for Athletes
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Your personal nutrition coach. Built for people who train hard.
          </p>

          <div className="flex flex-col items-center gap-4">
            <Button size="lg" onClick={handleGetStarted}>
              Get Started Free →
            </Button>

            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={neverShowAgain}
                onChange={(e) => handleNeverShowAgain(e.target.checked)}
                className="rounded border-gray-300"
              />
              Don't show this page again
            </label>
          </div>
        </div>

        {/* Target Audience Warning Box */}
        <div className="mb-16 p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4 text-yellow-900 dark:text-yellow-100">
            <span role="img" aria-label="Warning">⚠️</span> Who This Is For
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-yellow-900 dark:text-yellow-100">
            <div>
              <h3 className="font-bold mb-2 text-lg">✓ DESIGNED FOR:</h3>
              <ul className="space-y-1 text-sm">
                <li>• Bodybuilders tracking macros</li>
                <li>• Athletes optimizing nutrition</li>
                <li>• Fitness enthusiasts who train regularly</li>
                <li>• People who know their training needs</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2 text-lg">✗ NOT FOR:</h3>
              <ul className="space-y-1 text-sm">
                <li>• People who don't exercise</li>
                <li>• Looking for a miracle weight-loss cure</li>
                <li>• Sedentary individuals</li>
              </ul>
            </div>
          </div>

          <p className="mt-4 text-sm text-yellow-900 dark:text-yellow-100 font-medium">
            This app assumes you already have a training routine and understand your nutritional needs.
          </p>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">Features</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                emoji: '✨',
                label: 'Sparkles',
                title: 'AI-Powered Planning',
                desc: 'Get personalized meal plans in seconds'
              },
              {
                emoji: '🗣️',
                label: 'Speaking',
                title: 'Natural Language Edits',
                desc: '"Swap chicken for beef" or "Make lunch vegetarian"'
              },
              {
                emoji: '📅',
                label: 'Calendar',
                title: 'Weekly Scheduling',
                desc: 'Plan your entire week, save multiple plans'
              },
              {
                emoji: '🛒',
                label: 'Shopping cart',
                title: 'Smart Shopping Lists',
                desc: 'Auto-consolidates ingredients by category'
              },
              {
                emoji: '🆓',
                label: 'Free',
                title: 'Free to Use',
                desc: '5,000 tokens daily (enough for 2-3 full plans). Upgrade coming soon.'
              },
              {
                emoji: '⚡',
                label: 'Lightning',
                title: 'Lightning Fast',
                desc: 'Generate plans in 5-15 seconds'
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="text-4xl mb-3" role="img" aria-label={feature.label}>
                  {feature.emoji}
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Choose Your Mode', desc: 'Simple or Advanced - pick your level' },
              { step: 2, title: 'Enter Your Stats', desc: 'Age, weight, goals, activity level' },
              { step: 3, title: 'Get Your Plan', desc: 'AI generates personalized meals' },
              { step: 4, title: 'Edit Naturally', desc: 'Tweak with plain English' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xl">
                  {item.step}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-4">Ready to optimize your nutrition?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start planning your meals like a pro. No sign-up required to try.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted}>
              Start Planning Your Week →
            </Button>
            <Button size="lg" variant="secondary" onClick={handleViewGuide}>
              View Setup Guide
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
