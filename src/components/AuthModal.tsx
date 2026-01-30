import { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess?: () => void;
  onLoginSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onRegisterSuccess, onLoginSuccess }: AuthModalProps) {
  const { login, register, forgetPassword, resetPassword, loading: authLoading, username: guestUsername } = useUser();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [forgotStep, setForgotStep] = useState<'email' | 'reset'>('email');

  // Auto-fill guest username when switching to register
  useEffect(() => {
    if (mode === 'register' && !username && guestUsername) {
      setUsername(guestUsername);
    }
  }, [mode, guestUsername, username]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'login') {
        await login(email, password);
        onClose();
        onLoginSuccess?.();
      } else if (mode === 'register') {
        await register(email, password, username);
        setEmail('');
        setPassword('');
        setUsername('');
        onClose();
        onLoginSuccess?.();
        onRegisterSuccess?.();
      } else if (mode === 'forgot') {
        if (forgotStep === 'email') {
          await forgetPassword(email);
          setSuccess('Reset code sent to your email!');
          setForgotStep('reset');
        } else {
          await resetPassword(email, otp, newPassword);
          setSuccess('Password reset successful! You can now sign in.');
          setTimeout(() => {
            setMode('login');
            setForgotStep('email');
            setOtp('');
            setNewPassword('');
          }, 2000);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (mode === 'login') return 'Welcome Back';
    if (mode === 'register') return 'Create Account';
    return forgotStep === 'email' ? 'Reset Password' : 'Enter Reset Code';
  };

  const getSubtitle = () => {
    if (mode === 'login') return 'Sign in to sync your diet plans across devices.';
    if (mode === 'register') return 'Join PeakDiet to save your progress and sync plans.';
    return forgotStep === 'email'
      ? 'Enter your email to receive a reset code.'
      : 'Check your email for the 6-digit code.';
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !loading && onClose()}
      />
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              {getTitle()}
            </h2>
            <p className="text-sm text-gray-500">
              {getSubtitle()}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">
                  Fitness Username
                </label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. IronBeast_42"
                  required
                  disabled={loading}
                  className="text-primary font-bold"
                />
              </div>
            )}

            {(mode === 'login' || mode === 'register' || (mode === 'forgot' && forgotStep === 'email')) && (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={loading || (mode === 'forgot' && forgotStep === 'reset')}
                />
              </div>
            )}

            {(mode === 'login' || mode === 'register') && (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-primary hover:underline mt-1 ml-1"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
            )}

            {mode === 'forgot' && forgotStep === 'reset' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">
                    Verification Code
                  </label>
                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    required
                    disabled={loading}
                    className="text-center text-2xl font-bold tracking-widest"
                    maxLength={6}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs p-3 rounded-xl font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs p-3 rounded-xl font-medium">
                {success}
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-4 text-lg"
              disabled={loading || authLoading || (mode === 'forgot' && forgotStep === 'reset' && otp.length !== 6)}
            >
              {loading ? 'Processing...' :
                mode === 'login' ? 'Sign In' :
                mode === 'register' ? 'Create Account' :
                forgotStep === 'email' ? 'Send Reset Code' : 'Reset Password'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                if (mode === 'forgot') {
                  setMode('login');
                  setForgotStep('email');
                } else {
                  setMode(mode === 'login' ? 'register' : 'login');
                }
              }}
              className="text-sm font-medium text-primary hover:underline"
              disabled={loading}
            >
              {mode === 'forgot' ? 'Back to Sign In' :
               mode === 'login' ? "Don't have an account? Sign up" :
               "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          disabled={loading}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
