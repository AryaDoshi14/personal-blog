'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Language, Profile } from '@/types';
import { publicSignOut } from '@/app/actions/public-auth';
import { User, LogOut, ChevronDown } from 'lucide-react';

interface UserDropdownProps {
  lang: Language;
  profile: Profile;
}

export function UserDropdown({ lang, profile }: UserDropdownProps) {
  const isGu = lang === 'gu';
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = profile.full_name || profile.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        id="user-menu-trigger"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[#F4EDE2] transition-colors group"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {/* Avatar circle */}
        <div className="w-8 h-8 rounded-full bg-[#501518] text-white flex items-center justify-center text-sm font-bold font-serif-gu flex-shrink-0">
          {initial}
        </div>
        <span className="text-sm font-serif-gu font-medium text-[#501518] max-w-[96px] truncate hidden sm:block">
          {displayName}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#C59B4B] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E8DFD3] rounded-2xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          {/* User info */}
          <div className="px-4 py-3 border-b border-[#E8DFD3] bg-[#FAF6F0]">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#C59B4B] flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#501518] font-serif-gu truncate">{displayName}</p>
                <p className="text-xs text-[#614D43] font-serif-gu truncate">{profile.email}</p>
              </div>
            </div>
          </div>

          {/* Sign out */}
          <div className="p-1.5">
            <form
              action={async () => {
                await publicSignOut(lang);
              }}
            >
              <button
                id="user-signout-btn"
                type="submit"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-serif-gu text-[#501518] hover:bg-[#FAF6F0] hover:text-[#C59B4B] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {isGu ? 'બહાર નીકળો' : 'Sign Out'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
