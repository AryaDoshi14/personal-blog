'use client';

import React, { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Send, LogIn, UserPlus, X, MessageSquare } from 'lucide-react';
import { createComment } from '@/app/actions/comments';
import { createClient } from '@/lib/supabase/client';
import { Language } from '@/types';

interface CommentFormProps {
  postId: string;
  lang: Language;
  isLoggedIn?: boolean;
}

export function CommentForm({ postId, lang, isLoggedIn: initialIsLoggedIn = false }: CommentFormProps) {
  const isGu = lang === 'gu';
  const router = useRouter();
  const [content, setContent] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    let isMounted = true;
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase!.auth.getUser();
        if (isMounted) setIsLoggedIn(Boolean(user));
      } catch {
        if (isMounted) setIsLoggedIn(false);
      }
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) setIsLoggedIn(Boolean(session?.user));
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

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

  if (!isLoggedIn) {
    return (
      <>
        {/* Teaser textarea that opens sign-in modal on click */}
        <div
          className="rounded-2xl border border-[#E8DFD3] bg-[#F4EDE2]/50 p-4 cursor-pointer hover:border-[#C59B4B] transition-colors group"
          onClick={() => setShowSignInModal(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setShowSignInModal(true)}
          aria-label={isGu ? 'ટિપ્પણી કરવા માટે સાઇન ઇન કરો' : 'Sign in to comment'}
        >
          <div className="w-full px-4 py-3 rounded-xl border border-[#E8DFD3] bg-white text-sm text-[#B0A090] font-serif-gu select-none">
            {isGu ? 'ટિપ્પણી લખો...' : 'Write a comment...'}
          </div>
          <div className="flex items-center justify-end mt-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#8C6D2D] font-serif-gu group-hover:text-[#C59B4B] transition-colors">
              <LogIn className="w-3.5 h-3.5" />
              {isGu ? 'ટિપ્પણી કરવા સાઇન ઇન કરો' : 'Sign in to comment'}
            </span>
          </div>
        </div>

        {/* Sign-in Modal */}
        {showSignInModal && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowSignInModal(false); }}
          >
            <div
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
              style={{ border: '2px solid #C59B4B' }}
            >
              {/* Gold accent bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#C59B4B] via-[#E8C97A] to-[#C59B4B]" />

              {/* Close */}
              <button
                onClick={() => setShowSignInModal(false)}
                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-[#F4EDE2] text-[#614D43] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Body */}
              <div className="px-6 pb-6 pt-5 text-center">
                <div className="w-12 h-12 rounded-full bg-[#F4EDE2] flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-[#C59B4B]" />
                </div>
                <h2 className="text-lg font-bold text-[#501518] font-serif-gu mb-1">
                  {isGu ? 'ટિપ્પણી કરો' : 'Join the conversation'}
                </h2>
                <p className="text-sm text-[#614D43] font-serif-gu mb-6">
                  {isGu
                    ? 'ટિપ્પણી કરવા માટે કૃપા કરીને સાઇન ઇન કરો.'
                    : 'Sign in to leave a comment and join our devotee community.'}
                </p>

                <div className="flex flex-col gap-3">
                  {/* Login button */}
                  <Link
                    href={`/${lang}/auth/login`}
                    onClick={() => setShowSignInModal(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl bg-[#501518] text-white font-semibold text-sm font-serif-gu hover:bg-[#6B1D23] transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    {isGu ? 'લૉગિન' : 'Log In'}
                  </Link>

                  {/* Sign up button */}
                  <Link
                    href={`/${lang}/auth/signup`}
                    onClick={() => setShowSignInModal(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl border-2 border-[#C59B4B] text-[#501518] font-semibold text-sm font-serif-gu hover:bg-[#F4EDE2] transition-colors"
                  >
                    <UserPlus className="w-4 h-4 text-[#C59B4B]" />
                    {isGu ? 'નવું ખાતું બનાવો' : 'Create Account'}
                  </Link>

                  <button
                    onClick={() => setShowSignInModal(false)}
                    className="text-xs text-[#8C6D2D] font-serif-gu hover:text-[#614D43] transition-colors mt-1 cursor-pointer"
                  >
                    {isGu ? 'રદ કરો' : 'Maybe later'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

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
