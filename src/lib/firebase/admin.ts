import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function parsePrivateKey(raw: string): string {
  let key = raw.trim();
  // Some deployment platforms (e.g. Coolify, Docker env UI) wrap the pasted
  // value in matching quotes.  Strip them only when both ends carry the same
  // quote character so we don't accidentally corrupt a key that genuinely
  // starts or ends with a quote.
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  // Replace literal two-character sequences \n with actual newline characters.
  // This covers the common case where the PEM key was stored with escaped
  // newlines rather than real ones (e.g. copied directly from a JSON file).
  key = key.replace(/\\n/g, '\n');
  return key;
}

function initApp() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY ?? '');

  if (!projectId) throw new Error('Missing FIREBASE_PROJECT_ID');
  if (!clientEmail) throw new Error('Missing FIREBASE_CLIENT_EMAIL');
  if (!privateKey) throw new Error('Missing FIREBASE_PRIVATE_KEY');

  if (getApps().length > 0) return getApps()[0];

  const app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  console.log('[FirebaseAdmin] Initialized successfully');
  return app;
}

let _adminAuth: ReturnType<typeof getAuth> | undefined;
let _adminDb: ReturnType<typeof getFirestore> | undefined;

export const adminAuth = new Proxy({} as ReturnType<typeof getAuth>, {
  get(_target, prop, receiver) {
    _adminAuth ??= getAuth(initApp());
    const value = Reflect.get(_adminAuth, prop, receiver);
    return typeof value === 'function' ? value.bind(_adminAuth) : value;
  },
});

export const adminDb = new Proxy({} as ReturnType<typeof getFirestore>, {
  get(_target, prop, receiver) {
    _adminDb ??= getFirestore(initApp());
    const value = Reflect.get(_adminDb, prop, receiver);
    return typeof value === 'function' ? value.bind(_adminDb) : value;
  },
});
