'use client';

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  type User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
import type { SunaveUser } from '@/types/user';
import { PageLoader } from '@/components/ui/Spinner';

interface AuthContextType {
  user: SunaveUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<SunaveUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    const authInstance = auth;
    const dbInstance = db;

    const unsubscribe = onAuthStateChanged(authInstance, async (fUser) => {
      setFirebaseUser(fUser);
      
      if (fUser) {
        // Fetch or create SunaveUser document
        const userRef = doc(dbInstance, COLLECTIONS.USERS, fUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setUser({ ...userSnap.data(), uid: fUser.uid } as SunaveUser);
        } else {
          // Create new user profile
          const newUser: Partial<SunaveUser> = {
            uid: fUser.uid,
            email: fUser.email || '',
            displayName: fUser.displayName || 'New User',
            photoURL: fUser.photoURL || undefined,
            plan: 'free',
            role: 'owner',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            preferences: {
              theme: 'dark',
              language: 'en',
              transcriptionMode: 'bot-free',
              aiTone: 'professional',
              layoutDensity: 'comfortable',
              sidebarCollapsed: false,
              dashboardWidgets: ['recent-meetings', 'usage-stats'],
              notifications: {
                email: true,
                inApp: true,
                transcriptionComplete: true,
                documentGenerated: true,
              }
            },
            usage: {
              meetingsThisMonth: 0,
              aiTokensUsed: 0,
              storageUsedMB: 0,
              transcriptionMinutes: 0,
              documentsGenerated: 0,
              lastResetDate: new Date().toISOString(),
            }
          };
          
          await setDoc(userRef, newUser);
          setUser(newUser as SunaveUser);
        }
        
        // Setup secure session cookie via API
        const idToken = await fUser.getIdToken();
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });
      } else {
        setUser(null);
        // Clear session cookie
        await fetch('/api/auth/logout', { method: 'POST' });
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) {
      throw new Error('Firebase authentication is not available. Ensure all NEXT_PUBLIC_FIREBASE_* environment variables are set.');
    }

    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    if (!auth) {
      return;
    }

    await firebaseSignOut(auth);
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
