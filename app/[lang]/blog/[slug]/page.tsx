import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';
import { Calendar, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { OrnamentalDivider } from '@/components/ui/OrnamentalDivider';
import { BlogCard } from '@/components/blog/BlogCard';
import { getPostBySlug, getPublishedPosts } from '@/lib/db';
import { Language } from '@/types';

interface PostDetailPageProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { lang, slug } = await params;

  if (lang !== 'gu' && lang !== 'en') {
    notFound();
  }

  const validLang = lang as Language;
  const isGu = validLang === 'gu';

  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  // Graceful fallback to Gujarati if English content is absent
  const title = isGu ? post.title_gu : post.title_en || post.title_gu;
  const rawContent = isGu
    ? post.content_gu
    : post.content_en || post.content_gu;
  const isFallback = !isGu && !post.content_en;

  // Sanitize rendered rich text for security
  const sanitizedContent = DOMPurify.sanitize(rawContent);

  // Fetch related posts (excluding current post)
  const allPosts = await getPublishedPosts({ limit: 4 });
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString(isGu ? 'gu-IN' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <article className="py-10 sm:py-16 bg-[#FAF6F0] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href={`/${lang}/blog`}
            className="inline-flex items-center gap-2 text-sm font-serif-gu font-medium text-[#501518] hover:text-[#C59B4B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isGu ? 'બધા લેખો પર પાછા જાઓ' : 'Back to all articles'}</span>
          </Link>
        </div>

        {/* Header Information */}
        <header className="text-center mb-8">
          {post.category && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#501518] text-white font-serif-gu tracking-wide mb-3">
              {isGu ? post.category.name_gu : post.category.name_en}
            </span>
          )}

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#501518] font-serif-gu tracking-tight leading-tight mb-4">
            {title}
          </h1>

          <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-[#614D43] font-serif-gu">
            {formattedDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#C59B4B]" />
                {formattedDate}
              </span>
            )}
          </div>

          <OrnamentalDivider className="my-3" />
        </header>

        {/* Notice for English fallback */}
        {isFallback && (
          <div className="mb-6 p-4 rounded-xl bg-[#F4EDE2] border border-[#C59B4B]/50 text-xs sm:text-sm text-[#501518] font-serif-gu text-center">
            Note: English translation is being prepared. Displaying original Gujarati devotional text.
          </div>
        )}

        {/* Cover Image */}
        {post.cover_image_url && (
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-md border border-[#E8DFD3] mb-10 bg-[#F4EDE2]">
            <Image
              src={post.cover_image_url}
              alt={post.cover_image_alt || title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        )}

        {/* Rich Article Content */}
        <div
          className="prose prose-stone lg:prose-lg max-w-none font-serif-gu leading-relaxed text-[#2C1A14]
            prose-headings:text-[#501518] prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:mb-4 prose-p:text-base sm:prose-p:text-lg prose-p:leading-relaxed
            prose-blockquote:border-l-4 prose-blockquote:border-[#C59B4B] prose-blockquote:bg-[#F4EDE2]/50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-[#501518]
            prose-a:text-[#501518] prose-a:underline prose-a:decoration-[#C59B4B] hover:prose-a:text-[#C59B4B]
            prose-img:rounded-xl prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-[#E8DFD3] flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-[#C59B4B]" />
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-md bg-[#FAF6F0] border border-[#E8DFD3] text-xs font-serif-gu text-[#501518]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Devotional Ending Blessing */}
        <div className="my-12 p-6 rounded-2xl bg-gradient-to-r from-[#FAF6F0] via-[#F4EDE2] to-[#FAF6F0] border border-[#C59B4B]/40 text-center shadow-xs">
          <p className="text-lg font-serif-gu font-semibold text-[#501518] tracking-wider">
            || શ્રી કૃષ્ણ શરણં મમ: ||
          </p>
          <p className="text-xs text-[#614D43] mt-1 font-serif-gu">
            {isGu
              ? 'શ્રીજી બાબાની અસીમ કૃપા આપ સર્વે પર સદૈવ વરસતી રહે.'
              : 'May the eternal grace of Shreeji Baba always shower upon you.'}
          </p>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#E8DFD3]">
            <h3 className="text-xl sm:text-2xl font-bold text-[#501518] font-serif-gu mb-6 text-center">
              {isGu ? 'સંબંધિત લેખો' : 'Related Articles'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <BlogCard key={rPost.id} post={rPost} lang={validLang} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
