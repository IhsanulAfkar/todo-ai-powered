import { NextRequest, NextResponse } from 'next/server';

const isDev = process.env.NODE_ENV === 'development';
export default async function proxy(req: NextRequest) {
  // setup CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = `
default-src 'self';
script-src 'self' ${isDev ? "'unsafe-inline' 'unsafe-eval'" : "'unsafe-inline'"} https: blob:;
connect-src 'self' ${isDev ? 'http://localhost:* ws://localhost:* wss://localhost:* https:' : 'http://localhost:* ws://localhost:* wss://localhost:* https:'} https://cloudflareinsights.com https://*.cloudflareinsights.com https://www.google.com https://www.gstatic.com https://www.recaptcha.net;
style-src 'self' 'unsafe-inline';
img-src 'self' blob: data: https: ${isDev ? 'http:' : 'http:'};
font-src 'self' data: https: ${isDev ? 'http:' : 'http:'};
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
frame-src https://www.google.com https://www.recaptcha.net https:;
upgrade-insecure-requests;
media-src https: ${isDev ? 'http:' : ''} blob:;
`;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s+/g, ' ')
    .trim();
  const r = NextResponse.next();
  r.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);
  return r;
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
