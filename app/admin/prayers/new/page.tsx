import React from 'react';
import PrayerForm from '@/components/admin/PrayerForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'New Sacred Prayer | Admin',
};

export default function NewPrayerPage() {
  return <PrayerForm />;
}
