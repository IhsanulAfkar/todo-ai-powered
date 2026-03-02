import { cookies } from 'next/headers';
import crypto from 'crypto';
import { getRedisClient } from '@/service/redis';
import parse from 'parse-duration';
export const COOKIE_NAME = 'session_id';
const IDLE_TTL = parse(process.env.SESSION_EXPIRED_TIME ?? '15m')! / 1000;
const COOKIE_TTL = 24 * 60 * 60 * 10;
const REDIS_PREFIX = process.env.SESSION_PREFIX ?? 'session:';

export type SessionData = {
  user: {
    id: string;
    name: string;
    username: string;
    role_id: number;
    token: string;
    refreshToken: string;
  };
};

function newSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

function redisKey(sid: string) {
  return `${REDIS_PREFIX}${sid}`;
}

async function setSessionCookie(sid: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, sid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_TTL,
  });
}

async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

function safeParseSession(raw: string): SessionData | null {
  try {
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export async function createSession(data: SessionData) {
  const sid = newSessionId();
  const redis = getRedisClient();

  await redis.set(redisKey(sid), JSON.stringify(data), 'EX', IDLE_TTL);
  await setSessionCookie(sid);

  return sid;
}

/**
 * Get session by cookie. Touches (extends) by default.
 */
export async function getSession() {
  const cookieStore = await cookies();
  const sid = cookieStore.get(COOKIE_NAME)?.value;
  if (!sid) return null;

  const redis = getRedisClient();
  const raw = await redis.get(redisKey(sid));
  if (!raw) return null;

  const data = safeParseSession(raw);
  if (!data) {
    await redis.del(redisKey(sid));
    await clearSessionCookie();
    return null;
  }

  await extendSessionTimeoutById(sid, redis, JSON.stringify(data));

  return data;
}

export async function extendSessionTimeout() {
  const cookieStore = await cookies();
  const sid = cookieStore.get(COOKIE_NAME)?.value;
  if (!sid) return false;

  const redis = getRedisClient();
  const data = await redis.get(redisKey(sid));
  if (!data) {
    await clearSessionCookie();
    return false;
  }

  await extendSessionTimeoutById(sid, redis, data);
  return true;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const sid = cookieStore.get(COOKIE_NAME)?.value;

  if (sid) {
    const redis = getRedisClient();
    await redis.del(redisKey(sid));
  }

  await clearSessionCookie();
}

export async function extendSessionTimeoutById(
  sid: string,
  redis = getRedisClient(),
  payload: string,
) {
  await redis.set(redisKey(sid), payload, 'EX', IDLE_TTL);
  await setSessionCookie(sid);
}
