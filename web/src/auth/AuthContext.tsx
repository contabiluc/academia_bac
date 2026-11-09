import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, firebaseConfigured } from '@/lib/firebase';
import { KEYS, read, write } from '@/lib/storage';

const CLOUD_KEYS = Object.values(KEYS);

interface AuthState {
  user: User | null;
  configured: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  reset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth în afara AuthProvider');
  return v;
}

async function loadCloud(user: User) {
  if (!db) return;
  const snap = await getDoc(doc(db, 'users', user.uid, 'data', 'progress'));
  if (snap.exists()) {
    const data = snap.data();
    for (const k of CLOUD_KEYS) if (data[k] !== undefined) write(k, data[k]);
  }
}

async function saveCloud(user: User) {
  if (!db) return;
  const payload: Record<string, unknown> = {};
  for (const k of CLOUD_KEYS) payload[k] = read(k, null);
  await setDoc(doc(db, 'users', user.uid), { email: user.email, displayName: user.displayName, updatedAt: serverTimestamp() }, { merge: true });
  await setDoc(doc(db, 'users', user.uid, 'data', 'progress'), { ...payload, updatedAt: serverTimestamp() }, { merge: true });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!auth) return;
    setPersistence(auth, browserLocalPersistence).catch(() => undefined);
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          await loadCloud(u);
          await saveCloud(u);
        } catch (e) {
          console.error('Sincronizare eșuată', e);
        }
      }
    });
  }, []);

  // Sincronizare automată la fiecare modificare locală (debounce)
  useEffect(() => {
    if (!user) return;
    let t: ReturnType<typeof setTimeout>;
    const onChange = () => {
      clearTimeout(t);
      t = setTimeout(() => saveCloud(user).catch(console.error), 1500);
    };
    window.addEventListener('academia-local-change', onChange);
    return () => {
      clearTimeout(t);
      window.removeEventListener('academia-local-change', onChange);
    };
  }, [user]);

  const need = () => {
    if (!auth) throw new Error('Firebase nu este configurat (vezi web/.env.example).');
    return auth;
  };

  const value: AuthState = {
    user,
    configured: firebaseConfigured,
    login: async (email, password) => {
      await signInWithEmailAndPassword(need(), email, password);
    },
    signup: async (name, email, password) => {
      const cred = await createUserWithEmailAndPassword(need(), email, password);
      await updateProfile(cred.user, { displayName: name });
      write(KEYS.profile, { name, goal: '9', track: 'Real' });
    },
    reset: async (email) => {
      await sendPasswordResetEmail(need(), email);
    },
    logout: async () => {
      if (auth) await signOut(auth);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
