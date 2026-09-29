import React from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import PostsListClient from '@/components/admin/PostsListClient';
import { Post } from '@/types';
import { DEFAULT_POSTS } from '@/lib/data/defaults';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Blog Posts Management | Admin',
};

export default async function AdminPostsPage() {
  const supabase = await createServerSupabaseClient();
  let posts: Post[] = [];

  if (supabase) {
    const { data, error } = await supabase
      .from('posts')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      posts = data as Post[];
    }
  }

  // Fallback to defaults if empty and no DB connected
  if (posts.length === 0 && !supabase) {
    posts = DEFAULT_POSTS;
  }

  return <PostsListClient posts={posts} />;
}
