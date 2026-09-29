'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/supabase/admin-guard';

export type CommentActionResult = {
  success: boolean;
  error?: string;
  requiresAuth?: boolean;
  status?: 'pending' | 'approved';
};

import { checkRateLimit } from '@/lib/supabase/rate-limit';

export async function createComment(
  postId: string,
  content: string,
  honeypot?: string
): Promise<CommentActionResult> {
  if (honeypot) {
    return { success: true, status: 'pending' };
  }

  const trimmed = content.trim();
  if (trimmed.length < 3) {
    return { success: false, error: 'Comment must be at least 3 characters.' };
  }
  if (trimmed.length > 1000) {
    return { success: false, error: 'Comment must be at most 1000 characters.' };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Service unavailable' };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      requiresAuth: true,
      error: 'Please log in to comment.',
    };
  }

  const limited = await checkRateLimit(`comment:${user.id}`, 10, 3600);
  if (!limited) {
    return { success: false, error: 'Too many comments. Please try again later.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const status = profile?.role === 'admin' ? 'approved' : 'pending';

  const { data: post } = await supabase
    .from('posts')
    .select('id, slug, status')
    .eq('id', postId)
    .eq('status', 'published')
    .maybeSingle();

  if (!post) {
    return { success: false, error: 'Post not found' };
  }

  const { error } = await supabase.from('comments').insert({
    post_id: postId,
    user_id: user.id,
    content: trimmed,
    status,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/gu/blog/${post.slug}`);
  revalidatePath(`/en/blog/${post.slug}`);
  revalidatePath('/admin/comments');

  return { success: true, status };
}

export async function updateCommentStatus(
  commentId: string,
  status: 'approved' | 'rejected' | 'pending'
): Promise<CommentActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError || !supabase) {
    return { success: false, error: authError || 'Admin authorization required' };
  }

  const { data: comment, error: fetchError } = await supabase
    .from('comments')
    .select('id, post:posts(slug)')
    .eq('id', commentId)
    .maybeSingle();

  if (fetchError || !comment) {
    return { success: false, error: fetchError?.message || 'Comment not found' };
  }

  const { error } = await supabase
    .from('comments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', commentId);

  if (error) {
    return { success: false, error: error.message };
  }

  const slug = (comment.post as { slug?: string } | null)?.slug;
  if (slug) {
    revalidatePath(`/gu/blog/${slug}`);
    revalidatePath(`/en/blog/${slug}`);
  }
  revalidatePath('/admin/comments');

  return { success: true, status: status === 'rejected' ? undefined : status === 'approved' ? 'approved' : 'pending' };
}

export async function deleteComment(commentId: string): Promise<CommentActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError || !supabase) {
    return { success: false, error: authError || 'Admin authorization required' };
  }

  const { data: comment } = await supabase
    .from('comments')
    .select('id, post:posts(slug)')
    .eq('id', commentId)
    .maybeSingle();

  const { error } = await supabase.from('comments').delete().eq('id', commentId);
  if (error) {
    return { success: false, error: error.message };
  }

  const slug = (comment?.post as { slug?: string } | null)?.slug;
  if (slug) {
    revalidatePath(`/gu/blog/${slug}`);
    revalidatePath(`/en/blog/${slug}`);
  }
  revalidatePath('/admin/comments');

  return { success: true };
}
