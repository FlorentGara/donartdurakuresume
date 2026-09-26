import { useState, type FormEvent } from 'react';
import { useAuth } from '@/lib/auth';
import { useHashRoute } from '@/hooks/useHashRoute';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const { signIn, resetPassword } = useAuth();
  const { navigate } = useHashRoute();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      navigate('/admin');
    }
  };

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      setResetSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-6">
            <Lock className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-display text-2xl text-bone-50">Admin Access</h1>
          <p className="text-bone-400 text-sm mt-2">Sign in to manage your portfolio</p>
        </div>

        {resetSent ? (
          <div className="rounded-2xl border hairline bg-ink-900 p-8 text-center">
            <p className="text-bone-100">Password reset link sent to {email}.</p>
            <button
              onClick={() => { setShowReset(false); setResetSent(false); }}
              className="mt-4 text-accent text-sm link-underline"
            >
              Back to login
            </button>
          </div>
        ) : showReset ? (
          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="text-label block mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-ink-900 border hairline rounded-xl px-5 py-4 text-bone-100 placeholder-bone-500 focus:border-accent/50 focus:outline-none"
                placeholder="you@email.com"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-50">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button type="button" onClick={() => setShowReset(false)} className="w-full text-bone-400 text-sm hover:text-bone-100">
              Back to login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-label block mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bone-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-ink-900 border hairline rounded-xl pl-12 pr-5 py-4 text-bone-100 placeholder-bone-500 focus:border-accent/50 focus:outline-none"
                  placeholder="you@email.com"
                />
              </div>
            </div>
            <div>
              <label className="text-label block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bone-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-ink-900 border hairline rounded-xl pl-12 pr-5 py-4 text-bone-100 placeholder-bone-500 focus:border-accent/50 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-50 group">
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
            </button>
            <button type="button" onClick={() => setShowReset(true)} className="w-full text-bone-400 text-sm hover:text-bone-100">
              Forgot password?
            </button>
          </form>
        )}

        <button
          onClick={() => navigate('/')}
          className="mt-8 mx-auto block text-bone-500 text-xs hover:text-bone-300 transition-colors"
        >
          ← Back to website
        </button>
      </div>
    </div>
  );
}
