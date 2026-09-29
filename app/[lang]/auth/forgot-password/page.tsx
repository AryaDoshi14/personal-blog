import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Language } from '@/types';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

interface ForgotPasswordPageProps {
  params: Promise<{ lang: string }>;
}

export const metadata = { title: 'Forgot Password | શ્રીજી બાબા' };

export default async function ForgotPasswordPage({ params }: ForgotPasswordPageProps) {
  const { lang } = await params;
  if (lang !== 'gu' && lang !== 'en') notFound();
  const validLang = lang as Language;
  const isGu = validLang === 'gu';

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔑</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#501518] font-serif-gu tracking-tight">
            {isGu ? 'પાસવર્ડ ભૂલ્યા?' : 'Forgot Password?'}
          </h1>
          <p className="text-sm text-[#614D43] font-serif-gu mt-2">
            {isGu
              ? 'ઇ-મેઇલ દાખલ કરો — અમે રીસેટ કડી મોકલીશું.'
              : 'Enter your email — we\'ll send you a reset link.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E8DFD3] rounded-2xl shadow-sm p-6 sm:p-8">
          <ForgotPasswordForm lang={validLang} />

          <p className="text-center text-sm font-serif-gu text-[#614D43] mt-6">
            <Link
              href={`/${lang}/auth/login`}
              className="font-semibold text-[#501518] hover:text-[#C59B4B] transition-colors"
            >
              ← {isGu ? 'લૉગિન પર પાછા જાઓ' : 'Back to Login'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
