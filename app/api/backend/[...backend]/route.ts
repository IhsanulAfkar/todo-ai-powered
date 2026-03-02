import { getServerSession } from '@/lib/serverSession';
import { NextRequest, NextResponse } from 'next/server';

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ backend: string[] }> },
) {
  const session = await getServerSession();
  // if (!session?.user?.token) {
  //   return NextResponse.json(
  //     {
  //       data: null,
  //       message: 'Unauthorized',
  //       status: 401,
  //     },
  //     { status: 401 },
  //   );
  // }
  const { backend } = await params;
  const path = backend.join('/');
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}${req.nextUrl.search}`;

  const method = req.method;
  // const headers = await nextHeaders();
  const headers = new Headers();
  headers.append('x-api-key', process.env.NEXT_PUBLIC_API_KEY!);
  if (session?.user?.token)
    headers.append('Authorization', 'Bearer ' + session.user.token);
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
      const json = await req.json();
      body = JSON.stringify(json);
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
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
};
