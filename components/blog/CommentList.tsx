import React from 'react';
import { Comment, Language } from '@/types';

interface CommentListProps {
  comments: Comment[];
  lang: Language;
}

export function CommentList({ comments, lang }: CommentListProps) {
  const isGu = lang === 'gu';

  if (comments.length === 0) {
    return (
      <p className="text-sm text-[#614D43] font-serif-gu py-4">
        {isGu
          ? 'હજુ કોઈ ટિપ્પણી નથી. પહેલા લખનાર બનો!'
          : 'No comments yet. Be the first to share your thoughts.'}
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {comments.map((comment) => {
        const displayName =
          comment.user?.full_name?.trim() ||
          (isGu ? 'ભક્ત' : 'Devotee');
        const date = new Date(comment.created_at).toLocaleDateString(
          isGu ? 'gu-IN' : 'en-US',
          { year: 'numeric', month: 'short', day: 'numeric' }
        );

        return (
          <li
            key={comment.id}
            className="rounded-xl border border-[#E8DFD3] bg-[#FAF6F0] p-4"
          >
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <span className="font-serif-gu font-semibold text-[#501518] text-sm">
                {displayName}
              </span>
              <time className="text-xs text-[#614D43] shrink-0">{date}</time>
            </div>
            <p className="text-sm text-[#2C1A14] font-serif-gu leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
