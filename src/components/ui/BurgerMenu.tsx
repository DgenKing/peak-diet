import { useState, useRef, useEffect } from 'react';

interface BurgerMenuProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onYourWeek: () => void;
  onHowToUse: () => void;
  onFeedback: () => void;
  onClearWeek: () => void;
  username: string | null;
  isAnonymous: boolean;
  onSignIn: () => void;
  onLogout: () => void;
  onUsage: () => void;
  onBeforeNavigate?: (navigateFn: () => void) => void;
}

export function BurgerMenu({ 
  theme, 
  onToggleTheme, 
  onYourWeek, 
  onHowToUse, 
  onFeedback, 
  onClearWeek, 
  username,
  isAnonymous,
  onSignIn,
  onLogout,
  onUsage,
  onBeforeNavigate 
}: BurgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (navigateFn: () => void) => {
    setIsOpen(false);
    if (onBeforeNavigate) {
      onBeforeNavigate(navigateFn);
    } else {
      navigateFn();
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Menu"
      >
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* User Profile Section */}
          <div className="px-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
                {username?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {username || 'Guest User'}
                </p>
                <p className={`text-[10px] uppercase tracking-widest font-bold ${isAnonymous ? 'text-amber-500' : 'text-green-500'}`}>
                  {isAnonymous ? 'Device Only' : 'Cloud Sync ✓'}
                </p>
              </div>
            </div>
            {isAnonymous ? (
              <button
                onClick={() => { onSignIn(); setIsOpen(false); }}
                className="w-full py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm"
              >
                Sign In to Sync
              </button>
            ) : (
              <button
                onClick={() => { onLogout(); setIsOpen(false); }}
                className="w-full py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>

          <div className="py-1">
            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{theme === 'dark' ? '🌙' : '☀️'}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Dark Mode</span>
              </div>
              <div className={`w-9 h-5 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-gray-300'}`}>
                <div className={`w-3 h-3 rounded-full bg-white shadow transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </button>

            <div className="h-px bg-gray-50 dark:bg-gray-800 mx-4" />

            <button
              onClick={() => handleNavigate(onYourWeek)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-lg">📅</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Your Week</span>
            </button>

            <button
              onClick={() => handleNavigate(onUsage)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-lg">📊</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Usage Stats</span>
            </button>

            <button
              onClick={() => handleNavigate(onHowToUse)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-lg">❓</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">How to Use</span>
            </button>

            <button
              onClick={() => handleNavigate(onFeedback)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-lg">💬</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Send Feedback</span>
            </button>

            <div className="h-px bg-gray-50 dark:bg-gray-800 mx-4" />

            <button
              onClick={() => { onClearWeek(); setIsOpen(false); }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
            >
              <span className="text-lg group-hover:scale-110 transition-transform">🗑️</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-400">Clear Week</span>
            </button>
          </div>

          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/30 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">PeakDiet v1.1</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Live</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
