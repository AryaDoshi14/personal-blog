'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { checkRateLimit } from '@/lib/supabase/rate-limit';

export async function loginWithEmail(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  // Rate-limit: max 10 login attempts per email per 15 minutes
  const allowed = await checkRateLimit(`admin-login:${email}`, 10, 900);
  if (!allowed) {
    return { error: 'Too many login attempts. Please wait 15 minutes and try again.' };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { error: 'Supabase is not configured. Set your environment variables.' };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'Invalid email or password.' };
  }

  // Check if user has admin role
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      await supabase.auth.signOut();
      return { error: 'You do not have admin access.' };
    }
  }

  revalidatePath('/admin', 'layout');
  redirect('/admin');
}

export async function logout() {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  revalidatePath('/admin', 'layout');
  redirect('/admin/login');
}
