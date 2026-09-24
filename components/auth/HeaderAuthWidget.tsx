'use server';

import React from 'react';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Language, Profile } from '@/types';
import { UserDropdown } from './UserDropdown';

interface HeaderAuthWidgetProps {
  lang: Language;
}

/**
 * Server component that reads the current session and renders either:
 * - A "Login / Sign up" link pair (unauthenticated)
 * - A user avatar + name dropdown (authenticated viewer)
 *
 * Admin users are handled by /admin; they won't see this widget in that context.
 */
export async function HeaderAuthWidget({ lang }: HeaderAuthWidgetProps) {
  const isGu = lang === 'gu';
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return <GuestLinks lang={lang} isGu={isGu} />;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <GuestLinks lang={lang} isGu={isGu} />;
  }

  // Fetch profile — non-admin users are the target here
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, full_name, email, avatar_url, created_at, updated_at')
    .eq('id', user.id)
    .single<Profile>();

  // Admins use /admin; don't clutter the public header with their account
  if (!profile || profile.role === 'admin') {
    return null;
  }

  return <UserDropdown lang={lang} profile={profile} />;
}

function GuestLinks({ lang, isGu }: { lang: Language; isGu: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/${lang}/auth/login`}
        className="px-3 py-1.5 rounded-lg text-sm font-serif-gu font-medium text-[#501518] hover:text-[#C59B4B] transition-colors border border-transparent hover:border-[#C59B4B]/40"
      >
        {isGu ? 'પ્રવેશ' : 'Login'}
      </Link>
      <Link
        href={`/${lang}/auth/signup`}
        className="px-3 py-1.5 rounded-lg text-sm font-serif-gu font-semibold bg-[#501518] text-white hover:bg-[#6B1D23] transition-colors shadow-xs"
      >
        {isGu ? 'નોંધણી' : 'Sign Up'}
      </Link>
    </div>
  );
}
