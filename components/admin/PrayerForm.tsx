'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import BilingualTabs from './BilingualTabs';
import { createPrayer, updatePrayer, type PrayerActionResult } from '@/app/actions/prayers';
import { translatePrayerFields } from '@/app/actions/translate';
import { Prayer } from '@/types';

interface PrayerFormProps {
  initialData?: Prayer | null;
}

export default function PrayerForm({ initialData }: PrayerFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<'gu' | 'en'>('gu');

  const [slug, setSlug] = useState(initialData?.slug || '');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(Boolean(initialData?.slug));

  const [titleGu, setTitleGu] = useState(initialData?.title_gu || '');
  const [titleEn, setTitleEn] = useState(initialData?.title_en || '');

  const [subtitleGu, setSubtitleGu] = useState(initialData?.subtitle_gu || '');
  const [subtitleEn, setSubtitleEn] = useState(initialData?.subtitle_en || '');

  const [contentGu, setContentGu] = useState(initialData?.content_gu || '');
  const [contentEn, setContentEn] = useState(initialData?.content_en || '');

  const [iconType, setIconType] = useState<'flute' | 'lotus' | 'peacock'>(
    initialData?.icon_type || 'flute'
  );
  const [orderIndex, setOrderIndex] = useState(initialData?.order_index || 1);

  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleTitleEnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitleEn(val);
    if (!isSlugManuallyEdited && !initialData) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      if (generated) setSlug(generated);
    }
  };

  // Auto-translate state & handler
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);
  const [translateSuccess, setTranslateSuccess] = useState<string | null>(null);

  const handleAutoTranslate = async () => {
    setTranslateError(null);
    setTranslateSuccess(null);

    if (!titleGu.trim() && !contentGu.trim()) {
      setTranslateError('કૃપા કરીને પહેલા ગુજરાતી સ્તુતિનું શીર્ષક અથવા લખાણ લખો. (Please write Gujarati title or prayer text first.)');
      return;
    }

    setIsTranslating(true);
    try {
      const result = await translatePrayerFields({
        title_gu: titleGu,
        subtitle_gu: subtitleGu,
        content_gu: contentGu,
      });

      if (!result.success || !result.data) {
        setTranslateError(result.error || 'અનુવાદ કરવામાં નિષ્ફળ. (Translation failed)');
      } else {
        setTitleEn(result.data.title_en);
        setSubtitleEn(result.data.subtitle_en);
        setContentEn(result.data.content_en);

        if (!isSlugManuallyEdited && !initialData && result.data.title_en) {
          const generated = result.data.title_en
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
          if (generated) setSlug(generated);
        }

        setTranslateSuccess('સ્તુતિનો અંગ્રેજી અનુવાદ તૈયાર થયો છે! કૃપા કરીને સાચવતા પહેલા તેની સમીક્ષા કરો. (Draft translated! Please review before saving.)');
      }
    } catch (err) {
      setTranslateError(err instanceof Error ? err.message : 'Translation error');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});
    setSuccessMessage(null);

    if (!slug || slug.trim().length < 3) {
      setFieldErrors((prev) => ({
        ...prev,
        slug: ['Slug must be at least 3 characters long.'],
      }));
      return;
    }

    if (!titleGu || titleGu.trim().length === 0) {
      setFieldErrors((prev) => ({
        ...prev,
        title_gu: ['Gujarati title is required.'],
      }));
      setActiveTab('gu');
      return;
    }

    if (!contentGu || contentGu.trim().length === 0) {
      setFieldErrors((prev) => ({
        ...prev,
        content_gu: ['Gujarati prayer content is required.'],
      }));
      setActiveTab('gu');
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append('slug', slug.trim());
      formData.append('title_gu', titleGu.trim());
      formData.append('title_en', titleEn.trim());
      formData.append('subtitle_gu', subtitleGu.trim());
      formData.append('subtitle_en', subtitleEn.trim());
      formData.append('content_gu', contentGu);
      formData.append('content_en', contentEn || '');
      formData.append('icon_type', iconType);
      formData.append('order_index', String(orderIndex));

      let result: PrayerActionResult;
      if (initialData?.id) {
        result = await updatePrayer(initialData.id, formData);
      } else {
        result = await createPrayer(formData);
      }

      if (!result.success) {
        setGeneralError(result.error || 'Failed to save prayer');
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
      } else {
        setSuccessMessage('સ્તુતિ સફળતાપૂર્વક સાચવવામાં આવી છે! (Prayer saved successfully)');
        setTimeout(() => {
          router.push('/admin/prayers');
          router.refresh();
        }, 1200);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gold-primary/30">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/prayers"
            className="p-2 rounded-xl text-maroon-primary/70 hover:text-maroon-primary hover:bg-cream-surface border border-gold-primary/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-maroon-primary">
              {initialData ? 'સ્તુતિ સંપાદિત કરો (Edit Prayer)' : 'નવી સ્તુતિ ઉમેરો (New Prayer)'}
            </h1>
            <p className="text-xs text-maroon-primary/60 mt-0.5">
              નિત્ય પાઠ અને કીર્તન પ્રબંધન
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/prayers"
            className="px-4 py-2 rounded-xl text-xs font-medium text-maroon-primary/80 bg-cream-surface hover:bg-cream-surface/80 border border-gold-primary/30 transition-colors"
          >
            રદ કરો (Cancel)
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-cream-base bg-maroon-primary hover:bg-maroon-dark border border-gold-primary/40 shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-gold-light" />}
            સાચવો (Save Prayer)
          </button>
        </div>
      </div>

      {/* Notifications */}
      {generalError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{generalError}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-cream-surface/70 rounded-2xl border border-gold-primary/30 p-6 shadow-xs space-y-6">
        <BilingualTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          guLabel="ગુજરાતી સામગ્રી (Primary)"
          enLabel="English Content (Optional)"
        />

        {/* GUJARATI TAB */}
        {activeTab === 'gu' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-maroon-primary mb-1.5">
                સ્તુતિનું નામ (Prayer Title) <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={titleGu}
                onChange={(e) => setTitleGu(e.target.value)}
                placeholder="દા.ત. અધરમ મધુરમ (મધુરાષ્ટકમ)"
                className="w-full text-base font-serif font-bold px-4 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary placeholder:text-maroon-primary/40 focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
              />
              {fieldErrors.title_gu && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.title_gu[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-maroon-primary mb-1.5">
                સબટાઇટલ (Subtitle / એક લીટીનો પરિચય)
              </label>
              <input
                type="text"
                value={subtitleGu}
                onChange={(e) => setSubtitleGu(e.target.value)}
                placeholder="શ્રી કૃષ્ણના મધુર રૂપનું વર્ણન..."
                className="w-full text-xs px-4 py-2 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary placeholder:text-maroon-primary/40 focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-maroon-primary mb-1.5">
                સ્તુતિ / શ્લોક લખાણ (Sacred Text Content) <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={10}
                value={contentGu}
                onChange={(e) => setContentGu(e.target.value)}
                placeholder="અધરં મધુરં વદનં મધુરં..."
                className="w-full text-sm font-serif leading-relaxed p-4 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary placeholder:text-maroon-primary/40 focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
              />
              {fieldErrors.content_gu && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.content_gu[0]}</p>
              )}
            </div>
          </div>
        )}

        {/* ENGLISH TAB */}
        {activeTab === 'en' && (
          <div className="space-y-4">
            {/* Auto-Translate Action Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gold-primary/10 border border-gold-primary/30">
              <div>
                <h4 className="text-xs font-bold text-maroon-primary flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                  AI Auto-Translate (ગુજરાતીમાંથી અંગ્રેજી)
                </h4>
                <p className="text-[11px] text-maroon-primary/70 mt-0.5">
                  ગુજરાતી સ્તુતિ/શ્લોકમાંથી આપમેળે અંગ્રેજી ડ્રાફ્ટ તૈયાર કરો. સાચવતા પહેલા સમીક્ષા કરો.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAutoTranslate}
                disabled={isTranslating}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-maroon-primary text-cream-base hover:bg-maroon-dark transition-colors disabled:opacity-50 shrink-0 shadow-xs cursor-pointer"
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    અનુવાદ થઈ રહ્યો છે...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-gold-primary" />
                    Auto-Translate to English
                  </>
                )}
              </button>
            </div>

            {translateError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{translateError}</span>
              </div>
            )}

            {translateSuccess && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-xs text-green-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{translateSuccess}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-maroon-primary mb-1.5">
                English Title (Optional)
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={handleTitleEnChange}
                placeholder="e.g. Adharam Madhuram (Madhurashtakam)"
                className="w-full text-base font-medium px-4 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary placeholder:text-maroon-primary/40 focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-maroon-primary mb-1.5">
                English Subtitle (Optional)
              </label>
              <input
                type="text"
                value={subtitleEn}
                onChange={(e) => setSubtitleEn(e.target.value)}
                placeholder="Description of Lord Krishna's sweetness..."
                className="w-full text-xs px-4 py-2 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary placeholder:text-maroon-primary/40 focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-maroon-primary mb-1.5">
                English Prayer Translation (Optional)
              </label>
              <textarea
                rows={10}
                value={contentEn}
                onChange={(e) => setContentEn(e.target.value)}
                placeholder="His lips are sweet, His face is sweet..."
                className="w-full text-sm font-sans leading-relaxed p-4 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary placeholder:text-maroon-primary/40 focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
              />
            </div>
          </div>
        )}

        {/* Common Settings: Slug, Icon, Sort Order */}
        <div className="pt-6 border-t border-gold-primary/20 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              સ્લગ (Slug) <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setIsSlugManuallyEdited(true);
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, '-')
                    .replace(/-+/g, '-')
                );
              }}
              placeholder="adharam-madhuram"
              className="w-full text-xs px-3 py-2 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary font-mono focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
            {fieldErrors.slug && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.slug[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              પ્રતીક / ચિહ્ન (Icon Motif)
            </label>
            <select
              value={iconType}
              onChange={(e) => setIconType(e.target.value as any)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            >
              <option value="flute">વાંસળી (Flute)</option>
              <option value="lotus">કમળ (Lotus)</option>
              <option value="peacock">મોરપીંછ (Peacock Feather)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              ક્રમ (Order Index)
            </label>
            <input
              type="number"
              min={1}
              value={orderIndex}
              onChange={(e) => setOrderIndex(Number(e.target.value))}
              className="w-full text-xs px-3 py-2 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
