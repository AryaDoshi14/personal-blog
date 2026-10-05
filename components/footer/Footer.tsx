import React from 'react';
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import { OrnamentalDivider } from '@/components/ui/OrnamentalDivider';
import { Language, SiteSettings } from '@/types';

interface FooterProps {
  settings: SiteSettings;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ settings, lang }) => {
  const isGu = lang === 'gu';
  const tagline = isGu ? settings.site_tagline_gu : settings.site_tagline_en;
  const copyright = isGu ? settings.footer_copyright_gu : settings.footer_copyright_en;

  const quickLinks = [
    { href: `/${lang}`, labelGu: 'મુખ્ય પાનું', labelEn: 'Home' },
    { href: `/${lang}/prayers`, labelGu: 'પ્રાર્થનાઓ', labelEn: 'Prayers' },
    { href: `/${lang}/tradition`, labelGu: 'અમારી પરંપરા', labelEn: 'Our Tradition' },
    { href: `/${lang}/blog`, labelGu: 'મારા લેખો', labelEn: 'My Articles' },
    { href: `/${lang}/contact`, labelGu: 'સંપર્ક', labelEn: 'Contact' },
  ];

  return (
    <footer className="relative bg-[#501518] text-white pt-12 sm:pt-16 pb-8 border-t-4 border-[#C59B4B]">
      {/* Subtle traditional top pattern decoration */}
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#C59B4B] via-[#D4AF37] to-[#C59B4B] opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Contact */}
          <div className="md:col-span-4 text-center md:text-left">
            <h4 className="text-lg font-bold font-serif-gu text-[#D4AF37] tracking-wider mb-4">
              {isGu ? 'સંપર્ક' : 'Contact'}
            </h4>
            <ul className="space-y-3 text-sm text-[#F4EDE2]/90 font-serif-gu">
              <li className="flex items-center justify-center md:justify-start gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {settings.contact_email}
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <a
                  href={`tel:${settings.contact_phone.replace(/\s+/g, '')}`}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {settings.contact_phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Center Column: Tagline Quote & Social Links */}
          <div className="md:col-span-4 text-center flex flex-col items-center">
            <p className="text-lg sm:text-xl font-serif-gu font-medium text-[#F4EDE2] tracking-wide mb-2 italic">
              &ldquo;{tagline}&rdquo;
            </p>

            <OrnamentalDivider variant="gold" className="my-1" />

            {/* Social Icons matching reference */}
            <div className="flex items-center gap-3 mt-4">
              {/* Facebook */}
              {settings.social_facebook && (
                <a
                  href={settings.social_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-[#6B1D23] border border-[#C59B4B]/60 flex items-center justify-center text-[#F4EDE2] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {/* Instagram */}
              {settings.social_instagram && (
                <a
                  href={settings.social_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-[#6B1D23] border border-[#C59B4B]/60 flex items-center justify-center text-[#F4EDE2] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Quick Links */}
          <div className="md:col-span-4 text-center md:text-right">
            <h4 className="text-lg font-bold font-serif-gu text-[#D4AF37] tracking-wider mb-4">
              {isGu ? 'ઉપયોગી લિંક્સ' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-sm text-[#F4EDE2]/90 font-serif-gu">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#D4AF37] transition-colors inline-block py-0.5"
                  >
                    {isGu ? link.labelGu : link.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-[#6B1D23] text-center">
          <p className="text-xs sm:text-sm text-[#F4EDE2]/70 font-serif-gu">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};
