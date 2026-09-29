/**
 * Helpers for Supabase Storage object keys in the blog-media bucket.
 */

const BUCKET = 'blog-media';

/** Extract object key from a public URL or return as-is if already a key. */
export function toStoragePath(urlOrPath: string | null | undefined): string | null {
  if (!urlOrPath) return null;
  const trimmed = urlOrPath.trim();
  if (!trimmed) return null;

  // Already an object key (uploads/...)
  if (!trimmed.includes('://') && !trimmed.startsWith('/')) {
    return trimmed.replace(/^\/*/, '');
  }

  const marker = `/object/public/${BUCKET}/`;
  const idx = trimmed.indexOf(marker);
  if (idx !== -1) {
    return decodeURIComponent(trimmed.slice(idx + marker.length).split('?')[0]);
  }

  // Fallback: /blog-media/...
  const alt = `/${BUCKET}/`;
  const altIdx = trimmed.indexOf(alt);
  if (altIdx !== -1) {
    return decodeURIComponent(trimmed.slice(altIdx + alt.length).split('?')[0]);
  }

  return null;
}

/** Collect image src URLs from HTML content. */
export function extractImageSrcs(html: string | null | undefined): string[] {
  if (!html) return [];
  const srcs: string[] = [];
  const re = /<img[^>]+src=["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    if (match[1]) srcs.push(match[1]);
  }
  return srcs;
}

export { BUCKET as MEDIA_BUCKET };
