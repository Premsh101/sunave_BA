// Firebase Admin SDK (Production-safe for Coolify/Docker)
// Uses lazy initialization so that env vars are only required at request time,
// not at build time (avoids failures during `next build` in Docker).
//
// Private key parsing handles:
//   1. Literal \n sequences (common in .env files and CI/CD systems)
//   2. Surrounding double-quotes (Coolify wraps values in double-quotes)
//   3. Extra whitespace / trailing newlines
// This resolves OpenSSL 3 "unsupported" decoder errors caused by malformed keys.

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let adminAppInstance: App | undefined;
let adminAuthInstance: Auth | undefined;
let adminDbInstance: Firestore | undefined;

function parsePrivateKey(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  return raw
    .replace(/^["']|["']$/g, '')  // strip surrounding quotes (Coolify adds these)
    .replace(/\\n/g, '\n')        // convert literal \n to real newlines
    .trim();                       // remove leading/trailing whitespace
}

function validateEnvVars(): { projectId: string; clientEmail: string; privateKey: string } {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (!projectId) {
    console.error('[FirebaseAdmin] FATAL: Missing FIREBASE_PROJECT_ID');
    throw new Error('Missing Firebase Admin environment variable: FIREBASE_PROJECT_ID');
  }
  if (!clientEmail) {
    console.error('[FirebaseAdmin] FATAL: Missing FIREBASE_CLIENT_EMAIL');
    throw new Error('Missing Firebase Admin environment variable: FIREBASE_CLIENT_EMAIL');
  }
  if (!privateKey) {
    console.error('[FirebaseAdmin] FATAL: Missing FIREBASE_PRIVATE_KEY');
    throw new Error('Missing Firebase Admin environment variable: FIREBASE_PRIVATE_KEY');
  }
  if (!privateKey.includes('-----BEGIN')) {
    console.error('[FirebaseAdmin] FATAL: FIREBASE_PRIVATE_KEY does not appear to be a valid PEM key');
    throw new Error('FIREBASE_PRIVATE_KEY is malformed — expected a PEM-encoded RSA private key');
  }

  return { projectId, clientEmail, privateKey };
}

function getAdminApp(): App {
  if (adminAppInstance) return adminAppInstance;

  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminAppInstance = existingApps[0];
    console.log('[FirebaseAdmin] Reusing existing app instance');
    return adminAppInstance;
  }

  const { projectId, clientEmail, privateKey } = validateEnvVars();

  // Safe diagnostic log — never log the private key itself
  console.log('[FirebaseAdmin] Initializing app', {
    projectId,
    clientEmail,
    privateKeyLength: privateKey.length,
    privateKeyPrefix: privateKey.slice(0, 27), // "-----BEGIN RSA PRIVATE KEY" or similar
  });

  try {
    adminAppInstance = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  } catch (err) {
    console.error('[FirebaseAdmin] initializeApp failed:', err);
    throw err;
  }

  console.log('[FirebaseAdmin] App initialized successfully — projectId:', projectId);
  return adminAppInstance;
}

export function getAdminAuth(): Auth {
  if (!adminAuthInstance) {
    console.log('[FirebaseAdmin] Creating Auth instance');
    adminAuthInstance = getAuth(getAdminApp());
    console.log('[FirebaseAdmin] Auth instance ready');
  }
  return adminAuthInstance;
}

export function getAdminDb(): Firestore {
  if (!adminDbInstance) {
    console.log('[FirebaseAdmin] Creating Firestore instance');
    adminDbInstance = getFirestore(getAdminApp());
    console.log('[FirebaseAdmin] Firestore instance ready');
  }
  return adminDbInstance;
}

// Convenience re-export so callers can use `adminAuth` directly
export const adminAuth = {
  get instance(): Auth {
    return getAdminAuth();
  },
};
