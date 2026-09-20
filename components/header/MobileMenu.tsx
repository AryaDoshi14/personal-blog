'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Language } from '@/types';

interface MobileMenuProps {
  lang: Language;
  siteName: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ lang, siteName }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const navLinks = [
    { href: `/${lang}`, labelGu: 'મુખ્ય પાનું', labelEn: 'Home' },
    { href: `/${lang}/prayers`, labelGu: 'પ્રાર્થનાઓ', labelEn: 'Prayers' },
    { href: `/${lang}/tradition`, labelGu: 'અમારી પરંપરા', labelEn: 'Our Tradition' },
    { href: `/${lang}/blog`, labelGu: 'મારા લેખો', labelEn: 'My Articles' },
    { href: `/${lang}/contact`, labelGu: 'સંપર્ક', labelEn: 'Contact' },
  ];

  if (!isOpen) {
    return (
      <div className="md:hidden flex items-center gap-2">
        <LanguageSwitcher currentLang={lang} />
        <button
          onClick={() => setIsOpen(true)}
          type="button"
          className="p-2 rounded-lg text-[#501518] hover:bg-[#F4EDE2] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C59B4B]"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="md:hidden flex items-center gap-2">
      <LanguageSwitcher currentLang={lang} />
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="p-2 rounded-lg text-[#501518] hover:bg-[#F4EDE2] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C59B4B]"
        aria-label="Open navigation menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay: full screen, above everything */}
      <div
        className="fixed top-0 left-0 right-0 bottom-0 flex"
        style={{ zIndex: 9999, height: '100dvh' }}
      >
        {/* Dim backdrop */}
        <div
          className="flex-1 bg-black/60"
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer: full height, solid white */}
        <div
          className="flex flex-col bg-white"
          style={{
            width: '78%',
            maxWidth: '340px',
            height: '100%',
            borderLeft: '4px solid #C59B4B',
            boxShadow: '-6px 0 30px rgba(0,0,0,0.25)',
          }}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#E8DFD3] bg-white">
            <div className="flex items-center gap-2.5">
              <Image src="/images/defaults/logo-mandala.svg" alt="Logo" width={32} height={32} />
              <span className="font-bold text-[#501518] text-lg" style={{ fontFamily: 'var(--font-noto-serif-gujarati), serif' }}>
                {siteName}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              aria-label="Close menu"
              className="p-1.5 rounded-lg border border-[#E8DFD3] bg-[#FAF6F0] text-[#501518] hover:bg-[#F4EDE2]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Nav Links ── */}
          <nav className="flex-1 overflow-y-auto bg-white px-3 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-4 mb-1 rounded-xl text-[#2C1A14] font-semibold hover:bg-[#FAF6F0] hover:text-[#501518] transition-colors"
                style={{
                  fontFamily: 'var(--font-noto-serif-gujarati), serif',
                  fontSize: '19px',
                  borderLeft: '4px solid transparent',
                }}
              >
                {lang === 'gu' ? link.labelGu : link.labelEn}
              </Link>
            ))}
          </nav>

          {/* ── Footer Blessing ── */}
          <div className="px-5 py-4 border-t border-[#E8DFD3] bg-[#FAF6F0] text-center">
            <p className="text-sm font-medium italic text-[#614D43]"
              style={{ fontFamily: 'var(--font-noto-serif-gujarati), serif' }}>
              || શ્રી કૃષ્ણ શરણં મમ: ||
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
