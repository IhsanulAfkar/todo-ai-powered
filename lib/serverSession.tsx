import { cookies } from 'next/headers';
import { SessionData } from './session';
export const getServerSession = async () => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
      method: 'GET',
      headers: {
        // ✅ forward all cookies
        cookie: cookieStore.toString(),
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = (await res.json()) as SessionData | null;
    return json;
  } catch (error) {
    console.error(error);
    return null;
  }
};
