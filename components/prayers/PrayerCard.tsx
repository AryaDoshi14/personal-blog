import React from 'react';
import Link from 'next/link';
import { MedallionIcon } from '@/components/ui/MedallionIcon';
import { Language, Prayer } from '@/types';

interface PrayerCardProps {
  prayer: Prayer;
  lang: Language;
}

export const PrayerCard: React.FC<PrayerCardProps> = ({ prayer, lang }) => {
  const isGu = lang === 'gu';
  const title = isGu ? prayer.title_gu : prayer.title_en || prayer.title_gu;
  const subtitle = isGu ? prayer.subtitle_gu : prayer.subtitle_en || prayer.subtitle_gu;

  return (
    <div className="card-devotional bg-[#FFFDF9] border border-[#E8DFD3] rounded-2xl p-5 sm:p-6 shadow-sm hover:border-[#C59B4B]/60 flex flex-col justify-between h-full transition-all">
      <div className="flex items-start gap-4">
        {/* Maroon circular medallion icon matching reference */}
        <MedallionIcon type={prayer.icon_type} size="md" />

        {/* Prayer titles */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-[#501518] font-serif-gu tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#614D43] mt-1 font-serif-gu line-clamp-2 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Button: વાંચો → */}
      <div className="mt-5 pt-3 border-t border-[#E8DFD3]/50 flex justify-end">
        <Link
          href={`/${lang}/prayers/${prayer.slug}`}
          className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg border border-[#C59B4B]/70 bg-[#FAF6F0] text-[#501518] font-serif-gu font-medium text-sm hover:bg-[#501518] hover:text-white hover:border-[#501518] transition-all shadow-2xs"
        >
          <span>{isGu ? 'વાંચો' : 'Read'}</span>
          <span className="text-[#C59B4B] group-hover:text-white">→</span>
        </Link>
      </div>
    </div>
  );
};
