'use client';

import React, { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updatePassword } from '@/app/actions/public-auth';
import { Language } from '@/types';
import { CheckCircle } from 'lucide-react';

interface ResetPasswordFormProps {
  lang: Language;
}

export function ResetPasswordForm({ lang }: ResetPasswordFormProps) {
  const isGu = lang === 'gu';
  const router = useRouter();
  const [state, action, isPending] = useActionState(updatePassword, null);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push(`/${lang}/auth/login`);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [state, lang, router]);

  if (state?.success) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <h2 className="text-base font-bold text-[#501518] font-serif-gu mb-2">
          {isGu ? 'પાસવર્ડ અપડેટ થઈ ગયો!' : 'Password Updated!'}
        </h2>
        <p className="text-sm text-[#614D43] font-serif-gu">
          {isGu ? 'હવે નવા પાસવર્ડ સાથે લૉગ ઇન કરો...' : 'Redirecting you to login...'}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 font-serif-gu">
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="reset-password"
          className="block text-sm font-semibold text-[#501518] font-serif-gu mb-1.5"
        >
          {isGu ? 'નવો પાસવર્ડ' : 'New Password'}
          <span className="text-red-500 ml-0.5">*</span>
        </label>
        <input
          id="reset-password"
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder={isGu ? 'ઓછામાં ઓછો 8 અક્ષર' : 'At least 8 characters'}
          className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD3] bg-[#FAF6F0] text-[#2C1A14] font-serif-gu text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B4B] focus:border-transparent transition"
        />
      </div>

      <div>
        <label
          htmlFor="reset-confirm-password"
          className="block text-sm font-semibold text-[#501518] font-serif-gu mb-1.5"
        >
          {isGu ? 'પાસવર્ડ ફરી દાખલ કરો' : 'Confirm Password'}
          <span className="text-red-500 ml-0.5">*</span>
        </label>
        <input
          id="reset-confirm-password"
          type="password"
          name="confirm_password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder={isGu ? 'ફરી દાખલ કરો' : 'Repeat your password'}
          className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD3] bg-[#FAF6F0] text-[#2C1A14] font-serif-gu text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B4B] focus:border-transparent transition"
        />
      </div>

      <button
        id="reset-password-submit-btn"
        type="submit"
        disabled={isPending}
        className="w-full mt-2 py-3 px-6 rounded-xl bg-[#501518] text-white font-serif-gu font-semibold text-base hover:bg-[#6B1D23] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
      >
        {isPending
          ? isGu ? 'અપડેટ થઈ રહ્યો છે...' : 'Updating...'
          : isGu ? 'પાસવર્ড સેટ કરો' : 'Set Password'}
      </button>
    </form>
  );
}
