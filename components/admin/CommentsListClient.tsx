'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MessageSquare,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  User,
} from 'lucide-react';
import { Comment } from '@/types';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { updateCommentStatus, deleteComment } from '@/app/actions/comments';

interface CommentsListClientProps {
  comments: Comment[];
}

export default function CommentsListClient({
  comments: initialComments,
}: CommentsListClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = initialComments.filter((c) => {
    const haystack = [
      c.content,
      c.user?.full_name,
      c.user?.email,
      c.post?.title_gu,
      c.post?.title_en,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matchesSearch = !search || haystack.includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  const pendingCount = initialComments.filter((c) => c.status === 'pending').length;

  const handleStatus = (id: string, status: 'approved' | 'rejected' | 'pending') => {
    startTransition(async () => {
      const res = await updateCommentStatus(id, status);
      if (!res.success) {
        alert(res.error || 'Failed to update comment');
        return;
      }
      router.refresh();
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteComment(deleteTarget.id);
      if (res.success) {
        setDeleteTarget(null);
        router.refresh();
      } else {
        alert(res.error || 'Failed to delete');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gold-primary/30">
        <div>
          <h1 className="font-serif font-bold text-2xl text-maroon-primary">
            ટિપ્પણીઓ (Comments)
          </h1>
          <p className="text-xs text-maroon-primary/60 mt-0.5">
            મંજૂરી બાકી: {pendingCount} · કુલ {initialComments.length}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-maroon-primary/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search comments, authors, posts..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gold-primary/30 bg-cream-base text-xs text-maroon-primary focus:outline-none focus:ring-1 focus:ring-gold-primary"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize cursor-pointer ${
                filter === f
                  ? 'bg-maroon-primary text-cream-base'
                  : 'bg-cream-surface text-maroon-primary border border-gold-primary/30'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-gold-primary/20 bg-cream-surface/40">
          <MessageSquare className="w-8 h-8 text-gold-primary mx-auto mb-2" />
          <p className="text-sm text-maroon-primary/70">No comments match this filter.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((comment) => {
            const postTitle =
              comment.post?.title_gu || comment.post?.title_en || 'Untitled post';
            const author =
              comment.user?.full_name || comment.user?.email || 'Unknown user';

            return (
              <li
                key={comment.id}
                className="rounded-2xl border border-gold-primary/30 bg-cream-surface/60 p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-maroon-primary/70">
                  <span className="inline-flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {author}
                  </span>
                  <span>·</span>
                  {comment.post?.slug ? (
                    <Link
                      href={`/gu/blog/${comment.post.slug}`}
                      target="_blank"
                      className="hover:text-gold-primary underline-offset-2 hover:underline"
                    >
                      {postTitle}
                    </Link>
                  ) : (
                    <span>{postTitle}</span>
                  )}
                  <span
                    className={`ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                      comment.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : comment.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {comment.status === 'approved' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : comment.status === 'rejected' ? (
                      <XCircle className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {comment.status}
                  </span>
                </div>

                <p className="text-sm text-maroon-primary whitespace-pre-wrap leading-relaxed">
                  {comment.content}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {comment.status !== 'approved' && (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleStatus(comment.id, 'approved')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-700 text-white hover:bg-green-800 disabled:opacity-50 cursor-pointer"
                    >
                      Approve
                    </button>
                  )}
                  {comment.status !== 'rejected' && (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleStatus(comment.id, 'rejected')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-50 cursor-pointer"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(comment)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-700 border border-red-200 hover:bg-red-50 cursor-pointer inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <DeleteConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete comment?"
        itemName={deleteTarget?.content?.slice(0, 80)}
        message="This permanently removes the comment."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
