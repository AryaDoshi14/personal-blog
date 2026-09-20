'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  Eye,
  Sparkles,
} from 'lucide-react';
import { Prayer } from '@/types';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { deletePrayer, reorderPrayers } from '@/app/actions/prayers';

interface PrayersListClientProps {
  prayers: Prayer[];
}

export default function PrayersListClient({ prayers: initialPrayers }: PrayersListClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [prayersList, setPrayersList] = useState<Prayer[]>(initialPrayers);
  const [deleteTarget, setDeleteTarget] = useState<Prayer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deletePrayer(deleteTarget.id);
      if (res.success) {
        setDeleteTarget(null);
        router.refresh();
      } else {
        alert(res.error || 'Failed to delete prayer');
      }
    } catch {
      alert('Error deleting prayer');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= prayersList.length) return;

    const newOrder = [...prayersList];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    setPrayersList(newOrder);

    startTransition(async () => {
      const ids = newOrder.map((p) => p.id);
      await reorderPrayers(ids);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gold-primary/30">
        <div>
          <h1 className="font-serif font-bold text-2xl text-maroon-primary">
            પવિત્ર સ્તુતિઓ (Sacred Prayers)
          </h1>
          <p className="text-xs text-maroon-primary/60 mt-0.5">
            નિત્ય પાઠ, સ્તુતિ અને કીર્તન (કુલ {prayersList.length})
          </p>
        </div>

        <Link
          href="/admin/prayers/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-maroon-primary hover:bg-maroon-dark text-cream-base font-semibold text-xs transition-colors border border-gold-primary/40 shadow-sm"
        >
          <Plus className="w-4 h-4 text-gold-light" />
          નવી સ્તુતિ ઉમેરો (New Prayer)
        </Link>
      </div>

      {/* Prayers List */}
      <div className="bg-cream-surface/70 rounded-2xl border border-gold-primary/30 overflow-hidden shadow-xs">
        {prayersList.length === 0 ? (
          <div className="text-center py-12 text-maroon-primary/60 text-xs">
            કોઈ સ્તુતિ મળેલ નથી.
          </div>
        ) : (
          <div className="divide-y divide-gold-primary/15">
            {prayersList.map((prayer, idx) => (
              <div
                key={prayer.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-cream-base/60 transition-colors"
              >
                {/* Reorder Buttons & Index */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0 || isPending}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1 rounded-md text-maroon-primary/60 hover:text-maroon-primary hover:bg-cream-surface disabled:opacity-30 transition-colors"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === prayersList.length - 1 || isPending}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1 rounded-md text-maroon-primary/60 hover:text-maroon-primary hover:bg-cream-surface disabled:opacity-30 transition-colors"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="w-6 h-6 rounded-full bg-cream-surface border border-gold-primary/30 flex items-center justify-center text-xs font-serif font-bold text-maroon-primary">
                    {idx + 1}
                  </span>
                </div>

                {/* Title & Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-gold-primary/15 text-maroon-primary font-medium border border-gold-primary/30 uppercase tracking-wider text-[10px]">
                      {prayer.icon_type}
                    </span>
                    <span className="text-[11px] text-maroon-primary/50 font-mono">
                      /{prayer.slug}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm sm:text-base text-maroon-primary truncate mt-1">
                    {prayer.title_gu}
                  </h3>
                  {prayer.title_en && (
                    <p className="text-xs text-maroon-primary/60 truncate font-sans">
                      {prayer.title_en}
                    </p>
                  )}
                  {prayer.subtitle_gu && (
                    <p className="text-xs text-maroon-primary/70 line-clamp-1 mt-0.5">
                      {prayer.subtitle_gu}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    href={`/gu/prayers/${prayer.slug}`}
                    target="_blank"
                    className="p-2 rounded-xl text-maroon-primary/70 hover:text-maroon-primary hover:bg-cream-surface border border-gold-primary/20 transition-colors"
                    title="View Prayer"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  <Link
                    href={`/admin/prayers/${prayer.id}/edit`}
                    className="p-2 rounded-xl text-maroon-primary/70 hover:text-maroon-primary hover:bg-cream-surface border border-gold-primary/20 transition-colors"
                    title="Edit Prayer"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(prayer)}
                    className="p-2 rounded-xl text-red-600/70 hover:text-red-700 hover:bg-red-50 border border-red-200 transition-colors"
                    title="Delete Prayer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="સ્તુતિ કાઢી નાખો (Delete Prayer)"
        itemName={deleteTarget?.title_gu}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
