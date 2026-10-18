import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MedallionIcon } from '@/components/ui/MedallionIcon';
import { OrnamentalDivider } from '@/components/ui/OrnamentalDivider';
import { getPrayerBySlug, getPrayers } from '@/lib/db';
import { Language } from '@/types';

import { sanitizeHtml } from '@/lib/sanitize';

function formatPrayerContent(rawContent?: string | null): string {
  if (!rawContent) return '';
  const normalized = rawContent.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n');
  const hasHtml = /<[a-z][\s\S]*>/i.test(normalized);
  if (hasHtml) {
    return sanitizeHtml(normalized);
  }
  // Convert plain text with newlines into HTML paragraphs and line breaks
  const paragraphs = normalized
    .split(/\n\n+/)
    .map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`)
    .join('');
  return sanitizeHtml(paragraphs);
}

export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams() {
  const prayers = await getPrayers();
  const params: { lang: string; slug: string }[] = [];
  for (const prayer of prayers) {
    params.push({ lang: 'gu', slug: prayer.slug });
    params.push({ lang: 'en', slug: prayer.slug });
  }
  return params;
}

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

        {/* Gujarati Sacred Text (only on Gujarati page) */}
        {isGu && (
          <div className="bg-[#FFFDF9] border border-[#E8DFD3] rounded-3xl p-6 sm:p-10 shadow-sm mb-10">
            <h2 className="text-xl font-bold text-[#501518] font-serif-gu mb-6 pb-3 border-b border-[#E8DFD3] flex items-center justify-between">
              <span>પવિત્ર સ્તુતિ / પાઠ</span>
              <span className="text-xs text-[#8C6D2D] font-normal">શ્રીજી સ્મરણ</span>
            </h2>

            <div
              className="prose prose-stone lg:prose-lg max-w-none font-serif-gu leading-relaxed text-[#2C1A14]
                prose-headings:text-[#501518] prose-headings:font-bold prose-headings:tracking-tight
                prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:mt-6 prose-h1:mb-3 prose-h1:font-serif-gu
                prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-5 prose-h2:mb-2.5 prose-h2:font-serif-gu
                prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-2 prose-h3:font-serif-gu
                prose-p:mb-4 prose-p:text-lg sm:prose-p:text-xl prose-p:leading-loose
                prose-strong:font-bold prose-strong:text-[#501518]
                prose-blockquote:border-l-4 prose-blockquote:border-[#C59B4B] prose-blockquote:bg-[#F4EDE2]/50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic
                prose-a:text-[#501518] prose-a:underline prose-a:decoration-[#C59B4B] hover:prose-a:text-[#C59B4B]"
              dangerouslySetInnerHTML={{ __html: formatPrayerContent(contentGu) }}
            />
          </div>
        )}

        {/* English Path and Meaning (only on English page) */}
        {!isGu && (
          <div className="bg-[#FFFDF9] border border-[#E8DFD3] rounded-3xl p-6 sm:p-10 shadow-sm mb-10">
            <h2 className="text-xl font-bold text-[#501518] font-serif-gu mb-6 pb-3 border-b border-[#E8DFD3] flex items-center justify-between">
              <span>Path and Meaning</span>
              <span className="text-xs text-[#8C6D2D] font-normal">Shreeji Smaran</span>
            </h2>

            <div
              className="prose prose-stone lg:prose-lg max-w-none font-serif-gu leading-relaxed text-[#2C1A14]
                prose-headings:text-[#501518] prose-headings:font-bold prose-headings:tracking-tight
                prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:mt-6 prose-h1:mb-3 prose-h1:font-serif-gu
                prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-5 prose-h2:mb-2.5 prose-h2:font-serif-gu
                prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-2 prose-h3:font-serif-gu
                prose-p:mb-4 prose-p:text-base sm:prose-p:text-lg prose-p:leading-relaxed
                prose-strong:font-bold prose-strong:text-[#501518]
                prose-blockquote:border-l-4 prose-blockquote:border-[#C59B4B] prose-blockquote:bg-[#F4EDE2]/50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic
                prose-a:text-[#501518] prose-a:underline prose-a:decoration-[#C59B4B] hover:prose-a:text-[#C59B4B]"
              dangerouslySetInnerHTML={{
                __html:
                  formatPrayerContent(contentEn) ||
                  '<p class="italic text-[#8C6D2D]">English path and meaning will be added soon.</p>',
              }}
            />
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
