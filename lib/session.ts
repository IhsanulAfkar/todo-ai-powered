
import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)
export const SESSION_EXPIRED = 60 * 60 * 24 * 7
export const SESSION_KEY = 'SOCIALENS_SESSION'
export async function createSession(payload: SessionData) {
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}


export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as SessionData
  } catch {
    return null
  }
}

