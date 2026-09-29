/**
 * Client-side image compression to WebP before upload.
 * Skips SVG (vector) and GIF (may be animated).
 */

const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 0.82;

export async function compressImageToWebP(file: File): Promise<File> {
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;

    let targetW = width;
    let targetH = height;
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      const scale = MAX_DIMENSION / Math.max(width, height);
      targetW = Math.round(width * scale);
      targetH = Math.round(height * scale);
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, targetW, targetH);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY);
    });

    if (!blob) return file;

    // Prefer compressed only when smaller (or original wasn't WebP)
    if (blob.size >= file.size && file.type === 'image/webp') {
      return file;
    }

    const baseName = file.name.replace(/\.[^/.]+$/, '') || 'image';
    return new File([blob], `${baseName}.webp`, {
      type: 'image/webp',
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}
