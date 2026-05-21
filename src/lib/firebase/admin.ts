import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY || '';

const privateKey = rawPrivateKey.replace(/\n/g, '\n');

if (!projectId) {
throw new Error('Missing FIREBASE_PROJECT_ID');
}

if (!clientEmail) {
throw new Error('Missing FIREBASE_CLIENT_EMAIL');
}

if (!privateKey) {
throw new Error('Missing FIREBASE_PRIVATE_KEY');
}

const app =
getApps().length > 0
? getApps()[0]
: initializeApp({
credential: cert({
projectId,
clientEmail,
privateKey,
}),
});

const adminAuth = getAuth(app);
const adminDb = getFirestore(app);

console.log('[FirebaseAdmin] Initialized successfully');

export { adminAuth, adminDb };
