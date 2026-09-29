'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  title: string;
  itemName?: string;
  message?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmDialog({
  isOpen,
  title,
  itemName,
  message = 'આ ક્રિયા પાછી ખેંચી શકાશે નહીં. શું તમે ખરેખર તેને કાયમ માટે કાઢી નાખવા માંગો છો?',
  isDeleting = false,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md bg-cream-base rounded-2xl border border-gold-primary/40 shadow-2xl p-6 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-maroon-primary to-gold-primary" />

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0 border border-red-200 text-red-700">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-serif font-bold text-maroon-primary">{title}</h3>
            {itemName && (
              <p className="text-sm font-medium text-maroon-primary/90 mt-1 line-clamp-2 bg-cream-surface/70 px-2 py-1 rounded border border-gold-primary/20">
                &ldquo;{itemName}&rdquo;
              </p>
            )}
            <p className="text-xs text-maroon-primary/70 mt-2 leading-relaxed">{message}</p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="text-maroon-primary/50 hover:text-maroon-primary p-1 rounded-lg hover:bg-cream-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gold-primary/20">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-maroon-primary/80 bg-cream-surface hover:bg-cream-surface/80 border border-gold-primary/30 rounded-xl transition-colors disabled:opacity-50"
          >
            રદ કરો (Cancel)
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 rounded-xl shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? 'કાઢી રહ્યા છીએ...' : 'હા, કાઢી નાખો (Delete)'}
          </button>
        </div>
      </div>
    </div>
  );
}
