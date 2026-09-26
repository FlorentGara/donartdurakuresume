import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const verifySession = async (nextSession: Session | null) => {
      if (!nextSession) {
        if (active) { setSession(null); setLoading(false); }
        return;
      }
      if (active) setLoading(true);
      const { data, error } = await supabase.rpc('is_admin');
      if (active) {
        setSession(!error && data === true ? nextSession : null);
        setLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data }) => { void verifySession(data.session); });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      void verifySession(session);
    });

    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    const { data: isAdmin, error: accessError } = await supabase.rpc('is_admin');
    if (accessError || isAdmin !== true) {
      await supabase.auth.signOut();
      return { error: accessError ? 'Could not verify admin access. Check the database setup.' : 'This account is not a dashboard administrator.' };
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error: error?.message ?? null };
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
