import React from 'react';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { DEFAULT_PRAYERS } from '@/lib/data/defaults';
import PrayerForm from '@/components/admin/PrayerForm';
import { Prayer } from '@/types';

export const metadata = {
  title: 'Edit Sacred Prayer | Admin',
};

interface EditPrayerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPrayerPage({ params }: EditPrayerPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  let prayer: Prayer | null = null;

  if (supabase) {
    const { data, error } = await supabase
      .from('prayers')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!error && data) {
      prayer = data as Prayer;
    }
  }

  // Fallback for default testing
  if (!prayer) {
    prayer = DEFAULT_PRAYERS.find((p) => p.id === id) || null;
  }

  if (!prayer) {
    notFound();
  }

  return <PrayerForm initialData={prayer} />;
}
