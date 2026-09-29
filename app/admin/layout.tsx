import React from 'react';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import AdminShell from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Admin Control Panel | શ્રીજી બાબા',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  let userEmail: string | undefined;

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email;
  }

  return <AdminShell userEmail={userEmail}>{children}</AdminShell>;
}
