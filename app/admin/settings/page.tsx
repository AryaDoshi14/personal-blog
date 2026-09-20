import React from 'react';
import { getSiteSettings } from '@/lib/db';
import SettingsForm from '@/components/admin/SettingsForm';

export const metadata = {
  title: 'Site Settings | Admin',
};

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return <SettingsForm initialSettings={settings} />;
}
