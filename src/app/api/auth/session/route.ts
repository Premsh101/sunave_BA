import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const idToken = typeof body?.idToken === 'string' ? body.idToken : '';

    if (!idToken) {
      return NextResponse.json({ error: 'idToken is required' }, { status: 400 });
    }

    const expiresInMs = 60 * 60 * 24 * 5 * 1000; // 5 days
    const maxAgeSeconds = 60 * 60 * 24 * 5;
    const hasFirebaseAdminEnv =
      Boolean(process.env.FIREBASE_PROJECT_ID) &&
      Boolean(process.env.FIREBASE_CLIENT_EMAIL) &&
      Boolean(process.env.FIREBASE_PRIVATE_KEY);

    let sessionCookie = idToken;

    if (hasFirebaseAdminEnv) {
      try {
        sessionCookie = await getAdminAuth().createSessionCookie(idToken, { expiresIn: expiresInMs });
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
