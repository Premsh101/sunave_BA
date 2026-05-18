// Sunave — Firebase Admin SDK Initialization (Server-only)
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Check for service account credentials
  const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  if (serviceAccount) {
    try {
      // If it's a JSON string (e.g., from environment variable)
      const parsed = JSON.parse(serviceAccount);
      return initializeApp({
        credential: cert(parsed),
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || parsed.project_id,
      });
    } catch {
      // If it's a file path
      return initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      });
    }
  }

  // Default credentials (Cloud Run / GCE)
  return initializeApp({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  });
}

const adminApp = getAdminApp();

export const adminAuth: Auth = getAuth(adminApp);
export const adminDb: Firestore = getFirestore(adminApp);

export default adminApp;
