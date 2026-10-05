import { createClient } from '@supabase/supabase-js';

/**
 * Public Supabase client using anon key without session/cookies.
 * Used for public read queries during static prerendering and ISR.
 * Respects RLS policies (e.g. only published posts and public data).
 */
export function createPublicSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
