import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Language, Post } from '@/types';

interface BlogCardProps {
  post: Post;
  lang: Language;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, lang }) => {
  const isGu = lang === 'gu';
  const title = isGu ? post.title_gu : post.title_en || post.title_gu;
  const excerpt = isGu ? post.excerpt_gu : post.excerpt_en || post.excerpt_gu;
  const categoryName = post.category
    ? isGu
      ? post.category.name_gu
      : post.category.name_en
    : null;

  return (
    <article className="card-devotional bg-[#FFFDF9] border border-[#E8DFD3] rounded-2xl overflow-hidden shadow-xs hover:border-[#C59B4B]/70 flex flex-col justify-between h-full transition-all">
      <div>
        {/* Cover Image */}
        <Link href={`/${lang}/blog/${post.slug}`} className="block relative aspect-[16/10] w-full overflow-hidden bg-[#F4EDE2]">
          <Image
            src={post.cover_image_url || '/images/defaults/blog-bhakti.webp'}
            alt={post.cover_image_alt || title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {categoryName && (
            <span className="absolute top-3 left-3 bg-[#501518]/90 text-white font-serif-gu text-xs px-2.5 py-1 rounded-md shadow-sm backdrop-blur-xs">
              {categoryName}
            </span>
          )}
        </Link>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-[#501518] font-serif-gu tracking-tight hover:text-[#C59B4B] transition-colors leading-snug line-clamp-2">
            <Link href={`/${lang}/blog/${post.slug}`}>
              {title}
            </Link>
          </h3>

          <p className="text-[#614D43] text-sm font-serif-gu mt-2.5 line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
        </div>
      </div>

      {/* Action: વાંચો વધુ → */}
      <div className="p-5 pt-0">
        <Link
          href={`/${lang}/blog/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#501518] hover:text-[#C59B4B] font-serif-gu transition-colors group"
        >
          <span>{isGu ? 'વાંચો વધુ' : 'Read More'}</span>
          <span className="text-[#C59B4B] transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </article>
  );
};
