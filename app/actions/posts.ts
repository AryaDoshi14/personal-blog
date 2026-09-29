'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/admin-guard';
import { sanitizeHtml } from '@/lib/sanitize';
import { postFormSchemaWithAltCheck } from '@/lib/validations/posts';
import {
  extractImageSrcs,
  MEDIA_BUCKET,
  toStoragePath,
} from '@/lib/media-paths';

export type PostActionResult = {
  success: boolean;
  id?: string;
  slug?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

// Check if slug is unique (excluding an optional current post ID)
async function isSlugUnique(
  supabase: any,
  slug: string,
  excludeId?: string
): Promise<boolean> {
  let query = supabase.from('posts').select('id').eq('slug', slug);
  if (excludeId) {
    query = query.neq('id', excludeId);
  }
  const { data } = await query.maybeSingle();
  return !data;
}

export async function createPost(formData: FormData): Promise<PostActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError || !supabase) {
    return { success: false, error: authError || 'Admin authorization required' };
  }

  // Parse raw form data
  const rawData: Record<string, any> = {
    slug: formData.get('slug'),
    title_gu: formData.get('title_gu'),
    title_en: formData.get('title_en'),
    excerpt_gu: formData.get('excerpt_gu'),
    excerpt_en: formData.get('excerpt_en'),
    content_gu: formData.get('content_gu'),
    content_en: formData.get('content_en'),
    cover_image_url: formData.get('cover_image_url'),
    cover_image_alt: formData.get('cover_image_alt'),
    category_id: formData.get('category_id'),
    tags: formData.get('tags'),
    status: formData.get('status') || 'draft',
    author_name_gu: formData.get('author_name_gu') || 'સંપાદક',
    author_name_en: formData.get('author_name_en'),
  };

  // Validate with Zod
  const validationResult = postFormSchemaWithAltCheck.safeParse(rawData);
  if (!validationResult.success) {
    const fieldErrors: Record<string, string[]> = {};
    const flatErrors = validationResult.error.flatten().fieldErrors;
    for (const [key, val] of Object.entries(flatErrors)) {
      if (val) fieldErrors[key] = val;
    }
    return {
      success: false,
      error: 'Please fix the errors in the form.',
      fieldErrors,
    };
  }

  const data = validationResult.data;

  // Check slug uniqueness
  const unique = await isSlugUnique(supabase, data.slug);
  if (!unique) {
    return {
      success: false,
      error: `A post with slug "${data.slug}" already exists. Please choose a different slug.`,
      fieldErrors: { slug: ['This slug is already in use. Please enter a unique slug.'] },
    };
  }

  // Sanitize rich text content on server
  const sanitizedContentGu = sanitizeHtml(data.content_gu);
  const sanitizedContentEn = data.content_en ? sanitizeHtml(data.content_en) : null;

  const publishedAt =
    data.status === 'published' ? new Date().toISOString() : null;

  // Insert using session client (RLS enforces admin-only write)
  const { data: newPost, error: insertError } = await supabase
    .from('posts')
    .insert({
      slug: data.slug,
      title_gu: data.title_gu,
      title_en: data.title_en,
      excerpt_gu: data.excerpt_gu,
      excerpt_en: data.excerpt_en,
      content_gu: sanitizedContentGu,
      content_en: sanitizedContentEn,
      cover_image_url: data.cover_image_url,
      cover_image_alt: data.cover_image_alt,
      category_id: data.category_id,
      tags: data.tags,
      status: data.status,
      published_at: publishedAt,
      author_name_gu: data.author_name_gu,
      author_name_en: data.author_name_en,
    })
    .select('id, slug')
    .single();

  if (insertError) {
    console.error('Insert post error:', insertError);
    return { success: false, error: insertError.message };
  }

  // Revalidate public & admin paths immediately
  revalidatePath('/');
  revalidatePath('/gu');
  revalidatePath('/en');
  revalidatePath('/gu/blog');
  revalidatePath('/en/blog');
  revalidatePath(`/gu/blog/${newPost.slug}`);
  revalidatePath(`/en/blog/${newPost.slug}`);
  revalidatePath('/admin');
  revalidatePath('/admin/posts');

  return { success: true, id: newPost.id, slug: newPost.slug };
}

export async function updatePost(id: string, formData: FormData): Promise<PostActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError || !supabase) {
    return { success: false, error: authError || 'Admin authorization required' };
  }

  const rawData: Record<string, any> = {
    slug: formData.get('slug'),
    title_gu: formData.get('title_gu'),
    title_en: formData.get('title_en'),
    excerpt_gu: formData.get('excerpt_gu'),
    excerpt_en: formData.get('excerpt_en'),
    content_gu: formData.get('content_gu'),
    content_en: formData.get('content_en'),
    cover_image_url: formData.get('cover_image_url'),
    cover_image_alt: formData.get('cover_image_alt'),
    category_id: formData.get('category_id'),
    tags: formData.get('tags'),
    status: formData.get('status') || 'draft',
    author_name_gu: formData.get('author_name_gu') || 'સંપાદક',
    author_name_en: formData.get('author_name_en'),
  };

  const validationResult = postFormSchemaWithAltCheck.safeParse(rawData);
  if (!validationResult.success) {
    const fieldErrors: Record<string, string[]> = {};
    const flatErrors = validationResult.error.flatten().fieldErrors;
    for (const [key, val] of Object.entries(flatErrors)) {
      if (val) fieldErrors[key] = val;
    }
    return {
      success: false,
      error: 'Please fix the errors in the form.',
      fieldErrors,
    };
  }

  const data = validationResult.data;

  // Check slug uniqueness excluding current post
  const unique = await isSlugUnique(supabase, data.slug, id);
  if (!unique) {
    return {
      success: false,
      error: `A post with slug "${data.slug}" already exists. Please choose a different slug.`,
      fieldErrors: { slug: ['This slug is already in use by another post.'] },
    };
  }

  // Get current post to check published_at state
  const { data: currentPost } = await supabase
    .from('posts')
    .select('published_at, status, slug')
    .eq('id', id)
    .single();

  let publishedAt = currentPost?.published_at;
  if (data.status === 'published' && (!publishedAt || currentPost?.status !== 'published')) {
    publishedAt = new Date().toISOString();
  } else if (data.status === 'draft') {
    publishedAt = null;
  }

  const sanitizedContentGu = sanitizeHtml(data.content_gu);
  const sanitizedContentEn = data.content_en ? sanitizeHtml(data.content_en) : null;

  const { error: updateError } = await supabase
    .from('posts')
    .update({
      slug: data.slug,
      title_gu: data.title_gu,
      title_en: data.title_en,
      excerpt_gu: data.excerpt_gu,
      excerpt_en: data.excerpt_en,
      content_gu: sanitizedContentGu,
      content_en: sanitizedContentEn,
      cover_image_url: data.cover_image_url,
      cover_image_alt: data.cover_image_alt,
      category_id: data.category_id,
      tags: data.tags,
      status: data.status,
      published_at: publishedAt,
      author_name_gu: data.author_name_gu,
      author_name_en: data.author_name_en,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (updateError) {
    console.error('Update post error:', updateError);
    return { success: false, error: updateError.message };
  }

  // Revalidate old and new paths
  revalidatePath('/');
  revalidatePath('/gu');
  revalidatePath('/en');
  revalidatePath('/gu/blog');
  revalidatePath('/en/blog');
  if (currentPost?.slug) {
    revalidatePath(`/gu/blog/${currentPost.slug}`);
    revalidatePath(`/en/blog/${currentPost.slug}`);
  }
  revalidatePath(`/gu/blog/${data.slug}`);
  revalidatePath(`/en/blog/${data.slug}`);
  revalidatePath('/admin');
  revalidatePath('/admin/posts');
  revalidatePath(`/admin/posts/${id}/edit`);

  return { success: true, id, slug: data.slug };
}

export async function deletePost(id: string): Promise<{ success: boolean; error?: string }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError || !supabase) {
    return { success: false, error: authError || 'Admin authorization required' };
  }

  const { data: post } = await supabase
    .from('posts')
    .select('slug, cover_image_url, content_gu, content_en')
    .eq('id', id)
    .single();

  // Collect storage object keys for cleanup before deleting the post
  const pathSet = new Set<string>();

  const { data: linkedMedia } = await supabase
    .from('media')
    .select('id, storage_path, file_path')
    .eq('post_id', id);

  for (const row of linkedMedia || []) {
    const key = row.storage_path || toStoragePath(row.file_path);
    if (key) pathSet.add(key);
  }

  if (post?.cover_image_url) {
    const coverKey = toStoragePath(post.cover_image_url);
    if (coverKey) pathSet.add(coverKey);

    const { data: coverMedia } = await supabase
      .from('media')
      .select('id, storage_path, file_path')
      .eq('file_path', post.cover_image_url);
    for (const row of coverMedia || []) {
      const key = row.storage_path || toStoragePath(row.file_path);
      if (key) pathSet.add(key);
    }
  }

  for (const src of [
    ...extractImageSrcs(post?.content_gu),
    ...extractImageSrcs(post?.content_en),
  ]) {
    const key = toStoragePath(src);
    if (key) pathSet.add(key);
  }

  const paths = Array.from(pathSet);
  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .remove(paths);
    if (storageError) {
      console.warn('Storage cleanup warning on deletePost:', storageError.message);
    }

    // Remove media rows linked by post_id or matching collected public URLs
    await supabase.from('media').delete().eq('post_id', id);
    if (post?.cover_image_url) {
      await supabase.from('media').delete().eq('file_path', post.cover_image_url);
    }
  }

  const { error: deleteError } = await supabase.from('posts').delete().eq('id', id);
  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  revalidatePath('/');
  revalidatePath('/gu');
  revalidatePath('/en');
  revalidatePath('/gu/blog');
  revalidatePath('/en/blog');
  if (post?.slug) {
    revalidatePath(`/gu/blog/${post.slug}`);
    revalidatePath(`/en/blog/${post.slug}`);
  }
  revalidatePath('/admin');
  revalidatePath('/admin/posts');

  return { success: true };
}

export async function togglePostStatus(
  id: string,
  newStatus: 'draft' | 'published'
): Promise<{ success: boolean; error?: string }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError || !supabase) {
    return { success: false, error: authError || 'Admin authorization required' };
  }

  const publishedAt = newStatus === 'published' ? new Date().toISOString() : null;

  const { data: post, error: updateError } = await supabase
    .from('posts')
    .update({
      status: newStatus,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('slug')
    .single();

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath('/');
  revalidatePath('/gu');
  revalidatePath('/en');
  revalidatePath('/gu/blog');
  revalidatePath('/en/blog');
  if (post?.slug) {
    revalidatePath(`/gu/blog/${post.slug}`);
    revalidatePath(`/en/blog/${post.slug}`);
  }
  revalidatePath('/admin');
  revalidatePath('/admin/posts');

  return { success: true };
}
