import { useState } from 'react';
import type { AppMode } from '../../types';
import { Modal } from '../ui/Modal';
import { useUser } from '../../hooks/useUser';

interface ModeSelectScreenProps {
  onSelect: (mode: AppMode) => void;
  onBack: () => void;
}

export function ModeSelectScreen({ onSelect, onBack }: ModeSelectScreenProps) {
  const { userId } = useUser();
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleModeSelect = async (mode: AppMode) => {
    // Check daily limit before allowing user to start form
    // Check for both logged-in users (userId) and guests (deviceId)
    const deviceId = localStorage.getItem('peak_diet_device_id');

    if (userId || deviceId) {
      setChecking(true);
      try {
        const res = await fetch('/api/usage/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, deviceId }),
        });

        if (res.ok) {
          const data = await res.json();
          if (!data.allowed) {
            setShowLimitModal(true);
            setChecking(false);
            return;
          }
        }
      } catch (err) {
        // If check fails, allow proceeding (fail open)
        console.error('Failed to check limit:', err);
      }
      setChecking(false);
    }

    onSelect(mode);
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 self-start"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Choose Your Mode
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-center">
          How detailed do you want to get?
        </p>

        <div className="space-y-4">
          {/* Simple Mode Card */}
          <button
            onClick={() => handleModeSelect('simple')}
            disabled={checking}
            className="w-full p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-left hover:border-primary hover:shadow-lg transition-all group disabled:opacity-50 disabled:cursor-wait"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Simple Mode</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Quick & Easy</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-primary font-medium">4 steps</span>
                  <span className="text-gray-400 dark:text-gray-500">•</span>
                  <span className="text-gray-500 dark:text-gray-400">~2 minutes</span>
                </div>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Perfect for beginners</p>
              </div>
            </div>
          </button>

          {/* Advanced Mode Card */}
          <button
            onClick={() => handleModeSelect('advanced')}
            disabled={checking}
            className="w-full p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-left hover:border-advanced hover:shadow-lg transition-all group disabled:opacity-50 disabled:cursor-wait"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-advanced/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-advanced/20 transition-colors">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Advanced Mode</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Fully Customized</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-advanced font-medium">8 steps</span>
                  <span className="text-gray-400 dark:text-gray-500">•</span>
                  <span className="text-gray-500 dark:text-gray-400">~5 minutes</span>
                </div>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Maximum precision</p>
              </div>
            </div>
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-6">
          Not sure? Start Simple — you can always switch later
        </p>
      </div>

      {/* Usage Limit Modal */}
      <Modal
        isOpen={showLimitModal}
        onClose={() => {
          setShowLimitModal(false);
          onBack();
        }}
        title="Daily Limit Reached"
        message="Daily token limit reached. Resets tomorrow—see you then! 🚀"
        showFooter={false}
      />
    </div>
  );
}
