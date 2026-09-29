'use client';

import React, { useState } from 'react';
import { Share2, Link2, Check } from 'lucide-react';
import { Language } from '@/types';

interface ShareButtonsProps {
  title: string;
  url: string;
  lang: Language;
}

export function ShareButtons({ title, url, lang }: ShareButtonsProps) {
  const isGu = lang === 'gu';
  const [copied, setCopied] = useState(false);

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url, text: title });
        return;
      } catch {
        // User cancelled or share failed — fall through to copy
      }
    }
    await handleCopy();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;

  return (
    <div className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleNativeShare}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E8DFD3] bg-[#FAF6F0] text-[#501518] text-sm font-serif-gu hover:border-[#C59B4B] transition-colors cursor-pointer"
      >
        <Share2 className="w-4 h-4 text-[#C59B4B]" />
        {isGu ? 'શેર કરો' : 'Share'}
      </button>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E8DFD3] bg-[#FAF6F0] text-[#501518] text-sm font-serif-gu hover:border-[#C59B4B] transition-colors"
      >
        WhatsApp
      </a>

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E8DFD3] bg-[#FAF6F0] text-[#501518] text-sm font-serif-gu hover:border-[#C59B4B] transition-colors cursor-pointer"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-700" />
        ) : (
          <Link2 className="w-4 h-4 text-[#C59B4B]" />
        )}
        {copied
          ? isGu
            ? 'કૉપિ થયું'
            : 'Copied'
          : isGu
            ? 'લિંક કૉપિ'
            : 'Copy link'}
      </button>
    </div>
  );
}
