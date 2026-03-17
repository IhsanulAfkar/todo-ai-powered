import { toast } from 'sonner';
import { toPng } from 'html-to-image';
import { Options } from 'html-to-image/lib/types';
import { withBasePath } from '../utils';
import { httpClient } from '../httpClient';

export type SignOutOptions = {
  callback?: string;
  reload?: boolean;
};

export async function signOut(opts: SignOutOptions = {}) {
  const { callback = withBasePath('/auth/login'), reload = false } = opts;

  try {
    await fetch(withBasePath('/api/auth/logout'), {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
    });
  } catch {
    // even if request fails, still proceed client-side
  }

  if (typeof window !== 'undefined') {
    if (reload) {
      window.location.href = callback;
    } else {
      // soft redirect
      window.location.assign(callback);
    }
  }
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const res = await fetch(withBasePath('/api/auth/session'), {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) return null;

    const json = await res.json();
    const data = json as SessionData;

    // optional sanity check
    if (!data?.user?.id) return null;

    return data;
  } catch {
    return null;
  }
}

export async function getVideoThumbnail(
  file: File,
  {
    at = 1,
    width = 480,
    mimeType = 'image/jpeg',
    quality = 1,
  }: { at?: number; width?: number; mimeType?: string; quality?: number } = {},
): Promise<Blob> {
  if (!file || !(file instanceof File)) throw new Error('No File provided');
  if (!file.type.startsWith('video/')) {
    throw new Error('Expected a video file');
  }

  const video = document.createElement('video');
  video.preload = 'metadata';
  video.muted = true;
  video.playsInline = true;
  video.addEventListener('error', () => {
    // DO NOT DELETE
    // DEBUG PURPOSE
    console.log('video.error', video.error?.code, video.error?.message);
    console.log('canPlayType', video.canPlayType(file.type));
  });
  const objectUrl = URL.createObjectURL(file);
  video.src = objectUrl;

  await new Promise<void>((resolve, reject) => {
    const onLoaded = () => resolve();
    const onErr = () => reject(new Error('Failed to load video metadata'));
    video.addEventListener('loadedmetadata', onLoaded, { once: true });
    video.addEventListener('error', onErr, { once: true });
  });

  const t = Math.min(Math.max(at, 0), Math.max(video.duration || 0, 0));
  video.currentTime = t;

  await new Promise<void>((resolve, reject) => {
    const onSeeked = () => resolve();
    const onErr = () => reject(new Error('Failed to seek video'));
    video.addEventListener('seeked', onSeeked, { once: true });
    video.addEventListener('error', onErr, { once: true });
  });

  const canvas = document.createElement('canvas');
  const aspect = video.videoWidth / video.videoHeight || 1;
  const outW = Math.max(1, width);
  const outH = Math.max(1, Math.round(outW / aspect));

  canvas.width = outW;
  canvas.height = outH;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(video, 0, 0, outW, outH);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) =>
        b ? resolve(b) : reject(new Error('Failed to create thumbnail blob')),
      mimeType,
      quality,
    );
  });

  URL.revokeObjectURL(objectUrl);
  return blob;
}
export async function getThumbnailForMedia(
  file: File,
): Promise<{ blob: Blob; filename: string }> {
  if (file.type.startsWith('image/')) {
    return { blob: file, filename: `${file.name}.jpg` };
  }

  if (file.type.startsWith('video/')) {
    const thumbBlob = await getVideoThumbnail(file);
    return { blob: thumbBlob, filename: `${file.name}.jpg` };
  }

  throw new Error(`Unsupported media type: ${file.type}`);
}
export function isBrowserFile(x: unknown): x is File {
  return typeof File !== 'undefined' && x instanceof File;
}

export function isBlob(x: unknown): x is Blob {
  return typeof Blob !== 'undefined' && x instanceof Blob;
}

export function toFile(input: unknown, filename: string): File {
  if (isBrowserFile(input)) return input;

  if (isBlob(input)) {
    return new File([input], filename, {
      type: input.type || 'application/octet-stream',
    });
  }

  throw new Error('FilePond item does not contain a File/Blob');
}
export async function captureRefImage(el: HTMLDivElement, options?: Options) {
  try {
    const img = await toPng(el, options);
    return img;
  } catch (e: any) {
    console.error('failed capture element:', el);
    throw e;
  }
}
export const getImageSize = (
  dataUrl: string,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.src = dataUrl;
  });
};

export const stripHtml = (html: string | null | undefined): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
  // const div = document.createElement('div');
  // div.innerHTML = html;

  // return div.textContent || div.innerText || '';
};
export const updateTaskStatus = async (id: number, status: string, onUpdate?: () => void) => {
  try {
    const { message, status: responseStatus } = await httpClient.put(`/tasks/${id}`, {
      status
    })
    if (responseStatus === 200) {
      toast.success(message)
      onUpdate?.()
      return
    }
    toast.error(message)
  } catch (error: any) {
    console.error(error)
    toast.error(error.message || 'Server Error')
  }
}