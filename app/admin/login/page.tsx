'use client';

import React, { useActionState } from 'react';
import { loginWithEmail } from '@/app/actions/auth';
import { Lock, Mail, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginWithEmail, null);

  return (
    <div className="min-h-screen bg-cream-base flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Subtle Motifs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-maroon-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Return to website link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-medium text-maroon-primary/70 hover:text-maroon-primary transition-colors bg-cream-surface/70 px-3 py-1.5 rounded-full border border-gold-primary/20"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        વેબસાઇટ પર પાછા જાઓ
      </Link>

      <div className="w-full max-w-md bg-cream-surface/90 border border-gold-primary/40 rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-xs">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-12 right-12 h-1 bg-gradient-to-r from-gold-primary/20 via-gold-primary to-gold-primary/20 rounded-b-full" />

        {/* Brand Icon & Heading */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-maroon-primary text-gold-light flex items-center justify-center border border-gold-primary/50 shadow-md shadow-maroon-primary/20">
            <Sparkles className="w-8 h-8" />
          </div>

          <span className="text-xs font-serif tracking-widest text-gold-primary uppercase font-semibold">
            || શ્રી કૃષ્ણ શરણં મમ: ||
          </span>
          <h1 className="font-serif font-bold text-2xl text-maroon-primary mt-1">
            પ્રબંધક પ્રવેશ
          </h1>
          <p className="text-xs text-maroon-primary/70 mt-1">
            Admin Management Portal
          </p>
        </div>

        {/* Error Alert */}
        {state?.error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Login Form */}
        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1.5">
              ઇમેઇલ સરનામું (Admin Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-maroon-primary/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="admin@example.com"
                className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary placeholder:text-maroon-primary/40 focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1.5">
              પાસવર્ડ (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-maroon-primary/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary placeholder:text-maroon-primary/40 focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 py-3 px-4 bg-maroon-primary hover:bg-maroon-dark text-cream-base font-serif font-semibold text-sm rounded-xl border border-gold-primary/50 shadow-md shadow-maroon-primary/20 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isPending ? (
              <span>ચકાસણી ચાલુ છે...</span>
            ) : (
              <span>પ્રવેશ કરો (Sign In)</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-gold-primary/20 text-center">
          <p className="text-[11px] text-maroon-primary/60">
            સુરક્ષિત પ્રબંધક પેનલ • અધિકૃત વ્યક્તિઓ માટે જ ઉપલબ્ધ
          </p>
        </div>
      </div>
    </div>
  );
}
