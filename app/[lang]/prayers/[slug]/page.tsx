import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MedallionIcon } from '@/components/ui/MedallionIcon';
import { OrnamentalDivider } from '@/components/ui/OrnamentalDivider';
import { getPrayerBySlug, getPrayers } from '@/lib/db';
import { Language } from '@/types';

interface PrayerDetailPageProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}

export default async function PrayerDetailPage({ params }: PrayerDetailPageProps) {
  const { lang, slug } = await params;

  if (lang !== 'gu' && lang !== 'en') {
    notFound();
  }

  const validLang = lang as Language;
  const isGu = validLang === 'gu';

  const prayer = await getPrayerBySlug(slug);
  if (!prayer) {
    notFound();
  }

  const otherPrayers = (await getPrayers()).filter((p) => p.slug !== slug);
  const title = isGu ? prayer.title_gu : prayer.title_en || prayer.title_gu;
  const subtitle = isGu ? prayer.subtitle_gu : prayer.subtitle_en || prayer.subtitle_gu;
  const contentGu = prayer.content_gu;
  const contentEn = prayer.content_en;

  return (
    <div className="py-10 sm:py-16 bg-[#FAF6F0] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href={`/${lang}/prayers`}
            className="inline-flex items-center gap-2 text-sm font-serif-gu font-medium text-[#501518] hover:text-[#C59B4B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isGu ? 'બધી પ્રાર્થનાઓ પર પાછા જાઓ' : 'Back to all prayers'}</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <MedallionIcon type={prayer.icon_type} size="lg" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#501518] font-serif-gu tracking-tight mb-3">
            {title}
          </h1>

          {subtitle && (
            <p className="text-base sm:text-lg text-[#614D43] font-serif-gu max-w-xl mx-auto">
              {subtitle}
            </p>
          )}

          <OrnamentalDivider className="my-4" />
        </div>

        {/* Gujarati Sacred Text */}
        <div className="bg-[#FFFDF9] border border-[#E8DFD3] rounded-3xl p-6 sm:p-10 shadow-sm mb-10">
          <h2 className="text-xl font-bold text-[#501518] font-serif-gu mb-6 pb-3 border-b border-[#E8DFD3] flex items-center justify-between">
            <span>{isGu ? 'પવિત્ર સ્તુતિ / પાઠ' : 'Sacred Recitation (Gujarati Script)'}</span>
            <span className="text-xs text-[#8C6D2D] font-normal">શ્રીજી સ્મરણ</span>
          </h2>

          <div className="text-lg sm:text-xl font-serif-gu leading-loose sm:leading-loose text-[#2C1A14] whitespace-pre-line text-center sm:text-left">
            {(contentGu || '').replace(/\\n/g, '\n')}
          </div>
        </div>

        {/* English Translation & Meaning (if available) */}
        {contentEn && (
          <div className="bg-[#F4EDE2]/50 border border-[#E8DFD3] rounded-3xl p-6 sm:p-10 shadow-sm mb-10">
            <h2 className="text-xl font-bold text-[#501518] font-serif-gu mb-6 pb-3 border-b border-[#E8DFD3] flex items-center justify-between">
              <span>{isGu ? 'અંગ્રેજી અનુવાદ અને ભાવાર્થ' : 'English Translation & Meaning'}</span>
            </h2>

            <div className="text-base sm:text-lg leading-relaxed text-[#4A3830] whitespace-pre-line font-serif-gu">
              {contentEn.replace(/\\n/g, '\n')}
            </div>
          </div>
        )}

        {/* Closing Blessing */}
        <div className="text-center py-6 border-t border-[#E8DFD3]">
          <p className="text-xl font-bold text-[#501518] font-serif-gu">
            || શ્રી કૃષ્ણ શરણં મમ: ||
          </p>
        </div>

        {/* Other Prayers Navigation */}
        {otherPrayers.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#E8DFD3]">
            <h3 className="text-lg font-bold text-[#501518] font-serif-gu mb-4">
              {isGu ? 'અન્ય પવિત્ર પ્રાર્થનાઓ' : 'Other Sacred Prayers'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherPrayers.map((p) => (
                <Link
                  key={p.id}
                  href={`/${lang}/prayers/${p.slug}`}
                  className="flex items-center gap-3 p-4 rounded-xl bg-[#FFFDF9] border border-[#E8DFD3] hover:border-[#C59B4B] transition-all card-devotional"
                >
                  <MedallionIcon type={p.icon_type} size="sm" />
                  <div>
                    <h4 className="font-bold text-[#501518] font-serif-gu text-base">
                      {isGu ? p.title_gu : p.title_en || p.title_gu}
                    </h4>
                    <p className="text-xs text-[#614D43] font-serif-gu line-clamp-1">
                      {isGu ? p.subtitle_gu : p.subtitle_en || p.subtitle_gu}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
