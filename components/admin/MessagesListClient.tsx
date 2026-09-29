'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail,
  MailOpen,
  Trash2,
  Search,
  X,
} from 'lucide-react';
import { ContactMessage } from '@/types';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { toggleMessageRead, deleteMessage } from '@/app/actions/messages';

interface MessagesListClientProps {
  messages: ContactMessage[];
}

export default function MessagesListClient({
  messages: initialMessages,
}: MessagesListClientProps) {
  const router = useRouter();
  const [_isPending, startTransition] = useTransition();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = initialMessages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase()) ||
      (msg.subject && msg.subject.toLowerCase().includes(search.toLowerCase())) ||
      msg.message.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'unread'
        ? !msg.is_read
        : msg.is_read;

    return matchesSearch && matchesFilter;
  });

  const handleToggleRead = (msg: ContactMessage) => {
    startTransition(async () => {
      const nextState = !msg.is_read;
      await toggleMessageRead(msg.id, nextState);
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, is_read: nextState });
      }
      router.refresh();
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteMessage(deleteTarget.id);
      if (res.success) {
        if (selectedMessage?.id === deleteTarget.id) {
          setSelectedMessage(null);
        }
        setDeleteTarget(null);
        router.refresh();
      } else {
        alert(res.error || 'Failed to delete message');
      }
    } catch {
      alert('Error deleting message');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gold-primary/30">
        <div>
          <h1 className="font-serif font-bold text-2xl text-maroon-primary">
            સંપર્ક સંદેશાઓ (Contact Messages)
          </h1>
          <p className="text-xs text-maroon-primary/60 mt-0.5">
            વેબસાઇટના સંપર્ક ફોર્મ દ્વારા મોકલાયેલા સંદેશાઓ (કુલ {initialMessages.length})
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-cream-surface/70 p-3 rounded-2xl border border-gold-primary/30">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-maroon-primary/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="નામ, ઇમેઇલ અથવા વિષય દ્વારા શોધો..."
            className="w-full text-xs pl-10 pr-4 py-2 rounded-xl bg-cream-base border border-gold-primary/30 text-maroon-primary placeholder:text-maroon-primary/40 focus:outline-none focus:ring-1 focus:ring-gold-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
            className="text-xs px-3 py-2 rounded-xl bg-cream-base border border-gold-primary/30 text-maroon-primary focus:outline-none focus:ring-1 focus:ring-gold-primary w-full sm:w-auto"
          >
            <option value="all">બધા સંદેશા (All)</option>
            <option value="unread">ન વાંચેલા (Unread)</option>
            <option value="read">વાંચેલા (Read)</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-cream-surface/70 rounded-2xl border border-gold-primary/30 overflow-hidden shadow-xs">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-maroon-primary/60 text-xs">
            કોઈ સંદેશા મળ્યા નથી.
          </div>
        ) : (
          <div className="divide-y divide-gold-primary/15">
            {filtered.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  msg.is_read
                    ? 'hover:bg-cream-base/50 opacity-80'
                    : 'bg-gold-primary/5 hover:bg-gold-primary/10 font-medium'
                }`}
              >
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => setSelectedMessage(msg)}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        msg.is_read
                          ? 'bg-cream-surface text-maroon-primary/60 border border-gold-primary/20'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {msg.is_read ? (
                        <>
                          <MailOpen className="w-3 h-3" /> વંચાઈ ગયું
                        </>
                      ) : (
                        <>
                          <Mail className="w-3 h-3" /> નવો સંદેશ
                        </>
                      )}
                    </span>

                    <span className="text-[11px] text-maroon-primary/50">
                      {new Date(msg.created_at).toLocaleDateString('gu-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-maroon-primary mt-1">
                    {msg.name}{' '}
                    <span className="text-xs font-sans font-normal text-maroon-primary/60">
                      ({msg.email})
                    </span>
                  </h3>

                  {msg.subject && (
                    <p className="text-xs text-maroon-primary/80 mt-0.5 line-clamp-1">
                      વિષય: {msg.subject}
                    </p>
                  )}

                  <p className="text-xs text-maroon-primary/70 line-clamp-2 mt-1">
                    {msg.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleRead(msg)}
                    className="p-2 rounded-xl text-maroon-primary/70 hover:text-maroon-primary hover:bg-cream-surface border border-gold-primary/20 transition-colors"
                    title={msg.is_read ? 'ન વાંચેલું તરીકે ચિહ્નિત કરો' : 'વાંચેલું તરીકે ચિહ્નિત કરો'}
                  >
                    {msg.is_read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(msg)}
                    className="p-2 rounded-xl text-red-600/70 hover:text-red-700 hover:bg-red-50 border border-red-200 transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-cream-base rounded-2xl border border-gold-primary/40 shadow-2xl p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-gold-primary/20 pb-3">
              <h3 className="font-serif font-bold text-maroon-primary text-base">
                સંદેશ વિગત (Message Details)
              </h3>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="text-maroon-primary/50 hover:text-maroon-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-maroon-primary">
              <div className="grid grid-cols-2 gap-2 bg-cream-surface p-3 rounded-xl border border-gold-primary/20">
                <div>
                  <span className="text-maroon-primary/60 block">નામ (Name):</span>
                  <span className="font-semibold">{selectedMessage.name}</span>
                </div>
                <div>
                  <span className="text-maroon-primary/60 block">ઇમેઇલ (Email):</span>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="font-semibold text-gold-primary hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <span className="text-maroon-primary/60 block">ફોન (Phone):</span>
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="font-semibold text-gold-primary hover:underline"
                    >
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
                <div>
                  <span className="text-maroon-primary/60 block">તારીખ (Date):</span>
                  <span>{new Date(selectedMessage.created_at).toLocaleString('gu-IN')}</span>
                </div>
              </div>

              {selectedMessage.subject && (
                <div>
                  <span className="font-semibold block mb-0.5">વિષય (Subject):</span>
                  <div className="bg-cream-surface/70 p-2.5 rounded-lg border border-gold-primary/20">
                    {selectedMessage.subject}
                  </div>
                </div>
              )}

              <div>
                <span className="font-semibold block mb-0.5">સંદેશ (Message):</span>
                <div className="bg-cream-surface/70 p-3.5 rounded-lg border border-gold-primary/20 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gold-primary/20">
              <button
                type="button"
                onClick={() => handleToggleRead(selectedMessage)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-cream-surface border border-gold-primary/30 text-maroon-primary"
              >
                {selectedMessage.is_read ? 'Mark as Unread' : 'Mark as Read'}
              </button>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-1.5 text-xs font-semibold text-cream-base bg-maroon-primary rounded-lg"
              >
                બંધ કરો (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="સંદેશ કાઢી નાખો (Delete Message)"
        itemName={`${deleteTarget?.name} તરફથી સંદેશ`}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
