'use client';

import React, { useActionState } from 'react';
import { publicSignUp } from '@/app/actions/public-auth';
import { Language } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface SignUpFormProps {
  lang: Language;
}

export function SignUpForm({ lang }: SignUpFormProps) {
  const isGu = lang === 'gu';
  const router = useRouter();
  const [state, action, isPending] = useActionState(publicSignUp, null);

  useEffect(() => {
    if (state?.success) {
      // Redirect to login with a "check email" message
      router.push(`/${lang}/auth/login?message=check-email`);
    }
  }, [state, lang, router]);

  return (
    <form action={action} className="space-y-4">
      {/* Honeypot anti-bot field — hidden from real users */}
      <input
        type="text"
        name="website"
        aria-hidden="true"
        tabIndex={-1}
        className="absolute opacity-0 pointer-events-none h-0 w-0"
        autoComplete="off"
      />

      {/* Error Banner */}
      {state?.error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 font-serif-gu">
          {state.error}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label
          htmlFor="signup-full-name"
          className="block text-sm font-semibold text-[#501518] font-serif-gu mb-1.5"
        >
          {isGu ? 'પૂરું નામ' : 'Full Name'}
        </label>
        <input
          id="signup-full-name"
          type="text"
          name="full_name"
          autoComplete="name"
          placeholder={isGu ? 'તમારું નામ લખો' : 'Your full name'}
          className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD3] bg-[#FAF6F0] text-[#2C1A14] font-serif-gu text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B4B] focus:border-transparent transition"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="signup-email"
          className="block text-sm font-semibold text-[#501518] font-serif-gu mb-1.5"
        >
          {isGu ? 'ઇ-મેઇલ સરનામું' : 'Email Address'}
          <span className="text-red-500 ml-0.5">*</span>
        </label>
        <input
          id="signup-email"
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
          htmlFor="signup-password"
          className="block text-sm font-semibold text-[#501518] font-serif-gu mb-1.5"
        >
          {isGu ? 'પાસવર્ડ' : 'Password'}
          <span className="text-red-500 ml-0.5">*</span>
        </label>
        <input
          id="signup-password"
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder={isGu ? 'ઓછામાં ઓછો 8 અક્ષર' : 'At least 8 characters'}
          className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD3] bg-[#FAF6F0] text-[#2C1A14] font-serif-gu text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B4B] focus:border-transparent transition"
        />
        <p className="text-xs text-[#8C6D2D] font-serif-gu mt-1">
          {isGu ? 'ઓછામાં ઓછો 8 અક્ષર' : 'Minimum 8 characters'}
        </p>
      </div>

      {/* Submit */}
      <button
        id="signup-submit-btn"
        type="submit"
        disabled={isPending}
        className="w-full mt-2 py-3 px-6 rounded-xl bg-[#501518] text-white font-serif-gu font-semibold text-base hover:bg-[#6B1D23] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
      >
        {isPending
          ? isGu
            ? 'ખાતું બનાવાઇ રહ્યું છે...'
            : 'Creating account...'
          : isGu
          ? 'ખાતું બનાવો'
          : 'Create Account'}
      </button>
    </form>
  );
}
