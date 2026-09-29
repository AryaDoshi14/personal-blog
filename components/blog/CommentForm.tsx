'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Send } from 'lucide-react';
import { createComment } from '@/app/actions/comments';
import { Language } from '@/types';

interface CommentFormProps {
  postId: string;
  lang: Language;
  isLoggedIn: boolean;
}

export function CommentForm({ postId, lang, isLoggedIn }: CommentFormProps) {
  const isGu = lang === 'gu';
  const router = useRouter();
  const [content, setContent] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <div className="rounded-2xl border border-[#E8DFD3] bg-[#F4EDE2]/50 p-5 text-center">
        <p className="text-sm text-[#501518] font-serif-gu mb-3">
          {isGu
            ? 'ટિપ્પણી કરવા માટે કૃપા કરીને લૉગિન કરો.'
            : 'Please log in to leave a comment.'}
        </p>
        <Link
          href={`/${lang}/auth/login`}
          className="inline-flex px-4 py-2 rounded-xl bg-[#501518] text-white text-sm font-serif-gu hover:bg-[#6B1D23] transition-colors"
        >
          {isGu ? 'લૉગિન' : 'Log in'}
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await createComment(postId, content, honeypot);
      if (!result.success) {
        setError(result.error || (isGu ? 'ટિપ્પણી મોકલવામાં નિષ્ફળ' : 'Failed to post comment'));
        return;
      }
      setContent('');
      if (result.status === 'approved') {
        setSuccess(isGu ? 'ટિપ્પણી પ્રકાશિત થઈ.' : 'Comment published.');
      } else {
        setSuccess(
          isGu
            ? 'ટિપ્પણી મોકલાઈ. મંજૂરી પછી દેખાશે.'
            : 'Comment submitted. It will appear after approval.'
        );
      }
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Honeypot — hidden from users */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      <label className="block text-sm font-semibold text-[#501518] font-serif-gu">
        {isGu ? 'તમારી ટિપ્પણી' : 'Your comment'}
      </label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        maxLength={1000}
        required
        placeholder={isGu ? 'અહીં લખો...' : 'Write your thoughts...'}
        className="w-full px-4 py-3 rounded-xl border border-[#E8DFD3] bg-[#FAF6F0] text-sm text-[#2C1A14] font-serif-gu focus:outline-none focus:ring-2 focus:ring-[#C59B4B]"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-[#614D43]">{content.length}/1000</span>
        <button
          type="submit"
          disabled={isPending || content.trim().length < 3}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#501518] text-white text-sm font-serif-gu hover:bg-[#6B1D23] disabled:opacity-50 cursor-pointer"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {isGu ? 'મોકલો' : 'Post'}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {success && <p className="text-xs text-green-700">{success}</p>}
    </form>
  );
}
