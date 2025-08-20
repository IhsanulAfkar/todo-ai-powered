'use server';
import { cookies } from 'next/headers';
import { SESSION_KEY, verifySession } from './session';

export const getServerSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_KEY)?.value;

  if (!token) return null;

  try {
    const session = await verifySession(token);

    return session || null;
  } catch {
    return null;
  }
};
