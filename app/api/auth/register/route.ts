
import { httpServer } from '@/lib/httpServer'
import { createSession } from '@/lib/session'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const reqJson = await req.json()
        const result = await httpServer.raw('/register', {
            method: 'POST',
            body: JSON.stringify(reqJson),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const body = await result.json()
        if (result.ok) {
            return NextResponse.json(body)
        }
        return NextResponse.json(body, { status: result.status })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Server Error' }, { status: 500 })
    }
}
