import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ status: 'success' }, { status: 200 });
  
  response.cookies.set('session', '', {
    maxAge: -1,
    path: '/',
  });

  return response;
}
