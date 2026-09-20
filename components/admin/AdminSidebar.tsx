'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Settings,
  Mail,
  ExternalLink,
  LogOut,
  X,
} from 'lucide-react';
import { logout } from '@/app/actions/auth';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  {
    href: '/admin',
    exact: true,
    labelGu: 'ડેશબોર્ડ',
    labelEn: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/posts',
    exact: false,
    labelGu: 'બ્લોગ લેખો',
    labelEn: 'Posts & Blogs',
    icon: FileText,
  },
  {
    href: '/admin/prayers',
    exact: false,
    labelGu: 'નિત્ય સ્તુતિઓ',
    labelEn: 'Sacred Prayers',
    icon: Sparkles,
  },
  {
    href: '/admin/settings',
    exact: false,
    labelGu: 'સાઇટ સેટિંગ્સ',
    labelEn: 'Site Settings',
    icon: Settings,
  },
  {
    href: '/admin/messages',
    exact: false,
    labelGu: 'સંદેશાઓ',
    labelEn: 'Contact Messages',
    icon: Mail,
  },
];

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-maroon-primary text-cream-base border-r border-gold-primary/30 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-gold-primary/20 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-primary/20 border border-gold-primary flex items-center justify-center text-gold-light">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-base text-cream-base leading-tight">
                શ્રીજી બાબા એડમિન
              </h1>
              <p className="text-[11px] text-gold-light/80 tracking-wide font-sans">
                Admin Control Panel
              </p>
            </div>
          </Link>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-cream-base/70 hover:text-cream-base hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gold-primary text-maroon-primary font-semibold shadow-md shadow-black/10'
                    : 'text-cream-base/80 hover:bg-white/10 hover:text-cream-base'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-maroon-primary' : 'text-gold-light'}`} />
                <div className="flex flex-col">
                  <span className="font-serif leading-none">{item.labelGu}</span>
                  <span className="text-[11px] opacity-75 font-sans leading-none mt-1">
                    {item.labelEn}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gold-primary/20 space-y-2">
          {/* Public site link */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-medium text-cream-base/80 bg-white/5 hover:bg-white/10 border border-gold-primary/20 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-gold-light" />
              વેબસાઇટ જુઓ (View Site)
            </span>
          </Link>

          {/* Logout button */}
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-red-200 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 transition-colors"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              લૉગ આઉટ (Sign Out)
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
