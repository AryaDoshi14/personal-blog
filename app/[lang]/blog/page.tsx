import React from 'react';
import { notFound } from 'next/navigation';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BlogListClient } from '@/components/blog/BlogListClient';
import { AboutAuthor } from '@/components/blog/AboutAuthor';
import { getCategories, getPublishedPosts, getSiteSettings } from '@/lib/db';
import { Language } from '@/types';

interface BlogPageProps {
  params: Promise<{
    lang: string;
  }>;
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { lang } = await params;
  const { q } = await searchParams;

  if (lang !== 'gu' && lang !== 'en') {
    notFound();
  }

  const validLang = lang as Language;
  const isGu = validLang === 'gu';
  const search = (q || '').trim();

  const [posts, categories, settings] = await Promise.all([
    getPublishedPosts({ search: search || undefined }),
    getCategories(),
    getSiteSettings(),
  ]);

  return (
    <div className="py-12 sm:py-16 bg-[#FAF6F0] min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={isGu ? 'મારા લેખો' : 'My Articles'}
          subtitle={
            isGu
              ? 'ભક્તિ, સંસ્કાર અને જીવન દર્શનના સુંદર ચિંતનશીલ લેખોનો સંગ્રહ'
              : 'A curated collection of thoughtful articles on devotion, heritage, and spiritual contemplation'
          }
        />

        <BlogListClient
          posts={posts}
          categories={categories}
          lang={validLang}
          initialSearch={search}
        />

        <div className="mt-16 max-w-2xl mx-auto">
          <AboutAuthor settings={settings} lang={validLang} compact />
        </div>
      </div>
    </div>
  );
}
