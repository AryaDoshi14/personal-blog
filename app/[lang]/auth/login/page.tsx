import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Language } from '@/types';
import { LoginForm } from '@/components/auth/LoginForm';

interface LoginPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ message?: string }>;
}

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { lang } = await params;
  const { message } = await searchParams;
  if (lang !== 'gu' && lang !== 'en') notFound();
  const validLang = lang as Language;
  const isGu = validLang === 'gu';

  // If already logged in as a non-admin viewer, redirect home
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      // Admins aren't sent here — they use /admin/login
      if (profile && profile.role !== 'admin') redirect(`/${lang}`);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🙏</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#501518] font-serif-gu tracking-tight">
            {isGu ? 'ભક્ત લૉગ ઇન' : 'Devotee Login'}
          </h1>
          <p className="text-sm text-[#614D43] font-serif-gu mt-2">
            {isGu
              ? 'ભક્ત સમુદાયમાં પ્રવેશ કરો'
              : 'Sign in to join the devotional community'}
          </p>
        </div>

        {/* Success message (e.g. after signup) */}
        {message === 'check-email' && (
          <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 text-sm text-green-800 font-serif-gu text-center">
            {isGu
              ? '✅ ખાતું બન્યું! ઇ-મેઇલ તપાસો અને ચકાસણી કડી પર ક્લિક કરો.'
              : '✅ Account created! Please check your email and click the verification link.'}
          </div>
        )}

        {/* Card */}
        <div className="bg-white border border-[#E8DFD3] rounded-2xl shadow-sm p-6 sm:p-8">
          <LoginForm lang={validLang} />

          <p className="text-center text-sm font-serif-gu text-[#614D43] mt-6">
            {isGu ? 'ખાતું નથી?' : "Don't have an account?"}{' '}
            <Link
              href={`/${lang}/auth/signup`}
              className="font-semibold text-[#501518] hover:text-[#C59B4B] transition-colors"
            >
              {isGu ? 'અહીં નોંધણી કરો' : 'Sign up here'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
