import React from 'react';
import Image from 'next/image';
import { Language, SiteSettings } from '@/types';

interface AboutAuthorProps {
  settings: SiteSettings;
  lang: Language;
  compact?: boolean;
}

export function AboutAuthor({ settings, lang, compact = false }: AboutAuthorProps) {
  const isGu = lang === 'gu';
  const name = isGu
    ? settings.author_name_gu
    : settings.author_name_en || settings.author_name_gu;
  const bio = isGu
    ? settings.author_bio_gu
    : settings.author_bio_en || settings.author_bio_gu;

  if (!name && !settings.author_photo_url && !bio) {
    return null;
  }

  return (
    <aside
      className={`rounded-2xl border border-[#E8DFD3] bg-[#F4EDE2]/60 ${
        compact ? 'p-4' : 'p-5 sm:p-6'
      }`}
    >
      <p className="text-[11px] uppercase tracking-wider text-[#C59B4B] font-semibold mb-3 font-serif-gu">
        {isGu ? 'લેખક વિશે' : 'About the Author'}
      </p>
      <div className={`flex ${compact ? 'gap-3' : 'gap-4'} items-start`}>
        {settings.author_photo_url ? (
          <div
            className={`relative shrink-0 overflow-hidden rounded-full border border-[#C59B4B]/40 bg-[#FAF6F0] ${
              compact ? 'w-14 h-14' : 'w-16 h-16 sm:w-20 sm:h-20'
            }`}
          >
            <Image
              src={settings.author_photo_url}
              alt={name || 'Author'}
              fill
              className="object-cover"
              sizes={compact ? '56px' : '80px'}
            />
          </div>
        ) : (
          <div
            className={`shrink-0 rounded-full border border-[#C59B4B]/40 bg-[#501518] text-[#FAF6F0] flex items-center justify-center font-serif-gu font-bold ${
              compact ? 'w-14 h-14 text-lg' : 'w-16 h-16 sm:w-20 sm:h-20 text-xl'
            }`}
            aria-hidden
          >
            {(name || 'શ').charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-serif-gu font-bold text-[#501518] text-base sm:text-lg leading-snug">
            {name}
          </h3>
          {bio && (
            <p
              className={`mt-1.5 text-[#614D43] font-serif-gu leading-relaxed ${
                compact ? 'text-xs line-clamp-3' : 'text-sm'
              }`}
            >
              {bio}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
