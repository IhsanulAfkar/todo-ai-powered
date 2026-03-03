import { cookies } from 'next/headers';
import { COOKIE_NAME, redisKey, safeParseSession } from './session';
import { getRedisClient } from '@/service/redis';

export async function getServerSession() {
  const cookieStore = await cookies();
  const sid = cookieStore.get(COOKIE_NAME)?.value;
  if (!sid) return null;

  const redis = getRedisClient();
  const raw = await redis.get(redisKey(sid));
  if (!raw) return null;

  return safeParseSession(raw);
}
