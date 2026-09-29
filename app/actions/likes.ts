'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export type LikeActionResult = {
  success: boolean;
  liked?: boolean;
  likes_count?: number;
  error?: string;
  requiresAuth?: boolean;
};

async function getPostSlug(supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>>, postId: string) {
  const { data } = await supabase.from('posts').select('slug, likes_count').eq('id', postId).maybeSingle();
  return data;
}

export async function togglePostLike(postId: string): Promise<LikeActionResult> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Service unavailable' };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, requiresAuth: true, error: 'Please log in to like this article.' };
  }

  const post = await getPostSlug(supabase, postId);
  if (!post) {
    return { success: false, error: 'Post not found' };
  }

  const { data: existing } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    const updated = await getPostSlug(supabase, postId);
    if (post.slug) {
      revalidatePath(`/gu/blog/${post.slug}`);
      revalidatePath(`/en/blog/${post.slug}`);
    }
    revalidatePath('/gu/blog');
    revalidatePath('/en/blog');

    return {
      success: true,
      liked: false,
      likes_count: updated?.likes_count ?? Math.max(0, (post.likes_count || 0) - 1),
    };
  }

  const { error } = await supabase.from('post_likes').insert({
    post_id: postId,
    user_id: user.id,
  });

  if (error) {
    // Unique violation — treat as already liked
    if (error.code === '23505') {
      return { success: true, liked: true, likes_count: post.likes_count };
    }
    return { success: false, error: error.message };
  }

  const updated = await getPostSlug(supabase, postId);
  if (post.slug) {
    revalidatePath(`/gu/blog/${post.slug}`);
    revalidatePath(`/en/blog/${post.slug}`);
  }
  revalidatePath('/gu/blog');
  revalidatePath('/en/blog');

  return {
    success: true,
    liked: true,
    likes_count: updated?.likes_count ?? (post.likes_count || 0) + 1,
  };
}

export async function getUserLikedPost(postId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return false;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle();

  return Boolean(data);
}
