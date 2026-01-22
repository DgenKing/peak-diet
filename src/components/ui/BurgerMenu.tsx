import { useState, useRef, useEffect } from 'react';

interface BurgerMenuProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onYourWeek: () => void;
  onHowToUse: () => void;
  onClearWeek: () => void;
}

export function BurgerMenu({ theme, onToggleTheme, onYourWeek, onHowToUse, onClearWeek }: BurgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      {/* Burger Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Menu"
      >
        <svg
          className="w-5 h-5 text-gray-600 dark:text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => {
              onToggleTheme();
            }}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{theme === 'dark' ? '🌙' : '☀️'}</span>
              <span className="text-gray-700 dark:text-gray-200">Dark Mode</span>
            </div>
            {/* Toggle Switch */}
            <div
              className={`w-10 h-6 rounded-full p-1 transition-colors ${
                theme === 'dark' ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  theme === 'dark' ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
          </button>

          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          {/* Your Week */}
          <button
            onClick={() => {
              onYourWeek();
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg">📅</span>
            <span className="text-gray-700 dark:text-gray-200">Your Week</span>
          </button>

          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          {/* How to Use */}
          <button
            onClick={() => {
              onHowToUse();
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg">❓</span>
            <span className="text-gray-700 dark:text-gray-200">How to Use</span>
          </button>

          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          {/* Clear Week */}
          <button
            onClick={() => {
              onClearWeek();
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg">🗑️</span>
            <span className="text-gray-700 dark:text-gray-200">Clear Week</span>
          </button>

          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          {/* About */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center gap-3">
              <span className="text-lg">ℹ️</span>
              <div>
                <span className="text-gray-700 dark:text-gray-200 text-sm">PeakDiet</span>
                <span className="text-gray-400 dark:text-gray-500 text-xs ml-2">v1.0</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
