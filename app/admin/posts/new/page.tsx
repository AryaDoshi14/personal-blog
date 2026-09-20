import React from 'react';
import { getCategories } from '@/lib/db';
import PostForm from '@/components/admin/PostForm';

export const metadata = {
  title: 'New Post | Admin',
};

export default async function NewPostPage() {
  const categories = await getCategories();

  return <PostForm categories={categories} />;
}
