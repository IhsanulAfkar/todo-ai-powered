export const getSession = async (): Promise<SessionData | null> => {
  try {
    const res = await fetch('/api/auth/session', { credentials: 'include' });
    return await res.json();
  } catch (error) {
    return null;
  }
};
