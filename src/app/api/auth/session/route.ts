import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase/admin';
import type { DecodedIdToken } from 'firebase-admin/auth';

const FIVE_DAYS_SECONDS = 60 * 60 * 24 * 5;
const FIVE_DAYS_MS = FIVE_DAYS_SECONDS * 1000;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const idToken = typeof body?.idToken === 'string' ? body.idToken : '';

    if (!idToken) {
      console.warn('[Session] POST called without idToken');
      return NextResponse.json({ error: 'idToken is required' }, { status: 400 });
    }

    const hasFirebaseAdminEnv =
      Boolean(process.env.FIREBASE_PROJECT_ID) &&
      Boolean(process.env.FIREBASE_CLIENT_EMAIL) &&
      Boolean(process.env.FIREBASE_PRIVATE_KEY);

    if (!hasFirebaseAdminEnv) {
      console.error('[Session] Firebase Admin env vars are missing — cannot create session cookie');
      return NextResponse.json({ error: 'Server authentication is not configured' }, { status: 503 });
    }

    let decodedToken: DecodedIdToken;
    try {
      decodedToken = await getAdminAuth().verifyIdToken(idToken);
      console.log('[Session] ID token verified for uid:', decodedToken.uid);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[Session] verifyIdToken failed:', message);
      return NextResponse.json({ error: 'Invalid or expired ID token' }, { status: 401 });
    }

    let sessionCookie: string;
    try {
      sessionCookie = await getAdminAuth().createSessionCookie(idToken, { expiresIn: FIVE_DAYS_MS });
      console.log('[Session] Session cookie created for uid:', decodedToken.uid);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[Session] createSessionCookie failed:', message);
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }

    const isProduction = process.env.NODE_ENV === 'production';
    const response = NextResponse.json({ status: 'success' }, { status: 200 });

    response.cookies.set('session', sessionCookie, {
      maxAge: FIVE_DAYS_SECONDS,
      httpOnly: true,
      secure: isProduction,
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('[Session] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
