import React from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { getSiteSettings } from '@/lib/db';
import { Language } from '@/types';

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    lang: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;

  if (lang !== 'gu' && lang !== 'en') {
    notFound();
  }

  const validLang = lang as Language;
  const settings = await getSiteSettings();
  const siteName = validLang === 'gu' ? settings.site_name_gu : settings.site_name_en;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF6F0]">
      <Header lang={validLang} siteName={siteName} logoUrl={settings.header_logo_url} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} lang={validLang} />
    </div>
  );
}
