import React from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PrayerCard } from './PrayerCard';
import { Language, Prayer } from '@/types';

interface PrayerSectionProps {
  prayers: Prayer[];
  lang: Language;
}

export const PrayerSection: React.FC<PrayerSectionProps> = ({ prayers, lang }) => {
  const isGu = lang === 'gu';
  const title = isGu ? 'પવિત્ર પ્રાર્થનાઓ' : 'Sacred Prayers';
  const subtitle = isGu
    ? 'શ્રીજી બાવાના ચરણોમાં નિત્ય સ્મરણ અને મંગલ આરાધના'
    : 'Daily sacred prayers and devotional hymns at the lotus feet of Shreeji';

  return (
    <section id="prayers" className="py-12 sm:py-16 bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prayers.map((prayer) => (
            <PrayerCard key={prayer.id} prayer={prayer} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
};
