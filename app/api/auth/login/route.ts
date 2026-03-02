import { createSession, SessionData } from '@/lib/session';
import { httpServer, TResponse } from '@/lib/httpServer';
import { response } from 'express';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username, password, captcha } = await req.json();

    const result = await httpServer.raw('/login', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
        captcha: captcha || '',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseJson = (await result.json()) as TResponse<{
      accessToken: string;
      refreshToken: string;
      user: any;
    }>;
    const { data: body } = responseJson;
    if (result.ok) {
      //
      const payload: SessionData = {
        user: {
          id: body.user.uuid,
          token: body.accessToken,
          refreshToken: body.refreshToken,
          name: body.user.name,
          username: body.user.username,
          role_id: 2,
        },
      };
      await createSession(payload);
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
