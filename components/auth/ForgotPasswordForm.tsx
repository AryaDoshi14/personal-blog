'use client';

import React, { useActionState } from 'react';
import { requestPasswordReset } from '@/app/actions/public-auth';
import { Language } from '@/types';
import { Mail, CheckCircle } from 'lucide-react';

interface ForgotPasswordFormProps {
  lang: Language;
}

export function ForgotPasswordForm({ lang }: ForgotPasswordFormProps) {
  const isGu = lang === 'gu';
  const [state, action, isPending] = useActionState(requestPasswordReset, null);

  if (state?.success) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <h2 className="text-base font-bold text-[#501518] font-serif-gu mb-2">
          {isGu ? 'ઇ-મેઇલ મોકલવામાં આવ્યો!' : 'Email Sent!'}
        </h2>
        <p className="text-sm text-[#614D43] font-serif-gu leading-relaxed">
          {isGu
            ? 'જો આ ઇ-મેઇલ અમારી સિસ્ટમમાં નોંધાયેલ છે, તો અમે રીસેટ કડી મોકલી છે. ઇ-મેઇલ ઇનબોક્સ (અને સ્પામ ફોલ્ડર) તપાસો.'
            : 'If this email is registered with us, we\'ve sent a password reset link. Please check your inbox (and spam folder).'}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="lang" value={lang} />

      {state?.error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 font-serif-gu">
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="forgot-email"
          className="block text-sm font-semibold text-[#501518] font-serif-gu mb-1.5"
        >
          {isGu ? 'ઇ-મેઇલ સરનામું' : 'Email Address'}
          <span className="text-red-500 ml-0.5">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C59B4B]" />
          <input
            id="forgot-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DFD3] bg-[#FAF6F0] text-[#2C1A14] font-serif-gu text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B4B] focus:border-transparent transition"
          />
        </div>
      </div>

      <button
        id="forgot-password-submit-btn"
        type="submit"
        disabled={isPending}
        className="w-full mt-2 py-3 px-6 rounded-xl bg-[#501518] text-white font-serif-gu font-semibold text-base hover:bg-[#6B1D23] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
      >
        {isPending
          ? isGu ? 'મોકલી રહ્યા છીએ...' : 'Sending...'
          : isGu ? 'રીસેટ કડી મોકલો' : 'Send Reset Link'}
      </button>
    </form>
  );
}
