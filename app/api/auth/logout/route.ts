// app/api/auth/logout/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SESSION_KEY } from '@/lib/session';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_KEY, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0), // Expire immediately
  });

  return NextResponse.json({ success: true });
}
