import React from 'react';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Post } from '@/types';
import {
  FileText,
  Sparkles,
  Mail,
  Plus,
  ArrowRight,
  Eye,
  Edit,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();

  let postCount = 0;
  let publishedPostCount = 0;
  let draftPostCount = 0;
  let prayerCount = 0;
  let messageCount = 0;
  let unreadMessageCount = 0;
  let recentPosts: Pick<Post, 'id' | 'title_gu' | 'title_en' | 'status' | 'slug' | 'published_at' | 'updated_at'>[] = [];

  if (supabase) {
    try {
      const [
        postsRes,
        publishedRes,
        prayersRes,
        messagesRes,
        unreadRes,
        recentPostsRes,
      ] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('prayers').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('posts').select('id, title_gu, title_en, status, slug, published_at, updated_at').order('created_at', { ascending: false }).limit(5),
      ]);

      postCount = postsRes.count || 0;
      publishedPostCount = publishedRes.count || 0;
      draftPostCount = Math.max(0, postCount - publishedPostCount);
      prayerCount = prayersRes.count || 0;
      messageCount = messagesRes.count || 0;
      unreadMessageCount = unreadRes.count || 0;
      recentPosts = recentPostsRes.data || [];
    } catch (err) {
      console.error('Error fetching dashboard counts:', err);
    }
  }

  const statCards = [
    {
      titleGu: 'કુલ બ્લોગ લેખો',
      titleEn: 'Total Posts',
      value: postCount,
      subtext: `${publishedPostCount} પ્રકાશિત • ${draftPostCount} ડ્રાફ્ટ`,
      icon: FileText,
      href: '/admin/posts',
      color: 'text-maroon-primary',
      bg: 'bg-maroon-primary/5 border-maroon-primary/20',
    },
    {
      titleGu: 'પવિત્ર સ્તુતિઓ',
      titleEn: 'Sacred Prayers',
      value: prayerCount,
      subtext: 'નિત્ય પાઠ અને કીર્તન',
      icon: Sparkles,
      href: '/admin/prayers',
      color: 'text-gold-primary',
      bg: 'bg-gold-primary/10 border-gold-primary/30',
    },
    {
      titleGu: 'સંપર્ક સંદેશાઓ',
      titleEn: 'Contact Messages',
      value: messageCount,
      subtext: unreadMessageCount > 0 ? `${unreadMessageCount} નવા ન વાંચેલા સંદેશા` : 'બધા વંચાઈ ગયા છે',
      icon: Mail,
      href: '/admin/messages',
      color: unreadMessageCount > 0 ? 'text-amber-600' : 'text-emerald-600',
      bg: unreadMessageCount > 0 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-maroon-primary via-maroon-dark to-maroon-primary rounded-3xl p-6 sm:p-8 text-cream-base border border-gold-primary/40 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-gold-primary/20 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-serif tracking-widest text-gold-light uppercase font-semibold">
            || શ્રી કૃષ્ણ શરણં મમ: ||
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold mt-1 text-cream-base">
            જય શ્રી કૃષ્ણ, પ્રબંધક મહોદય!
          </h1>
          <p className="text-xs sm:text-sm text-cream-base/80 mt-2 leading-relaxed">
            શ્રીજી બાબાની દિવ્ય વેબસાઇટના સામગ્રી પ્રબંધન (CMS) માં આપનું સ્વાગત છે. અહીંથી આપ નવા લેખો પ્રકાશિત કરી શકો છો, સ્તુતિઓ ઉમેરી શકો છો અને સાઇટ સેટિંગ્સ બદલી શકો છો.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-primary text-maroon-primary font-semibold text-xs hover:bg-gold-light transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              નવો લેખ લખો (New Post)
            </Link>

            <Link
              href="/admin/prayers/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-cream-base font-semibold text-xs transition-colors border border-gold-primary/30"
            >
              <Plus className="w-4 h-4 text-gold-light" />
              નવી સ્તુતિ ઉમેરો (New Prayer)
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className={`p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${card.bg} group flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-medium text-maroon-primary/70">
                  {card.titleGu}
                </span>
                <div className={`p-2.5 rounded-xl bg-cream-base border border-gold-primary/20 ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-3xl font-serif font-bold text-maroon-primary">
                  {card.value}
                </div>
                <div className="text-xs text-maroon-primary/60 mt-1">
                  {card.subtext}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gold-primary/20 flex items-center justify-between text-xs font-semibold text-maroon-primary group-hover:text-gold-primary transition-colors">
                <span>વિગત જુઓ ({card.titleEn})</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Posts Section */}
      <div className="bg-cream-surface/70 rounded-3xl border border-gold-primary/30 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gold-primary/20">
          <div>
            <h2 className="font-serif font-bold text-lg text-maroon-primary">
              તાજેતરના લેખો (Recent Posts)
            </h2>
            <p className="text-xs text-maroon-primary/60 mt-0.5">
              છેલ્લા લખાયેલા અને પ્રકાશિત કરાયેલા બ્લોગ લેખો
            </p>
          </div>
          <Link
            href="/admin/posts"
            className="text-xs font-semibold text-gold-primary hover:text-maroon-primary transition-colors flex items-center gap-1"
          >
            બધા જુઓ <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="text-center py-10 text-maroon-primary/60 text-xs">
            હજુ સુધી કોઈ લેખ ઉમેરાયેલ નથી.
            <div className="mt-3">
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center gap-1.5 text-xs text-gold-primary font-semibold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> પ્રથમ લેખ લખો
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gold-primary/15">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-cream-base/50 px-2 rounded-xl transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        post.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {post.status === 'published' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> પ્રકાશિત
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" /> ડ્રાફ્ટ
                        </>
                      )}
                    </span>
                    <span className="text-[11px] text-maroon-primary/50">
                      /{post.slug}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-maroon-primary truncate mt-1">
                    {post.title_gu}
                  </h3>
                  {post.title_en && (
                    <p className="text-xs text-maroon-primary/60 truncate font-sans">
                      {post.title_en}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="p-2 rounded-lg text-maroon-primary/70 hover:text-maroon-primary hover:bg-cream-surface border border-gold-primary/20 transition-colors"
                    title="Edit Post"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  {post.status === 'published' && (
                    <Link
                      href={`/gu/blog/${post.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg text-maroon-primary/70 hover:text-maroon-primary hover:bg-cream-surface border border-gold-primary/20 transition-colors"
                      title="View Published Post"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
