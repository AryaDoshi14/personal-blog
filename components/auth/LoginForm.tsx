'use client';

import React, { useActionState } from 'react';
import { publicSignIn } from '@/app/actions/public-auth';
import { Language } from '@/types';

interface LoginFormProps {
  lang: Language;
}

export function LoginForm({ lang }: LoginFormProps) {
  const isGu = lang === 'gu';
  const [state, action, isPending] = useActionState(publicSignIn, null);

  return (
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
        <label
          htmlFor="login-password"
          className="block text-sm font-semibold text-[#501518] font-serif-gu mb-1.5"
        >
          {isGu ? 'પાસવર્ડ' : 'Password'}
          <span className="text-red-500 ml-0.5">*</span>
        </label>
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
  );
}
