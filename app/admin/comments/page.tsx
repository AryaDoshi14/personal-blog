import React from 'react';
import { getAllCommentsForAdmin } from '@/lib/db';
import CommentsListClient from '@/components/admin/CommentsListClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Comments | Admin',
};

export default async function AdminCommentsPage() {
  const comments = await getAllCommentsForAdmin();
  return <CommentsListClient comments={comments} />;
}
