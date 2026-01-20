import { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';
import { loadingTips } from '../../utils/loadingTips';

interface LoadingSpinnerProps {
  title: string;
  subtitle?: string;
  overlay?: boolean;
}

export function LoadingSpinner({ title, subtitle, overlay = false }: LoadingSpinnerProps) {
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * loadingTips.length));

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % loadingTips.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const content = (
    <>
      <img src={logo} alt="PeakDiet" className="h-24 w-auto mb-4 animate-[pulse-scale_1.5s_ease-in-out_infinite]" />
      <h2 className={`text-xl font-bold mb-1 ${overlay ? 'text-white' : ''}`}>{title}</h2>
      {subtitle && <p className={`mb-6 ${overlay ? 'text-gray-300' : 'text-gray-500'}`}>{subtitle}</p>}
      <div className={`max-w-xs text-center transition-opacity duration-500 ${overlay ? 'text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
        <p className="text-sm italic">💡 {loadingTips[tipIndex]}</p>
      </div>
    </>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
      {content}
    </div>
  );
}
