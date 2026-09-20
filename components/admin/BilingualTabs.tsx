'use client';

import React from 'react';

interface BilingualTabsProps {
  activeTab: 'gu' | 'en';
  onTabChange: (tab: 'gu' | 'en') => void;
  guLabel?: string;
  enLabel?: string;
  guRequired?: boolean;
  enOptional?: boolean;
}

export default function BilingualTabs({
  activeTab,
  onTabChange,
  guLabel = 'ગુજરાતી (મુખ્ય ભાષા)',
  enLabel = 'English (Optional)',
  guRequired = true,
  enOptional = true,
}: BilingualTabsProps) {
  return (
    <div className="flex border-b border-gold-primary/30 gap-2 mb-6 bg-cream-surface/60 p-1.5 rounded-t-xl">
      <button
        type="button"
        onClick={() => onTabChange('gu')}
        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
          activeTab === 'gu'
            ? 'bg-maroon-primary text-cream-base shadow-sm'
            : 'text-maroon-primary/70 hover:text-maroon-primary hover:bg-cream-surface'
        }`}
      >
        <span className="font-serif">{guLabel}</span>
        {guRequired && (
          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
            જરૂરી
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={() => onTabChange('en')}
        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
          activeTab === 'en'
            ? 'bg-maroon-primary text-cream-base shadow-sm'
            : 'text-maroon-primary/70 hover:text-maroon-primary hover:bg-cream-surface'
        }`}
      >
        <span>{enLabel}</span>
        {enOptional && (
          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-cream-surface text-maroon-primary/60 border border-gold-primary/20">
            Optional
          </span>
        )}
      </button>
    </div>
  );
}
