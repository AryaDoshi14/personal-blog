'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Language, Profile } from '@/types';
import { UserDropdown } from './UserDropdown';
import { LayoutDashboard } from 'lucide-react';

interface HeaderAuthWidgetProps {
  lang: Language;
}

/**
 * Client component that checks the viewer session in the browser after mount.
 * Keeps server rendering of public layouts 100% static and cookie-free.
 */
export function HeaderAuthWidget({ lang }: HeaderAuthWidgetProps) {
  const isGu = lang === 'gu';
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      return;
    }

    let isMounted = true;

    async function loadUser() {
      try {
        const { data: { user } } = await supabase!.auth.getUser();
        if (user && isMounted) {
          const { data } = await supabase!
            .from('profiles')
            .select('id, role, full_name, email, avatar_url, created_at, updated_at')
            .eq('id', user.id)
            .maybeSingle();
          if (isMounted) {
            setProfile((data as Profile) || null);
          }
        } else if (isMounted) {
          setProfile(null);
        }
      } catch {
        if (isMounted) setProfile(null);
      } finally {
        if (isMounted) setIsLoaded(true);
      }
    }

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUser();
      } else if (isMounted) {
        setProfile(null);
        setIsLoaded(true);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!isLoaded || !profile) {
    return <GuestLinks lang={lang} isGu={isGu} />;
  }

  // Admins get a quick link to the admin panel on desktop
  if (profile.role === 'admin') {
    return (
      <Link
        href="/admin"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-serif-gu font-semibold bg-[#501518] text-white hover:bg-[#6B1D23] focus:outline-none focus:ring-2 focus:ring-[#C59B4B] transition-colors shadow-xs"
      >
        <LayoutDashboard className="w-4 h-4" />
        {isGu ? 'એડ્મિન પેનલ' : 'Admin Panel'}
      </Link>
    );
  }

  return <UserDropdown lang={lang} profile={profile} />;
}

function GuestLinks({ lang, isGu }: { lang: Language; isGu: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/${lang}/auth/login`}
        className="px-3 py-1.5 rounded-lg text-sm font-serif-gu font-medium text-[#501518] hover:text-[#C59B4B] focus:outline-none focus:ring-2 focus:ring-[#C59B4B] transition-colors border border-transparent hover:border-[#C59B4B]/40"
      >
        {isGu ? 'લૉગિન' : 'Login'}
      </Link>
      <Link
        href={`/${lang}/auth/signup`}
        className="px-3 py-1.5 rounded-lg text-sm font-serif-gu font-semibold bg-[#501518] text-white hover:bg-[#6B1D23] focus:outline-none focus:ring-2 focus:ring-[#C59B4B] transition-colors shadow-xs"
      >
        {isGu ? 'સાઇન અપ' : 'Sign Up'}
      </Link>
    </div>
  );
}
