'use server';

import { requireAdmin } from '@/lib/supabase/admin-guard';
import { MEDIA_BUCKET } from '@/lib/media-paths';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function uploadMedia(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  id?: string;
  storage_path?: string;
  alt_text?: string;
  file_name?: string;
  error?: string;
}> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError || !supabase) {
    return { success: false, error: authError || 'Not authorized' };
  }

  const file = formData.get('file') as File | null;
  const altText = (formData.get('alt_text') as string | null)?.trim() || '';
  const postId = (formData.get('post_id') as string | null)?.trim() || null;

  if (!file || !(file instanceof File) || file.size === 0) {
    return { success: false, error: 'No image file provided.' };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      success: false,
      error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF, SVG.`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is 5MB.`,
    };
  }

  if (!altText) {
    return {
      success: false,
      error: 'Image alt text is required for accessibility.',
    };
  }

  try {
    const fileExt =
      file.type === 'image/webp'
        ? 'webp'
        : file.type === 'image/svg+xml'
          ? 'svg'
          : file.name.split('.').pop()?.toLowerCase() || 'webp';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const sanitizedName = file.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');
    // Object key only — never store the public URL here
    const storagePath = `uploads/${timestamp}-${sanitizedName}-${randomStr}.${fileExt}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return { success: false, error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(MEDIA_BUCKET)
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData.publicUrl;

    const insertRow: Record<string, unknown> = {
      file_name: file.name,
      file_path: publicUrl,
      storage_path: storagePath,
      mime_type: file.type,
      size_bytes: file.size,
      alt_text: altText,
    };
    if (postId) {
      insertRow.post_id = postId;
    }

    const { data: mediaRow, error: dbError } = await supabase
      .from('media')
      .insert(insertRow)
      .select('id')
      .single();

    if (dbError) {
      console.warn('Failed to insert media metadata record:', dbError.message);
    }

    return {
      success: true,
      url: publicUrl,
      id: mediaRow?.id,
      storage_path: storagePath,
      alt_text: altText,
      file_name: file.name,
    };
  } catch (err) {
    console.error('Upload exception:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Upload failed',
    };
  }
}
