'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/admin-guard';

export async function toggleMessageRead(
  id: string,
  isRead: boolean
): Promise<{ success: boolean; error?: string }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError || !supabase) {
    return { success: false, error: authError || 'Admin authorization required' };
  }

  const { error } = await supabase
    .from('messages')
    .update({ is_read: isRead })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/messages');

  return { success: true };
}

export async function deleteMessage(id: string): Promise<{ success: boolean; error?: string }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError || !supabase) {
    return { success: false, error: authError || 'Admin authorization required' };
  }

  const { error } = await supabase.from('messages').delete().eq('id', id);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/messages');

  return { success: true };
}
