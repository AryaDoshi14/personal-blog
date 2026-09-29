import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Language } from '@/types';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import { HeaderAuthWidget } from '@/components/auth/HeaderAuthWidget';
import { getCurrentViewer } from '@/lib/supabase/viewer';

interface HeaderProps {
  lang: Language;
  siteName: string;
}

export const Header: React.FC<HeaderProps> = async ({ lang, siteName }) => {
  const navLinks = [
    { href: `/${lang}`, labelGu: 'મુખ્ય પાનું', labelEn: 'Home' },
    { href: `/${lang}/prayers`, labelGu: 'પ્રાર્થનાઓ', labelEn: 'Prayers' },
    { href: `/${lang}/tradition`, labelGu: 'અમારી પરંપરા', labelEn: 'Our Tradition' },
    { href: `/${lang}/blog`, labelGu: 'મારા લેખો', labelEn: 'My Articles' },
    { href: `/${lang}/contact`, labelGu: 'સંપર્ક', labelEn: 'Contact' },
  ];

  // Single cached viewer lookup per request
  const { profile } = await getCurrentViewer();
  const mobileUserName =
    profile && profile.role === 'viewer'
      ? profile.full_name?.trim() || (lang === 'gu' ? 'ભક્ત' : 'Devotee')
      : null;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF6F0]/95 backdrop-blur-sm border-b border-[#E8DFD3]/80 transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link
          href={`/${lang}`}
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#C59B4B] rounded-lg p-1"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 transition-transform duration-300 group-hover:rotate-45">
            <Image
              src="/images/defaults/logo-mandala.svg"
              alt="Shreeji Bawa Emblem"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-serif-gu font-bold text-xl sm:text-2xl text-[#501518] tracking-tight group-hover:text-[#6B1D23] transition-colors">
            {siteName}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#501518] font-serif-gu font-medium text-base hover:text-[#C59B4B] focus:outline-none focus:ring-2 focus:ring-[#C59B4B] rounded transition-colors py-1 border-b-2 border-transparent hover:border-[#C59B4B]"
            >
              {lang === 'gu' ? link.labelGu : link.labelEn}
            </Link>
          ))}
        </nav>

        {/* Desktop Language Switcher + Auth Widget */}
        <div className="hidden md:flex items-center gap-3">
          <HeaderAuthWidget lang={lang} profile={profile} />
          <LanguageSwitcher currentLang={lang} />
        </div>

        {/* Mobile Navigation Drawer */}
        <MobileMenu lang={lang} siteName={siteName} userDisplayName={mobileUserName} />
      </div>
    </header>
  );
};
