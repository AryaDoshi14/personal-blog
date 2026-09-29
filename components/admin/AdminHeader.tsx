'use client';

import React from 'react';
import { Menu, ShieldCheck } from 'lucide-react';

interface AdminHeaderProps {
  onMenuClick: () => void;
  title?: string;
  subtitle?: string;
  userEmail?: string;
}

export default function AdminHeader({
  onMenuClick,
  title = 'શ્રીજી બાબા એડમિન પોર્ટલ',
  subtitle,
  userEmail,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-cream-base/95 backdrop-blur-xs border-b border-gold-primary/30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-maroon-primary hover:bg-cream-surface border border-gold-primary/30 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="font-serif font-bold text-base sm:text-lg text-maroon-primary leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-maroon-primary/60 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Admin Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream-surface border border-gold-primary/30 text-xs font-semibold text-maroon-primary">
          <ShieldCheck className="w-4 h-4 text-gold-primary" />
          <span className="hidden sm:inline">પ્રબંધક (Admin)</span>
          {userEmail && (
            <span className="hidden md:inline text-maroon-primary/60 font-normal">
              • {userEmail}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
