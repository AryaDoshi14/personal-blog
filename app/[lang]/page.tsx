import React from 'react';
import { notFound } from 'next/navigation';
import { Hero } from '@/components/hero/Hero';
import { PrayerSection } from '@/components/prayers/PrayerSection';
import { TraditionSection } from '@/components/tradition/TraditionSection';
import { BlogSection } from '@/components/blog/BlogSection';
import { getPrayers, getPublishedPosts, getSiteSettings } from '@/lib/db';
import { Language } from '@/types';

interface HomePageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;

  if (lang !== 'gu' && lang !== 'en') {
    notFound();
  }

  const validLang = lang as Language;

  // Fetch dynamic data from database with fallback defaults
  const [settings, prayers, posts] = await Promise.all([
    getSiteSettings(),
    getPrayers(),
    getPublishedPosts({ limit: 4 }),
  ]);

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <Hero lang={validLang} settings={settings} />

      {/* 2. PRAYERS SECTION */}
      <PrayerSection prayers={prayers} lang={validLang} />

      {/* 3. TRADITION SECTION */}
      <TraditionSection settings={settings} lang={validLang} />

      {/* 4. BLOGS SECTION */}
      <BlogSection posts={posts} lang={validLang} />
    </div>
  );
}
