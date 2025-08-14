import { SESSION_KEY } from '@/lib/session'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'


function getSecretKey() {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error('JWT_SECRET is not set')
    return new TextEncoder().encode(secret)
}

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get(SESSION_KEY)?.value
        if (!token) {
            return NextResponse.json(null, { status: 200 })
        }

        // Verify the token
        const { payload } = await jwtVerify<SessionData>(
            token,
            getSecretKey()
        )
        return NextResponse.json(payload)
    } catch {
        return NextResponse.json(null, { status: 200 })
    }
}
