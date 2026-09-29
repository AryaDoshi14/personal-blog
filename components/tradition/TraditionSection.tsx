import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Language, SiteSettings } from '@/types';

interface TraditionSectionProps {
  settings: SiteSettings;
  lang: Language;
}

export const TraditionSection: React.FC<TraditionSectionProps> = ({ settings, lang }) => {
  const isGu = lang === 'gu';
  const sectionTitle = isGu ? 'અમારી પરંપરા' : 'Our Tradition';
  const topicTitle = isGu ? settings.tradition_title_gu : settings.tradition_title_en;
  const rawText = isGu ? settings.tradition_text_gu : settings.tradition_text_en;
  const paragraphs = (rawText || '').replace(/\\n/g, '\n').split('\n\n').filter(Boolean);

  return (
    <section className="py-12 sm:py-16 bg-[#F4EDE2]/40 border-y border-[#E8DFD3]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={sectionTitle} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Haveli Engraving Artwork */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-[#E8DFD3] bg-[#FAF6F0] p-2">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src={settings.tradition_image_url || '/images/defaults/tradition-haveli.webp'}
                  alt={topicTitle}
                  fill
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 500px"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Tradition Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#501518] font-serif-gu mb-4 tracking-tight">
              {topicTitle}
            </h3>

            <div className="space-y-4 text-[#614D43] font-serif-gu text-base sm:text-lg leading-relaxed">
              {paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href={`/${lang}/tradition`}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-[#501518] text-white font-serif-gu font-medium text-base hover:bg-[#6B1D23] transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#C59B4B]"
              >
                {isGu ? 'વધુ જાણો' : 'Learn More'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
