'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Filter,
} from 'lucide-react';
import { Post } from '@/types';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { deletePost, togglePostStatus } from '@/app/actions/posts';

interface PostsListClientProps {
  posts: Post[];
}

export default function PostsListClient({ posts: initialPosts }: PostsListClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter posts
  const filteredPosts = initialPosts.filter((post) => {
    const matchesSearch =
      post.title_gu.toLowerCase().includes(search.toLowerCase()) ||
      (post.title_en && post.title_en.toLowerCase().includes(search.toLowerCase())) ||
      post.slug.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : post.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deletePost(deleteTarget.id);
      if (res.success) {
        setDeleteTarget(null);
        router.refresh();
      } else {
        alert(res.error || 'Failed to delete post');
      }
    } catch {
      alert('Error deleting post');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = (post: Post) => {
    const nextStatus = post.status === 'published' ? 'draft' : 'published';
    startTransition(async () => {
      const res = await togglePostStatus(post.id, nextStatus);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || 'Failed to update status');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & New Post Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gold-primary/30">
        <div>
          <h1 className="font-serif font-bold text-2xl text-maroon-primary">
            બ્લોગ લેખો (Blog Posts)
          </h1>
          <p className="text-xs text-maroon-primary/60 mt-0.5">
            કુલ {initialPosts.length} લેખો ઉપલબ્ધ છે
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-maroon-primary hover:bg-maroon-dark text-cream-base font-semibold text-xs transition-colors border border-gold-primary/40 shadow-sm"
        >
          <Plus className="w-4 h-4 text-gold-light" />
          નવો લેખ લખો (New Post)
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-cream-surface/70 p-3 rounded-2xl border border-gold-primary/30">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-maroon-primary/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="શીર્ષક અથવા સ્લગ દ્વારા શોધો (Search posts)..."
            className="w-full text-xs pl-10 pr-4 py-2 rounded-xl bg-cream-base border border-gold-primary/30 text-maroon-primary placeholder:text-maroon-primary/40 focus:outline-none focus:ring-1 focus:ring-gold-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-maroon-primary/50 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
            className="text-xs px-3 py-2 rounded-xl bg-cream-base border border-gold-primary/30 text-maroon-primary focus:outline-none focus:ring-1 focus:ring-gold-primary w-full sm:w-auto"
          >
            <option value="all">બધી સ્થિતિ (All Status)</option>
            <option value="published">પ્રકાશિત (Published)</option>
            <option value="draft">ડ્રાફ્ટ (Draft)</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-cream-surface/70 rounded-2xl border border-gold-primary/30 overflow-hidden shadow-xs">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-maroon-primary/60 text-xs">
            કોઈ લેખ મળ્યો નથી.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gold-primary/20 bg-cream-surface text-[11px] font-serif uppercase tracking-wider text-maroon-primary/70">
                  <th className="py-3 px-4">શીર્ષક (Title)</th>
                  <th className="py-3 px-4">સ્થિતિ (Status)</th>
                  <th className="py-3 px-4">તારીખ (Date)</th>
                  <th className="py-3 px-4 text-right">ક્રિયાઓ (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-primary/15 text-xs">
                {filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-cream-base/60 transition-colors"
                  >
                    {/* Title & Slug */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-serif font-bold text-maroon-primary text-sm line-clamp-1">
                        {post.title_gu}
                      </div>
                      {post.title_en && (
                        <div className="text-[11px] text-maroon-primary/60 line-clamp-1 font-sans">
                          {post.title_en}
                        </div>
                      )}
                      <div className="text-[10px] text-gold-primary/80 font-mono mt-0.5">
                        /{post.slug}
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(post)}
                        disabled={isPending}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                          post.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
                        }`}
                        title="Click to toggle status"
                      >
                        {post.status === 'published' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> પ્રકાશિત
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" /> ડ્રાફ્ટ
                          </>
                        )}
                      </button>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-maroon-primary/70 text-[11px]">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString('gu-IN')
                        : new Date(post.created_at).toLocaleDateString('gu-IN')}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        {post.status === 'published' && (
                          <Link
                            href={`/gu/blog/${post.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-maroon-primary/70 hover:text-maroon-primary hover:bg-cream-surface border border-gold-primary/20 transition-colors"
                            title="View Public Post"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}

                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="p-1.5 rounded-lg text-maroon-primary/70 hover:text-maroon-primary hover:bg-cream-surface border border-gold-primary/20 transition-colors"
                          title="Edit Post"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(post)}
                          className="p-1.5 rounded-lg text-red-600/70 hover:text-red-700 hover:bg-red-50 border border-red-200 transition-colors"
                          title="Delete Post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="લેખ કાઢી નાખો (Delete Post)"
        itemName={deleteTarget?.title_gu}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
