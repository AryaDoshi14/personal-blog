import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Language } from '@/types';
import { SignUpForm } from '@/components/auth/SignUpForm';

interface SignUpPageProps {
  params: Promise<{ lang: string }>;
}

export default async function SignUpPage({ params }: SignUpPageProps) {
  const { lang } = await params;
  if (lang !== 'gu' && lang !== 'en') notFound();
  const validLang = lang as Language;
  const isGu = validLang === 'gu';

  // If already logged in, redirect home
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect(`/${lang}`);
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🙏</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#501518] font-serif-gu tracking-tight">
            {isGu ? 'ખાતું બનાવો' : 'Create Account'}
          </h1>
          <p className="text-sm text-[#614D43] font-serif-gu mt-2">
            {isGu
              ? 'ભક્ત સમુદાયમાં જોડાઓ — ટિપ્પણી કરો, લાઇક કરો'
              : 'Join our devotional community — comment and like posts'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E8DFD3] rounded-2xl shadow-sm p-6 sm:p-8">
          <SignUpForm lang={validLang} />

          <p className="text-center text-sm font-serif-gu text-[#614D43] mt-6">
            {isGu ? 'પહેલેથી ખાતું છે?' : 'Already have an account?'}{' '}
            <Link
              href={`/${lang}/auth/login`}
              className="font-semibold text-[#501518] hover:text-[#C59B4B] transition-colors"
            >
              {isGu ? 'અહીં લૉગ ઇન કરો' : 'Sign in here'}
            </Link>
          </p>
        </div>

        {/* Note about email confirmation */}
        <p className="text-center text-xs font-serif-gu text-[#8C6D2D] mt-4 leading-relaxed">
          {isGu
            ? 'નોંધ: ખાતું ખોલ્યા પછી, ઇ-મેઇલ ચકાસણી ફરજિયાત છે.'
            : 'Note: Email verification is required before you can sign in.'}
        </p>
      </div>
    </div>
  );
}
