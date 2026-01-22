import { useState } from 'react';
import { Button } from '../ui/Button';
import { BackButton } from '../ui/BackButton';

interface FeedbackScreenProps {
  onBack: () => void;
}

export function FeedbackScreen({ onBack }: FeedbackScreenProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('https://formspree.io/f/mojejago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          message,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 p-6 md:p-12 font-sans">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <BackButton onClick={onBack} />
          <h1 className="text-3xl font-bold tracking-tight mt-4">Send Feedback</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            We'd love to hear from you! Share your thoughts, suggestions, or report issues.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
              Thank you!
            </h2>
            <p className="text-green-700 dark:text-green-300 mb-4">
              Your feedback has been sent successfully.
            </p>
            <Button onClick={onBack}>Back to App</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Email (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">
                Include if you'd like a response
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Your Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you think..."
                required
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              />
            </div>

            {status === 'error' && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300 text-sm">
                Something went wrong. Please try again.
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={status === 'sending' || !message.trim()}
            >
              {status === 'sending' ? 'Sending...' : 'Send Feedback'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
