import React from 'react';
import { notFound } from 'next/navigation';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PrayerCard } from '@/components/prayers/PrayerCard';
import { getPrayers } from '@/lib/db';
import { Language } from '@/types';

interface PrayersPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function PrayersPage({ params }: PrayersPageProps) {
  const { lang } = await params;

  if (lang !== 'gu' && lang !== 'en') {
    notFound();
  }

  const validLang = lang as Language;
  const isGu = validLang === 'gu';
  const prayers = await getPrayers();

  return (
    <div className="py-12 sm:py-16 bg-[#FAF6F0] min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={isGu ? 'પવિત્ર પ્રાર્થનાઓ' : 'Sacred Prayers'}
          subtitle={
            isGu
              ? 'નિત્ય નિયમ, સ્તોત્ર અને શ્રીજી બાવાની પાવન સ્તુતિઓનો સંગ્રહ'
              : 'A sacred treasury of daily hymns, stotras, and devotional chants for Shreeji Baba'
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {prayers.map((prayer) => (
            <PrayerCard key={prayer.id} prayer={prayer} lang={validLang} />
          ))}
        </div>
      </div>
    </div>
  );
}
