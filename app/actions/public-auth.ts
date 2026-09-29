'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { checkRateLimit } from '@/lib/supabase/rate-limit';

/** Allowed locale segments — guards against open-redirect via the lang param. */
const VALID_LANGS = new Set(['gu', 'en']);
function safeLang(raw: string | null | undefined): 'gu' | 'en' {
  const l = (raw ?? '').trim().toLowerCase();
  return VALID_LANGS.has(l) ? (l as 'gu' | 'en') : 'gu';
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
  const allowed = await checkRateLimit(`signup:${email}`, 5, 3600);
  if (!allowed) {
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
  const lang = safeLang(formData.get('lang') as string);
  const honeypot = formData.get('website') as string;

  if (honeypot) return { error: 'Invalid request.' };

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  // Rate-limit: max 10 login attempts per email per 15 minutes
  const allowed = await checkRateLimit(`login:${email}`, 10, 900);
  if (!allowed) {
    return { error: 'Too many login attempts. Please wait 15 minutes and try again.' };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { error: 'Service is unavailable. Please try again later.' };
  }

  const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Generic message to avoid leaking account existence
    return { error: 'Invalid email or password.' };
  }

  // Check if the signed-in user is an admin
  if (signInData?.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', signInData.user.id)
      .single();

    if (profile?.role === 'admin') {
      // Don't redirect — let the client show the admin/normal-page choice popup
      revalidatePath(`/${lang}`, 'layout');
      return { isAdmin: true, lang };
    }
  }

  revalidatePath(`/${lang}`, 'layout');
  redirect(`/${lang}`);
}

// ---------------------------------------------------------------------------
// PUBLIC LOGOUT
// ---------------------------------------------------------------------------
export async function publicSignOut(lang: string = 'gu') {
  const safeLangValue = safeLang(lang);
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  revalidatePath(`/${safeLangValue}`, 'layout');
  redirect(`/${safeLangValue}`);
}

// ---------------------------------------------------------------------------
// PASSWORD RESET – REQUEST EMAIL
// ---------------------------------------------------------------------------
export async function requestPasswordReset(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const lang = safeLang(formData.get('lang') as string);

  if (!email) return { error: 'Email is required.' };

  // Rate-limit: max 3 reset requests per email per hour
  const allowed = await checkRateLimit(`reset:${email}`, 3, 3600);
  if (!allowed) {
    return { error: 'Too many reset attempts. Please wait an hour and try again.' };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: 'Service is unavailable. Please try again later.' };

  const redirectUrl =
    process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/auth/reset-password`
      : `http://localhost:3000/${lang}/auth/reset-password`;

  // Supabase silently succeeds even for unknown emails (security best practice)
  await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl });

  return { success: true };
}

// ---------------------------------------------------------------------------
// PASSWORD RESET – SET NEW PASSWORD
// ---------------------------------------------------------------------------
export async function updatePassword(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const password = formData.get('password') as string;
  const confirm = formData.get('confirm_password') as string;

  if (!password || password.length < 8) {
    return { error: 'Password must be at least 8 characters.' };
  }
  if (password !== confirm) {
    return { error: 'Passwords do not match.' };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: 'Service is unavailable.' };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  return { success: true };
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
