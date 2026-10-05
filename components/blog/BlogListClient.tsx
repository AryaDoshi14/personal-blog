'use client';

import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { BlogCard } from './BlogCard';
import { Category, Language, Post } from '@/types';

interface BlogListClientProps {
  posts: Post[];
  categories: Category[];
  lang: Language;
  initialSearch?: string;
}

export const BlogListClient: React.FC<BlogListClientProps> = ({
  posts,
  categories,
  lang,
  initialSearch = '',
}) => {
  const isGu = lang === 'gu';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return posts.filter((post) => {
      const matchesCategory = selectedCategory === 'all' || post.category_id === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;

      return (
        post.title_gu?.toLowerCase().includes(q) ||
        post.title_en?.toLowerCase().includes(q) ||
        post.excerpt_gu?.toLowerCase().includes(q) ||
        post.excerpt_en?.toLowerCase().includes(q) ||
        post.author_name_gu?.toLowerCase().includes(q) ||
        post.author_name_en?.toLowerCase().includes(q) ||
        post.tags?.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E8DFD3]">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full font-serif-gu text-sm transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#501518] text-white shadow-sm'
                : 'bg-[#FAF6F0] text-[#501518] border border-[#E8DFD3] hover:border-[#C59B4B]'
            }`}
          >
            {isGu ? 'બધા લેખો' : 'All Articles'}
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-serif-gu text-sm transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#501518] text-white shadow-sm'
                  : 'bg-[#FAF6F0] text-[#501518] border border-[#E8DFD3] hover:border-[#C59B4B]'
              }`}
            >
              {isGu ? cat.name_gu : cat.name_en}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isGu ? 'લેખ / લેખક શોધો...' : 'Search title or author...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#E8DFD3] bg-[#FAF6F0] text-sm text-[#2C1A14] placeholder-[#614D43]/60 focus:outline-none focus:ring-2 focus:ring-[#C59B4B] focus:border-transparent font-serif-gu"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#C59B4B]" />
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} lang={lang} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#F4EDE2]/50 rounded-2xl border border-[#E8DFD3]">
          <p className="text-lg text-[#614D43] font-serif-gu">
            {isGu
              ? 'કોઈ લેખ મળ્યો નથી. કૃપા કરીને અન્ય શોધ શબ્દ અજમાવો.'
              : 'No articles found matching your criteria.'}
          </p>
        </div>
      )}
    </div>
  );
};
