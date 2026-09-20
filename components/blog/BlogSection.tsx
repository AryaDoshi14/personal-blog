import React from 'react';
import Link from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BlogCard } from './BlogCard';
import { Language, Post } from '@/types';

interface BlogSectionProps {
  posts: Post[];
  lang: Language;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts, lang }) => {
  const isGu = lang === 'gu';
  const sectionTitle = isGu ? 'મારા લેખો' : 'My Articles';
  const subtitle = isGu
    ? 'ભક્તિ, પરંપરા અને આધ્યાત્મિક જીવનના પ્રેરણાદાયી વિચારો'
    : 'Inspiring reflections on devotion, tradition, and spiritual life';

  return (
    <section className="py-12 sm:py-16 bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={sectionTitle} subtitle={subtitle} />

        {/* 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} lang={lang} />
          ))}
        </div>

        {/* View All Articles Button */}
        <div className="mt-12 text-center">
          <Link
            href={`/${lang}/blog`}
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-[#501518] text-white font-serif-gu font-medium text-base hover:bg-[#6B1D23] transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#C59B4B]"
          >
            {isGu ? 'બધા લેખો જુઓ' : 'View All Articles'}
          </Link>
        </div>
      </div>
    </section>
  );
};
