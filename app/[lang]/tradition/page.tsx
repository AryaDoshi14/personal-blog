import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { OrnamentalDivider } from '@/components/ui/OrnamentalDivider';
import { getSiteSettings } from '@/lib/db';
import { Language } from '@/types';

interface TraditionPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export const revalidate = 300;

export default async function TraditionPage({ params }: TraditionPageProps) {
  const { lang } = await params;

  if (lang !== 'gu' && lang !== 'en') {
    notFound();
  }

  const validLang = lang as Language;
  const isGu = validLang === 'gu';
  const settings = await getSiteSettings();

  const title = isGu ? settings.tradition_title_gu : settings.tradition_title_en;
  const rawText = isGu ? settings.tradition_text_gu : settings.tradition_text_en;
  const paragraphs = (rawText || '').replace(/\\n/g, '\n').split('\n\n').filter(Boolean);

  return (
    <div className="py-12 sm:py-16 bg-[#FAF6F0] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={isGu ? 'અમારી પરંપરા અને વારસો' : 'Our Sacred Tradition & Heritage'}
          subtitle={
            isGu
              ? 'વૈષ્ણવ સંસ્કાર, સેવા ભાવના અને સદીઓ પુરાણી ભક્તિ પરંપરાનું ગૌરવ'
              : 'Honoring Vaishnav values, unconditional seva, and centuries of devotional heritage'
          }
        />

        {/* Featured Haveli Image */}
        <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-xl border-2 border-[#C59B4B]/50 p-2 bg-[#FAF6F0] mb-12">
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            <Image
              src={settings.tradition_image_url || '/images/defaults/tradition-haveli.webp'}
              alt={title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        </div>

        {/* Story & Philosophy */}
        <div className="bg-[#FFFDF9] border border-[#E8DFD3] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#501518] font-serif-gu tracking-tight">
            {title}
          </h2>

          <div className="space-y-4 text-base sm:text-lg text-[#2C1A14] font-serif-gu leading-relaxed">
            {paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <OrnamentalDivider className="my-6" />

          {/* Core Pillars */}
          <h3 className="text-xl sm:text-2xl font-bold text-[#501518] font-serif-gu pt-4">
            {isGu ? 'પરંપરાના મૂળભૂત સ્તંભો' : 'Foundational Pillars of Our Heritage'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD3] text-center">
              <span className="text-2xl font-bold text-[#C59B4B] block mb-2 font-serif-gu">
                ૧. સેવા ભાવ
              </span>
              <p className="text-sm text-[#614D43] font-serif-gu">
                {isGu
                  ? 'શ્રીઠાકોરજીની નિઃસ્વાર્થ તન, મન અને ધનથી નિત્ય પ્રેમપૂર્વક સેવા.'
                  : 'Pure selfless loving devotion offered daily to Thakorji.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD3] text-center">
              <span className="text-2xl font-bold text-[#C59B4B] block mb-2 font-serif-gu">
                ૨. સદાચાર
              </span>
              <p className="text-sm text-[#614D43] font-serif-gu">
                {isGu
                  ? 'સત્ય, અહિંસા, નમ્રતા અને પ્રામાણિકતા સાથેનું જીવન વ્યવહાર.'
                  : 'Truthfulness, non-violence, humility, and honest living.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD3] text-center">
              <span className="text-2xl font-bold text-[#C59B4B] block mb-2 font-serif-gu">
                ૩. સત્સંગ
              </span>
              <p className="text-sm text-[#614D43] font-serif-gu">
                {isGu
                  ? 'વૈષ્ણવો વચ્ચે ભગવદ્ ચર્ચા, કીર્તન અને સદ્વિચારોનું આદાન-પ્રદાન.'
                  : 'Spiritual fellowship, kirtan chanting, and uplifting wisdom.'}
              </p>
            </div>
          </div>
        </div>

        {/* Sanskrit Blessing Quote */}
        <div className="text-center py-10 mt-6">
          <p className="text-xl font-serif-gu font-bold text-[#501518]">
            || સર્વે ભવન્તુ સુખિનઃ સર્વે સન્તુ નિરામયાઃ ||
          </p>
          <p className="text-xs text-[#614D43] mt-1 font-serif-gu">
            {isGu
              ? 'સમસ્ત સંસારનું કલ્યાણ થાઓ અને દરેક જીવ સુખી બને.'
              : 'May all beings everywhere be happy and free from suffering.'}
          </p>
        </div>
      </div>
    </div>
  );
}
