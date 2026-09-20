import React from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import MessagesListClient from '@/components/admin/MessagesListClient';
import { ContactMessage } from '@/types';

export const metadata = {
  title: 'Contact Messages | Admin',
};

export default async function AdminMessagesPage() {
  const supabase = await createServerSupabaseClient();
  let messages: ContactMessage[] = [];

  if (supabase) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      messages = data as ContactMessage[];
    }
  }

  return <MessagesListClient messages={messages} />;
}
