import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase/admin';

const FIVE_DAYS_SECONDS = 60 * 60 * 24 * 5;
const FIVE_DAYS_MS = FIVE_DAYS_SECONDS * 1000;
const ONE_HOUR_SECONDS = 60 * 60;

function getIdTokenMaxAgeSeconds(idToken: string): number {
  try {
    const parts = idToken.split('.');
    if (parts.length < 2) return ONE_HOUR_SECONDS;

    const payloadString = Buffer.from(parts[1], 'base64url').toString('utf8');
    const payload = JSON.parse(payloadString) as { exp?: unknown };
    if (typeof payload.exp !== 'number') return ONE_HOUR_SECONDS;

    const now = Math.floor(Date.now() / 1000);
    const remaining = payload.exp - now;
    if (remaining <= 0) return 1;

    return Math.min(remaining, ONE_HOUR_SECONDS);
  } catch {
    return ONE_HOUR_SECONDS;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const idToken = typeof body?.idToken === 'string' ? body.idToken : '';

    if (!idToken) {
      return NextResponse.json({ error: 'idToken is required' }, { status: 400 });
    }

    let maxAgeSeconds = getIdTokenMaxAgeSeconds(idToken);
    const hasFirebaseAdminEnv =
      Boolean(process.env.FIREBASE_PROJECT_ID) &&
      Boolean(process.env.FIREBASE_CLIENT_EMAIL) &&
      Boolean(process.env.FIREBASE_PRIVATE_KEY);

    let sessionCookie = idToken;

    if (hasFirebaseAdminEnv) {
      try {
        sessionCookie = await getAdminAuth().createSessionCookie(idToken, { expiresIn: FIVE_DAYS_MS });
        maxAgeSeconds = FIVE_DAYS_SECONDS;
      } catch (error) {
        console.error('Session cookie creation failed:', error);
        return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
      }
    } else {
      console.warn('Firebase Admin env vars missing; using simple idToken session cookie fallback.');
    }

    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    
    response.cookies.set('session', sessionCookie, {
      maxAge: maxAgeSeconds,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
