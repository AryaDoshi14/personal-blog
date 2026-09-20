import React from 'react';
import { notFound } from 'next/navigation';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BlogListClient } from '@/components/blog/BlogListClient';
import { getCategories, getPublishedPosts } from '@/lib/db';
import { Language } from '@/types';

interface BlogPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang } = await params;

  if (lang !== 'gu' && lang !== 'en') {
    notFound();
  }

  const validLang = lang as Language;
  const isGu = validLang === 'gu';

  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
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

        <BlogListClient posts={posts} categories={categories} lang={validLang} />
      </div>
    </div>
  );
}
