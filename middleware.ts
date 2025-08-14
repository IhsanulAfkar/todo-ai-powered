import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_KEY, verifySession } from './lib/session'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_KEY)?.value
  const verified = token ? await verifySession(token) : null
  const { pathname } = req.nextUrl
  if (!verified && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }
  if (verified && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
}
