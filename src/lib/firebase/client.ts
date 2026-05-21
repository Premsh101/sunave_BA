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

const hasAllFirebaseEnvVars = Object.values(firebaseEnv).every((value): value is string => Boolean(value));
const firebaseConfig: FirebaseOptions | null = hasAllFirebaseEnvVars ? firebaseEnv : null;

// Initialize Firebase (singleton) only when public config is available.
let app: FirebaseApp | null = null;

if (firebaseConfig) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}

export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;

export default app;
