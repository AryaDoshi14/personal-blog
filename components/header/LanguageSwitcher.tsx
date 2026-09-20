'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Language } from '@/types';

interface LanguageSwitcherProps {
  currentLang: Language;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLang }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (targetLang: Language) => {
    if (targetLang === currentLang) return;

    // Replace the language segment in current pathname
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
    <div
      className="inline-flex items-center rounded-md border border-[#C59B4B]/60 bg-[#FAF6F0] px-3 py-1.5 text-xs sm:text-sm font-medium text-[#501518] shadow-sm hover:border-[#C59B4B] transition-colors"
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => handleLanguageChange('gu')}
        className={`px-1.5 py-0.5 rounded transition-colors ${
          currentLang === 'gu'
            ? 'font-bold text-[#501518] underline underline-offset-4 decoration-[#C59B4B]'
            : 'text-[#614D43] hover:text-[#501518]'
        }`}
      >
        ગુજરાતી
      </button>
      <span className="text-[#C59B4B] mx-1">|</span>
      <button
        type="button"
        onClick={() => handleLanguageChange('en')}
        className={`px-1.5 py-0.5 rounded transition-colors ${
          currentLang === 'en'
            ? 'font-bold text-[#501518] underline underline-offset-4 decoration-[#C59B4B]'
            : 'text-[#614D43] hover:text-[#501518]'
        }`}
      >
        English
      </button>
    </div>
  );
};
