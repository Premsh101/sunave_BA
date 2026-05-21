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
  // Handle double-escaped newlines (\\n) that arise when the JSON private_key
  // value is itself JSON-encoded again (e.g. pasted through some env-var UIs
  // that re-escape the content).  This matches the three-character sequence
  // backslash+backslash+n in the runtime string and reduces it to
  // backslash+n so the single-escape pass below can finish the job.
  // Must run before the single-escape pass below.
  key = key.replace(/\\\\n/g, '\\n');
  // Replace literal two-character sequences \n with actual newline characters.
  // This covers the common case where the PEM key was stored with escaped
  // newlines rather than real ones (e.g. copied directly from a JSON file).
  key = key.replace(/\\n/g, '\n');
  // Strip carriage returns introduced by Windows line-endings (\r\n) or
  // editors that add \r characters, which cause OpenSSL decoder failures.
  key = key.replace(/\r/g, '');
  return key;
}

function initApp() {
  // Prefer a single FIREBASE_SERVICE_ACCOUNT_JSON env var that holds the
  // entire service-account JSON as a compact string.  This avoids all the
  // newline-escaping edge-cases that can corrupt the private key when it is
  // stored as an individual FIREBASE_PRIVATE_KEY variable.
  //
  // To produce the compact single-line value:
  //   cat your-service-account.json | python3 -c "import json,sys; print(json.dumps(json.load(sys.stdin)))"
  //   # or using jq:
  //   cat your-service-account.json | jq -c .
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    if (getApps().length > 0) return getApps()[0];
    let serviceAccount: object;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
    } catch (err) {
      throw new Error(
        `Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
    const app = initializeApp({ credential: cert(serviceAccount as Parameters<typeof cert>[0]) });
    console.log('[FirebaseAdmin] Initialized successfully (via FIREBASE_SERVICE_ACCOUNT_JSON)');
    return app;
  }

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
