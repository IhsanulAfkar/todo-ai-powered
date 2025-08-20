import { NextRequest, NextResponse } from 'next/server';
import { cookies, headers as nextHeaders } from 'next/headers';
import { getServerSession } from '@/lib/getServerSession';
import { httpServer } from '@/lib/httpServer';
import { createSession, SESSION_EXPIRED, SESSION_KEY } from '@/lib/session';

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ backend: string[] }> },
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.token) {
      return NextResponse.json(
        {
          data: null,
          message: 'Unauthorized',
          status: 401,
        },
        { status: 401 },
      );
    }
    let accessToken = session.user.token;
    if (session?.accessTokenExpired) {
      const isAccessTokenExpired =
        new Date(session.accessTokenExpired) < new Date();
      if (isAccessTokenExpired) {
        // check, and renew
        if (session.refreshTokenExpired) {
          const isRefreshTokenExpired =
            new Date(session.refreshTokenExpired) < new Date();
          if (!isRefreshTokenExpired) {
            try {
              const refreshResponse = await httpServer.raw('/refresh', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  refreshToken: session.user.refreshToken,
                }),
              });
              const responseData = await refreshResponse.json();
              if (!refreshResponse.ok) throw new Error(responseData);

              const newAccessToken = responseData.data?.accessToken;
              if (!newAccessToken) throw new Error('No access token found');
              const newSession = await createSession({
                ...session,
                user: {
                  ...session.user,
                  token: newAccessToken,
                },
              });
              const setCookie = await cookies();
              setCookie.set(SESSION_KEY, newSession, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: SESSION_EXPIRED,
              });
              accessToken = newAccessToken;
            } catch (error) {
              console.error(error);
              return NextResponse.json(
                {
                  message: 'Failed Refresh Session',
                },
                {
                  status: 403,
                },
              );
            }
          } else {
            return NextResponse.json(
              {
                message: 'Refresh Token Expired',
              },
              {
                status: 403,
              },
            );
          }
        }
      }
    }
    const { backend } = await params;
    const path = backend.join('/');
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}${req.nextUrl.search}`;

    const method = req.method;
    // const headers = await nextHeaders();
    const headers = new Headers();
    headers.append('x-api-key', process.env.NEXT_PUBLIC_BACKEND_API_KEY!);
    if (accessToken) headers.append('Authorization', 'Bearer ' + accessToken);
    let body: BodyInit | null = null;
    if (
      method === 'POST' ||
      method === 'PUT' ||
      method === 'PATCH' ||
      method === 'DELETE'
    ) {
      const contentType = req.headers.get('content-type') || '';

      if (contentType.includes('multipart/form-data')) {
        const formData = await req.formData();

        const externalFormData = new FormData();
        formData.forEach((value, key) => {
          if (value instanceof File) {
            externalFormData.append(key, value);
          } else {
            externalFormData.append(key, value.toString());
          }
        });

        body = externalFormData;
        headers.delete('content-type');
      } else if (contentType.includes('application/json')) {
        try {
          const json = await req.json();
          body = JSON.stringify(json);
        } catch (err) {
          console.error('Invalid JSON body', err);
          body = null;
        }
        headers.append('Content-Type', 'application/json');
      } else {
        body = await req.text();
      }
    }
    const externalRes = await fetch(url, {
      method,
      headers,
      body,
    });
    const responseBody = await externalRes.json();
    const resHeaders = new Headers(externalRes.headers);
    resHeaders.delete('content-length');
    resHeaders.delete('content-encoding');

    return NextResponse.json(responseBody, {
      status: externalRes.status,
      headers: resHeaders,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
};
