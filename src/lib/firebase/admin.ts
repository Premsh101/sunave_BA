// Firebase Admin SDK (Production-safe for Coolify/Docker)
// Uses lazy initialization so that env vars are only required at request time,
// not at build time (avoids failures during `next build` in Docker).

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let adminAppInstance: App | undefined;
let adminAuthInstance: Auth | undefined;
let adminDbInstance: Firestore | undefined;

function getAdminApp(): App {
  if (adminAppInstance) return adminAppInstance;

  if (getApps().length > 0) {
    adminAppInstance = getApps()[0];
    console.log('[FirebaseAdmin] Reusing existing app instance');
    return adminAppInstance;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Handle Coolify/Docker env var formats:
  // 1. Literal \n sequences (common in .env files and many CI/CD systems)
  // 2. Surrounding quotes (Coolify wraps values in double-quotes)
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ?.replace(/\\n/g, '\n')
    ?.replace(/^"|"$/g, '');

  if (!projectId) {
    console.error('[FirebaseAdmin] Missing FIREBASE_PROJECT_ID');
    throw new Error('Missing Firebase Admin environment variable: FIREBASE_PROJECT_ID');
  }
  if (!clientEmail) {
    console.error('[FirebaseAdmin] Missing FIREBASE_CLIENT_EMAIL');
    throw new Error('Missing Firebase Admin environment variable: FIREBASE_CLIENT_EMAIL');
  }
  if (!privateKey) {
    console.error('[FirebaseAdmin] Missing FIREBASE_PRIVATE_KEY');
    throw new Error('Missing Firebase Admin environment variable: FIREBASE_PRIVATE_KEY');
  }

  console.log('[FirebaseAdmin] Initializing app', { projectId, clientEmail });

  adminAppInstance = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  console.log('[FirebaseAdmin] App initialized successfully');
  return adminAppInstance;
}

export function getAdminAuth(): Auth {
  if (!adminAuthInstance) {
    console.log('[FirebaseAdmin] Creating Auth instance');
    adminAuthInstance = getAuth(getAdminApp());
  }
  return adminAuthInstance;
}

export function getAdminDb(): Firestore {
  if (!adminDbInstance) {
    console.log('[FirebaseAdmin] Creating Firestore instance');
    adminDbInstance = getFirestore(getAdminApp());
  }
  return adminDbInstance;
}
