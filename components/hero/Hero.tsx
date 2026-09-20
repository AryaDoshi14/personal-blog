'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { OrnamentalDivider } from '@/components/ui/OrnamentalDivider';
import { Language, SiteSettings } from '@/types';

interface HeroProps {
  lang: Language;
  settings: SiteSettings;
}

export const Hero: React.FC<HeroProps> = ({ lang, settings }) => {
  const pathname = usePathname();
  const router = useRouter();

  const isGu = lang === 'gu';
  const heading = isGu ? settings.hero_heading_gu : settings.hero_heading_en;
  const intro = isGu ? settings.hero_intro_gu : settings.hero_intro_en;
  const sanskritLine = isGu ? settings.hero_sanskrit_line_gu : settings.hero_sanskrit_line_en;

  const toggleLanguage = () => {
    const targetLang = isGu ? 'en' : 'gu';
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) {
      router.push(`/${targetLang}`);
      return;
    }
    if (segments[0] === 'gu' || segments[0] === 'en') {
      segments[0] = targetLang;
    } else {
      segments.unshift(targetLang);
    }
    router.push(`/${segments.join('/')}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF6F0] via-[#FAF6F0] to-[#F4EDE2]/50 py-8 sm:py-12 md:py-16 border-b border-[#E8DFD3]/60">
      {/* Background Watermark Lotus */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 sm:w-[480px] sm:h-[480px] opacity-25 pointer-events-none select-none z-0">
        <Image
          src="/images/defaults/lotus-watermark.svg"
          alt="Lotus Watermark"
          fill
          className="object-contain"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Shrinathji Devotional Image */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-1">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#C59B4B]/60 p-1 bg-[#501518]">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src={settings.hero_image_url || '/images/defaults/hero-shrinathji.webp'}
                  alt={isGu ? 'શ્રીનાથજી દર્શન' : 'Shrinathji Darshan'}
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 420px"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Devotional Content & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-2">
            <div className="w-full max-w-xl mx-auto lg:mx-0">
              <OrnamentalDivider className="justify-center lg:justify-start" />

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#501518] font-serif-gu tracking-tight mt-2 leading-tight">
                {heading}
              </h1>

              <OrnamentalDivider className="justify-center lg:justify-start my-2" />

              <p className="text-[#614D43] font-serif-gu text-base sm:text-lg md:text-xl leading-relaxed mt-4 font-normal">
                {intro}
              </p>

              <div className="my-6">
                <span className="inline-block text-[#8C6D2D] font-serif-gu text-lg sm:text-xl md:text-2xl font-semibold tracking-wider px-4 py-1.5 rounded-full bg-[#FAF6F0] border border-[#C59B4B]/40 shadow-sm">
                  {sanskritLine}
                </span>
              </div>

              {/* CTAs matching reference */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-2">
                <Link
                  href={`/${lang}/blog`}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#501518] text-white font-serif-gu font-medium text-base hover:bg-[#6B1D23] transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#C59B4B]"
                >
                  {isGu ? 'વધુ વાંચો' : 'Read Articles'}
                </Link>

                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#FAF6F0] border border-[#C59B4B] text-[#501518] font-serif-gu font-medium text-base hover:bg-[#F4EDE2] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C59B4B]"
                >
                  {isGu ? 'Read in English' : 'ગુજરાતીમાં વાંચો'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
