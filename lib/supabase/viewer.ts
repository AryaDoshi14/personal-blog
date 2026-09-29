import { cache } from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Profile } from '@/types';

export interface CurrentViewer {
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}

/**
 * Request-cached helper to fetch authenticated viewer & profile once per request.
 * Prevents redundant auth.getUser() calls between Layout, Header, and HeaderAuthWidget.
 */
export const getCurrentViewer = cache(async (): Promise<CurrentViewer> => {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return { user: null, profile: null };
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { user: null, profile: null };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, full_name, email, avatar_url, created_at, updated_at')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile:', profileError.message);
    }

    return {
      user: { id: user.id, email: user.email },
      profile: (profile as Profile) || null,
    };
  } catch (err) {
    console.error('Unexpected error in getCurrentViewer:', err);
    return { user: null, profile: null };
  }
});
