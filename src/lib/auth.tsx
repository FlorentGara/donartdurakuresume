import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextValue {
  session: any | null; // For compatibility
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const listener = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!active) return;
      if (!firebaseUser) {
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      // Check if user is admin
      try {
        const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
        if (active) {
          if (adminDoc.exists()) {
            setUser(firebaseUser);
            setSession({ user: firebaseUser }); // mock session for compatibility
          } else {
            setUser(null);
            setSession(null);
          }
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setUser(null);
          setSession(null);
          setLoading(false);
        }
      }
    });

    return () => { active = false; listener(); };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // check admin access
      const adminDoc = await getDoc(doc(db, 'admins', userCredential.user.uid));
      if (!adminDoc.exists()) {
        await firebaseSignOut(auth);
        return { error: 'This account is not a dashboard administrator.' };
      }
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setSession(null);
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
