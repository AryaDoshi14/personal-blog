'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// ---------------------------------------------------------------------------
// Rate-limit helper using the rate_limits Postgres table
// (serverless-safe: no in-memory state)
// ---------------------------------------------------------------------------
async function checkRateLimit(key: string, maxAttempts: number, windowSeconds: number) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return true; // allow if not configured

  const windowStart = new Date(Date.now() - windowSeconds * 1000).toISOString();

  // Count recent attempts
  const { count } = await supabase
    .from('rate_limits')
    .select('*', { count: 'exact', head: true })
    .eq('key', key)
    .gte('created_at', windowStart);

  if ((count ?? 0) >= maxAttempts) return false;

  // Record this attempt
  await supabase.from('rate_limits').insert({ key });
  return true;
}

// ---------------------------------------------------------------------------
// PUBLIC SIGNUP
// ---------------------------------------------------------------------------
export async function publicSignUp(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;
  const fullName = (formData.get('full_name') as string)?.trim();
  const honeypot = formData.get('website') as string; // anti-bot

  if (honeypot) {
    // Silently succeed to confuse bots
    return { success: true };
  }

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' };
  }

  // Rate-limit: max 5 signup attempts per email per hour
  const limited = await checkRateLimit(`signup:${email}`, 5, 3600);
  if (!limited) {
    return { error: 'Too many signup attempts. Please try again later.' };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { error: 'Service is unavailable. Please try again later.' };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName || email.split('@')[0] },
      // email confirmation is enabled in the Supabase dashboard;
      // until confirmed, the user cannot log in (Supabase default).
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes('already registered')) {
      return { error: 'An account with this email already exists.' };
    }
    return { error: error.message };
  }

  return { success: true };
}

// ---------------------------------------------------------------------------
// PUBLIC LOGIN
// ---------------------------------------------------------------------------
export async function publicSignIn(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;
  const lang = (formData.get('lang') as string) || 'gu';
  const honeypot = formData.get('website') as string;

  if (honeypot) return { error: 'Invalid request.' };

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  // Rate-limit: max 10 login attempts per email per 15 minutes
  const limited = await checkRateLimit(`login:${email}`, 10, 900);
  if (!limited) {
    return { error: 'Too many login attempts. Please wait 15 minutes and try again.' };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { error: 'Service is unavailable. Please try again later.' };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Generic message to avoid leaking account existence
    return { error: 'Invalid email or password.' };
  }

  revalidatePath(`/${lang}`, 'layout');
  redirect(`/${lang}`);
}

// ---------------------------------------------------------------------------
// PUBLIC LOGOUT
// ---------------------------------------------------------------------------
export async function publicSignOut(lang: string = 'gu') {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  revalidatePath(`/${lang}`, 'layout');
  redirect(`/${lang}`);
}

// ---------------------------------------------------------------------------
// UPDATE DISPLAY NAME
// ---------------------------------------------------------------------------
export async function updateDisplayName(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const fullName = (formData.get('full_name') as string)?.trim();
  if (!fullName || fullName.length < 2) {
    return { error: 'Display name must be at least 2 characters.' };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: 'Service unavailable.' };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be logged in.' };

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/', 'layout');
  return { success: true };
}
