// Sunave — Firebase Client SDK Initialization
import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseEnv = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const FIREBASE_ENV_VAR_NAMES: Record<keyof typeof firebaseEnv, string> = {
  apiKey: 'NEXT_PUBLIC_FIREBASE_API_KEY',
  authDomain: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  projectId: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  storageBucket: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'NEXT_PUBLIC_FIREBASE_APP_ID',
};

const missingVars = (Object.keys(firebaseEnv) as Array<keyof typeof firebaseEnv>)
  .filter((k) => !firebaseEnv[k])
  .map((k) => FIREBASE_ENV_VAR_NAMES[k]);

const hasAllFirebaseEnvVars = missingVars.length === 0;

if (!hasAllFirebaseEnvVars && typeof window !== 'undefined') {
  console.warn('[FirebaseClient] Missing env vars — Firebase client SDK not initialized:', missingVars);
}

const firebaseConfig: FirebaseOptions | null = hasAllFirebaseEnvVars ? firebaseEnv : null;

// Initialize Firebase (singleton) only when public config is available.
let app: FirebaseApp | null = null;

if (firebaseConfig) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}

export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;

export default app;
