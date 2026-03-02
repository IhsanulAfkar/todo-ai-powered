import { extendSessionTimeout, getSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const payload = await getSession();
    if (!payload) return NextResponse.json(null, { status: 401 });
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
export async function POST() {
  try {
    const status = await extendSessionTimeout();
    return NextResponse.json({ status });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: false }, { status: 500 });
  }
}
