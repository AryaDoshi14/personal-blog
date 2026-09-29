'use client';

import React, { useOptimistic, useState, useTransition } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { togglePostLike } from '@/app/actions/likes';
import { Language } from '@/types';

interface LikeButtonProps {
  postId: string;
  initialCount: number;
  initialLiked: boolean;
  isLoggedIn: boolean;
  lang: Language;
}

export function LikeButton({
  postId,
  initialCount,
  initialLiked,
  isLoggedIn,
  lang,
}: LikeButtonProps) {
  const isGu = lang === 'gu';
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const [optimistic, setOptimistic] = useOptimistic(
    { liked, count },
    (_current, next: { liked: boolean; count: number }) => next
  );

  const handleClick = () => {
    if (!isLoggedIn) return;
    setError(null);

    const nextLiked = !optimistic.liked;
    const nextCount = Math.max(0, optimistic.count + (nextLiked ? 1 : -1));

    startTransition(async () => {
      setOptimistic({ liked: nextLiked, count: nextCount });
      const result = await togglePostLike(postId);
      if (!result.success) {
        setError(result.error || (isGu ? 'લાઇક નિષ્ફળ' : 'Could not update like'));
        return;
      }
      setLiked(Boolean(result.liked));
      setCount(result.likes_count ?? nextCount);
    });
  };

  if (!isLoggedIn) {
    return (
      <Link
        href={`/${lang}/auth/login`}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E8DFD3] bg-[#FAF6F0] text-[#501518] text-sm font-serif-gu hover:border-[#C59B4B] transition-colors"
      >
        <Heart className="w-4 h-4 text-[#C59B4B]" />
        <span>
          {initialCount} {isGu ? 'લાઇક' : 'likes'}
        </span>
        <span className="text-xs text-[#614D43]">
          · {isGu ? 'લાઇક કરવા લૉગિન કરો' : 'Log in to like'}
        </span>
      </Link>
    );
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={optimistic.liked}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-serif-gu transition-colors disabled:opacity-60 cursor-pointer ${
          optimistic.liked
            ? 'bg-[#501518] text-white border-[#501518]'
            : 'bg-[#FAF6F0] text-[#501518] border-[#E8DFD3] hover:border-[#C59B4B]'
        }`}
      >
        <Heart
          className={`w-4 h-4 ${optimistic.liked ? 'fill-current text-[#C59B4B]' : 'text-[#C59B4B]'}`}
        />
        <span>
          {optimistic.count}{' '}
          {isGu ? 'લાઇક' : optimistic.count === 1 ? 'like' : 'likes'}
        </span>
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
