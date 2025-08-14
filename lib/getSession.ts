import { cookies } from 'next/headers'
import { verifySession } from '@/lib/session'

export async function getSession() {
    const setCookie = await cookies()
  const token = setCookie.get('SESSION_KEY')?.value
  if (!token) return null
  return await verifySession(token)
}
