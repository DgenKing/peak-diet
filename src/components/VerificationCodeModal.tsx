import { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface VerificationCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export function VerificationCodeModal({ isOpen, onClose, userEmail }: VerificationCodeModalProps) {
  const { verifyEmail } = useUser();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await verifyEmail(userEmail, code);
      setCode('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendCooldown(60);
    setError(null);
    try {
      const { authClient } = await import('../auth');
      console.log('Sending verification OTP to:', userEmail);
      const result = await authClient.emailOtp.sendVerificationOtp({
        email: userEmail,
        type: 'email-verification'
      });
      console.log('Resend result:', result);
      if (result.error) {
        console.error('Resend error:', result.error);
        throw new Error(result.error.message || 'Failed to send verification code');
      }
    } catch (err) {
      console.error('Failed to resend verification code:', err);
      setError(err instanceof Error ? err.message : 'Failed to resend code. Please try again.');
      setResendCooldown(0); // Reset cooldown on error
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">✉️</div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              Verify Your Email
            </h2>
            <p className="text-sm text-gray-500">
              We sent a 6-digit code to<br />
              <span className="font-bold text-primary">{userEmail}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Verification Code
              </label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                required
                disabled={loading}
                className="text-center text-2xl font-bold tracking-widest"
                maxLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={loading || code.length !== 6}
              className="w-full"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="text-sm text-gray-500 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0
                  ? `Resend code in ${resendCooldown}s`
                  : 'Didn\'t receive code? Resend'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
