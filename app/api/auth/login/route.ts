import { httpServer } from '@/lib/httpServer';
import { createSession, SESSION_EXPIRED, SESSION_KEY } from '@/lib/session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const result = await httpServer.raw('/login', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseJson = await result.json();
    const { data: body } = responseJson;
    if (result.ok) {
      const payload: SessionData = {
        user: {
          id: body.user.uuid,
          token: body.accessToken,
          refreshToken: body.refreshToken,
          name: body.user.name,
          username: body.user.username,
        },
        accessTokenExpired: body.accessTokenExpired,
        refreshTokenExpired: body.refreshTokenExpired,
      };
      const token = await createSession(payload);
      const cookieStore = await cookies();
      cookieStore.set(SESSION_KEY, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_EXPIRED,
      });
      return NextResponse.json(
        { message: 'Login Success' },
        { status: result.status },
      );
    }
    return NextResponse.json(responseJson, { status: result.status });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
