'use client';

import React, { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { publicSignIn } from '@/app/actions/public-auth';
import { Language } from '@/types';
import { LayoutDashboard, Globe, X } from 'lucide-react';

interface LoginFormProps {
  lang: Language;
}

export function LoginForm({ lang }: LoginFormProps) {
  const isGu = lang === 'gu';
  const router = useRouter();
  const [state, action, isPending] = useActionState(publicSignIn, null);
  const [showAdminPopup, setShowAdminPopup] = useState(false);

  // When server returns isAdmin: true, open the destination popup
  useEffect(() => {
    if ((state as { isAdmin?: boolean } | null)?.isAdmin) {
      setShowAdminPopup(true);
    }
  }, [state]);

  const handleGoAdmin = () => {
    setShowAdminPopup(false);
    router.push('/admin');
  };

  const handleGoNormal = () => {
    setShowAdminPopup(false);
    router.push(`/${lang}`);
  };

  return (
    <>
      <form action={action} className="space-y-4">
        {/* Honeypot anti-bot field */}
        <input
          type="text"
          name="website"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute opacity-0 pointer-events-none h-0 w-0"
          autoComplete="off"
        />
        {/* Hidden lang field so action can redirect correctly */}
        <input type="hidden" name="lang" value={lang} />

        {/* Error Banner */}
        {state?.error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 font-serif-gu">
            {state.error}
          </div>
        )}

        {/* Email */}
        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-semibold text-[#501518] font-serif-gu mb-1.5"
          >
            {isGu ? 'ઇ-મેઇલ સરનામું' : 'Email Address'}
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            id="login-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD3] bg-[#FAF6F0] text-[#2C1A14] font-serif-gu text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B4B] focus:border-transparent transition"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="login-password"
              className="block text-sm font-semibold text-[#501518] font-serif-gu"
            >
              {isGu ? 'પાસવર્ડ' : 'Password'}
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <Link
              href={`/${lang}/auth/forgot-password`}
              className="text-xs text-[#8C6D2D] hover:text-[#501518] hover:underline font-serif-gu transition-colors"
            >
              {isGu ? 'પાસવર્ડ ભૂલી ગયા?' : 'Forgot password?'}
            </Link>
          </div>
          <input
            id="login-password"
            type="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder={isGu ? 'તમારો પાસવર્ડ' : 'Your password'}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD3] bg-[#FAF6F0] text-[#2C1A14] font-serif-gu text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B4B] focus:border-transparent transition"
          />
        </div>

        {/* Submit */}
        <button
          id="login-submit-btn"
          type="submit"
          disabled={isPending}
          className="w-full mt-2 py-3 px-6 rounded-xl bg-[#501518] text-white font-serif-gu font-semibold text-base hover:bg-[#6B1D23] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
        >
          {isPending
            ? isGu
              ? 'પ્રવેશ થઇ રહ્યો છે...'
              : 'Signing in...'
            : isGu
            ? 'પ્રવેશ કરો'
            : 'Sign In'}
        </button>
      </form>

      {/* ── Admin Destination Popup ── */}
      {showAdminPopup && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) handleGoNormal(); }}
        >
          <div
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            style={{ border: '2px solid #C59B4B' }}
          >
            {/* Gold accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#C59B4B] via-[#E8C97A] to-[#C59B4B]" />

            {/* Close button */}
            <button
              onClick={handleGoNormal}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-[#F4EDE2] text-[#614D43] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Body */}
            <div className="px-6 pb-6 pt-5 text-center">
              <div className="text-4xl mb-2">🔐</div>
              <h2 className="text-lg font-bold text-[#501518] font-serif-gu mb-1">
                {isGu ? 'સ્વાગત છે, એડ્મિન!' : 'Welcome, Admin!'}
              </h2>
              <p className="text-sm text-[#614D43] font-serif-gu mb-6">
                {isGu ? 'તમે ક્યાં જવા માગો છો?' : 'Where would you like to go?'}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Admin Panel choice */}
                <button
                  id="goto-admin-btn"
                  onClick={handleGoAdmin}
                  className="flex-1 flex flex-col items-center gap-2 px-4 py-4 rounded-2xl border-2 border-[#501518] bg-[#501518] text-white hover:bg-[#6B1D23] hover:border-[#6B1D23] transition-all group cursor-pointer"
                >
                  <LayoutDashboard className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-sm font-serif-gu">
                    {isGu ? 'એડ્મિન પેનલ' : 'Admin Panel'}
                  </span>
                  <span className="text-xs opacity-75 font-serif-gu">
                    {isGu ? 'સામગ્રી સંચાલન' : 'Manage content'}
                  </span>
                </button>

                {/* Normal Page choice */}
                <button
                  id="goto-normal-btn"
                  onClick={handleGoNormal}
                  className="flex-1 flex flex-col items-center gap-2 px-4 py-4 rounded-2xl border-2 border-[#C59B4B] text-[#501518] hover:bg-[#F4EDE2] transition-all group cursor-pointer"
                >
                  <Globe className="w-6 h-6 group-hover:scale-110 transition-transform text-[#C59B4B]" />
                  <span className="font-semibold text-sm font-serif-gu">
                    {isGu ? 'સામાન્ય પૃષ્ઠ' : 'Normal Page'}
                  </span>
                  <span className="text-xs text-[#614D43] opacity-75 font-serif-gu">
                    {isGu ? 'ભક્ત તરીકે જુઓ' : 'Browse as devotee'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
