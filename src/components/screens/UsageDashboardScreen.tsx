import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { BackButton } from '../ui/BackButton';

interface UsageStats {
  total: {
    total_tokens: string;
    total_requests: string;
  };
  byType: Array<{
    request_type: string;
    tokens: string;
    count: string;
  }>;
  daily: Array<{
    date: string;
    tokens: string;
  }>;
}

interface UsageDashboardScreenProps {
  onBack: () => void;
}

export function UsageDashboardScreen({ onBack }: UsageDashboardScreenProps) {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/usage');
        if (!res.ok) throw new Error('Failed to fetch usage stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <LoadingSpinner title="Loading Stats..." />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-30 flex items-center gap-4">
        <BackButton onClick={onBack} />
        <h1 className="text-xl font-bold">Usage Dashboard</h1>
      </div>

      <div className="flex-1 overflow-auto p-4 max-w-md mx-auto w-full space-y-6">
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-center">
            {error}
          </div>
        ) : stats ? (
          <>
            {/* Total Usage Card */}
            <div className="bg-primary/5 dark:bg-primary/10 rounded-3xl p-6 border border-primary/10">
              <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 opacity-70">Lifetime Usage</div>
              <div className="text-4xl font-black text-gray-900 dark:text-white mb-1">
                {parseInt(stats.total.total_tokens || '0').toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-tight">Total Tokens Consumed</div>
              
              <div className="mt-4 pt-4 border-t border-primary/10 flex justify-between items-center">
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {parseInt(stats.total.total_requests || '0').toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">AI Requests</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {Math.round(parseInt(stats.total.total_tokens || '0') / (parseInt(stats.total.total_requests || '1') || 1))}
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Avg. Tokens / Request</div>
                </div>
              </div>
            </div>

            {/* Usage by Type */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Usage by Feature</h3>
              <div className="space-y-2">
                {stats.byType.map((type) => (
                  <div key={type.request_type} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-sm capitalize">{type.request_type.replace('_', ' ')}</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase">{type.count} Requests</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm">{parseInt(type.tokens).toLocaleString()}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Tokens</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Usage (Last 7 Days) */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Daily Activity</h3>
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
                {stats.daily.length > 0 ? stats.daily.map((day) => (
                  <div key={day.date} className="flex items-center gap-4">
                    <div className="text-[10px] font-bold text-gray-400 uppercase w-16">
                      {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${Math.min(100, (parseInt(day.tokens) / 5000) * 100)}%` }}
                      />
                    </div>
                    <div className="text-[10px] font-bold text-gray-500 w-12 text-right">
                      {parseInt(day.tokens).toLocaleString()}
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-gray-500 text-xs py-4 italic">No activity in the last 7 days</p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <Button variant="outline" className="w-full" onClick={onBack}>
                Back to Settings
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-12">
            No usage data found yet. Start generating plans to see stats!
          </div>
        )}
      </div>
    </div>
  );
}
