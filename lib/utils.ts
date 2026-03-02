import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildUrl(
  baseUrl: string,
  params?: Record<string, string | number | undefined>,
): string {
  const query = new URLSearchParams();

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value));
      }
    }
  }

  const queryString = query.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export const withBasePath = (path: string) => {
  const bp = process.env.NEXT_PUBLIC_BASEPATH || '';
  if (!bp) return path;
  return `${bp}${path.startsWith('/') ? path : `/${path}`}`;
};
