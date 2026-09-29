import React from 'react';
import Link from 'next/link';
import { getCurrentViewer } from '@/lib/supabase/viewer';
import { Language, Profile } from '@/types';
import { UserDropdown } from './UserDropdown';
import { LayoutDashboard } from 'lucide-react';


interface HeaderAuthWidgetProps {
  lang: Language;
  profile?: Profile | null;
}

/**
 * Server component that reads the current session and renders either:
 * - A "Login / Sign up" link pair (unauthenticated)
 * - An "Admin Panel" link (admin user)
 * - A user avatar + name dropdown (authenticated viewer)
 */
export async function HeaderAuthWidget({ lang, profile: passedProfile }: HeaderAuthWidgetProps) {
  const isGu = lang === 'gu';
  let profile = passedProfile;

  if (profile === undefined) {
    const viewer = await getCurrentViewer();
    profile = viewer.profile;
  }

  // Unauthenticated visitor
  if (!profile) {
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

