import React from 'react';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getCategories } from '@/lib/db';
import { DEFAULT_POSTS } from '@/lib/data/defaults';
import PostForm from '@/components/admin/PostForm';
import { Post } from '@/types';

export const metadata = {
  title: 'Edit Post | Admin',
};

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const categories = await getCategories();

  let post: Post | null = null;

  if (supabase) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!error && data) {
      post = data as Post;
    }
  }

  // Fallback for defaults if testing without active DB
  if (!post) {
    post = DEFAULT_POSTS.find((p) => p.id === id) || null;
  }

  if (!post) {
    notFound();
  }

  return <PostForm initialData={post} categories={categories} />;
}
