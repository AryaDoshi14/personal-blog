import React from 'react';
import { getPrayers } from '@/lib/db';
import PrayersListClient from '@/components/admin/PrayersListClient';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Sacred Prayers Management | Admin',
};

export default async function AdminPrayersPage() {
  const prayers = await getPrayers();

  return <PrayersListClient prayers={prayers} />;
}
