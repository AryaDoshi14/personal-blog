import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { Language } from '@/types';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

interface ResetPasswordPageProps {
  params: Promise<{ lang: string }>;
}

export const metadata = { title: 'Reset Password | શ્રીજી બાબા' };

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { lang } = await params;
  if (lang !== 'gu' && lang !== 'en') notFound();
  const validLang = lang as Language;
  const isGu = validLang === 'gu';

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#501518] font-serif-gu tracking-tight">
            {isGu ? 'નવો પાસવર્ડ સેટ કરો' : 'Set New Password'}
          </h1>
          <p className="text-sm text-[#614D43] font-serif-gu mt-2">
            {isGu
              ? 'નવો મજબૂત પાસવર્ડ દાખલ કરો.'
              : 'Enter a strong new password below.'}
          </p>
        </div>

        <div className="bg-white border border-[#E8DFD3] rounded-2xl shadow-sm p-6 sm:p-8">
          <ResetPasswordForm lang={validLang} />
        </div>
      </div>
    </div>
  );
}
