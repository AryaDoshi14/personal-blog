'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  Send,
  Eye,
  ArrowLeft,
  Loader2,
  AlertCircle,
  FileDown,
  CheckCircle,
  X,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import BilingualTabs from './BilingualTabs';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';
import { createPost, updatePost, type PostActionResult } from '@/app/actions/posts';
import { translatePostFields } from '@/app/actions/translate';
import { Category, Post } from '@/types';
import { sanitizeHtml } from '@/lib/sanitize';

interface PostFormProps {
  initialData?: Post | null;
  categories: Category[];
}

export default function PostForm({ initialData, categories }: PostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Active language tab
  const [activeTab, setActiveTab] = useState<'gu' | 'en'>('gu');

  // Form Fields State
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(Boolean(initialData?.slug));

  const [titleGu, setTitleGu] = useState(initialData?.title_gu || '');
  const [titleEn, setTitleEn] = useState(initialData?.title_en || '');

  const [excerptGu, setExcerptGu] = useState(initialData?.excerpt_gu || '');
  const [excerptEn, setExcerptEn] = useState(initialData?.excerpt_en || '');

  const [contentGu, setContentGu] = useState(initialData?.content_gu || '');
  const [contentEn, setContentEn] = useState(initialData?.content_en || '');

  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.cover_image_url || '');
  const [coverImageAlt, setCoverImageAlt] = useState(initialData?.cover_image_alt || '');

  const [categoryId, setCategoryId] = useState(initialData?.category_id || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [status, setStatus] = useState<'draft' | 'published'>(initialData?.status || 'draft');
  const [authorNameGu, setAuthorNameGu] = useState(initialData?.author_name_gu || 'સંપાદક');
  const [authorNameEn, setAuthorNameEn] = useState(initialData?.author_name_en || 'Editor');

  // Error & UI State
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Auto-generate slug from English title or Gujarati title transliteration if not manually edited
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

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    setSlug(
      e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
    );
  };

  // Auto-translate state & handler
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);
  const [translateSuccess, setTranslateSuccess] = useState<string | null>(null);

  const handleAutoTranslate = async () => {
    setTranslateError(null);
    setTranslateSuccess(null);

    if (!titleGu.trim() && !contentGu.trim()) {
      setTranslateError('કૃપા કરીને પહેલા ગુજરાતી શીર્ષક અથવા સામગ્રી લખો. (Please write Gujarati title or content first.)');
      return;
    }

    setIsTranslating(true);
    try {
      const result = await translatePostFields({
        title_gu: titleGu,
        excerpt_gu: excerptGu,
        content_gu: contentGu,
      });

      if (!result.success || !result.data) {
        setTranslateError(result.error || 'અનુવાદ કરવામાં નિષ્ફળ. (Translation failed)');
      } else {
        setTitleEn(result.data.title_en);
        setExcerptEn(result.data.excerpt_en);
        setContentEn(result.data.content_en);

        if (!isSlugManuallyEdited && !initialData && result.data.title_en) {
          const generated = result.data.title_en
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
          if (generated) setSlug(generated);
        }

        setTranslateSuccess('અંગ્રેજી અનુવાદ સફળતાપૂર્વક તૈયાર થયો છે! કૃપા કરીને સાચવતા પહેલા તેની સમીક્ષા કરો. (Draft translated! Please review before saving.)');
      }
    } catch (err) {
      setTranslateError(err instanceof Error ? err.message : 'Translation error');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmitWithStatus = (targetStatus: 'draft' | 'published') => {
    setGeneralError(null);
    setFieldErrors({});
    setSuccessMessage(null);

    // Validate client-side alt text if cover image is present
    if (coverImageUrl && (!coverImageAlt || coverImageAlt.trim().length === 0)) {
      setFieldErrors((prev) => ({
        ...prev,
        cover_image_alt: ['Alt text is required when a cover image is provided.'],
      }));
      setGeneralError('કૃપા કરીને કવર ઇમેજ માટે Alt ટેક્સ્ટ દાખલ કરો.');
      return;
    }

    if (!slug || slug.trim().length < 3) {
      setFieldErrors((prev) => ({
        ...prev,
        slug: ['Slug must be at least 3 characters long (e.g. shree-yamunaji).'],
      }));
      setGeneralError('કૃપા કરીને માન્ય સ્લગ (Slug) દાખલ કરો.');
      return;
    }

    if (!titleGu || titleGu.trim().length === 0) {
      setFieldErrors((prev) => ({
        ...prev,
        title_gu: ['Gujarati title is required.'],
      }));
      setActiveTab('gu');
      setGeneralError('ગુજરાતી શીર્ષક આવશ્યક છે.');
      return;
    }

    if (!contentGu || contentGu.trim().length === 0 || contentGu === '<p></p>') {
      setFieldErrors((prev) => ({
        ...prev,
        content_gu: ['Gujarati content is required.'],
      }));
      setActiveTab('gu');
      setGeneralError('ગુજરાતી લખાણ સામગ્રી આવશ્યક છે.');
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append('slug', slug.trim());
      formData.append('title_gu', titleGu.trim());
      formData.append('title_en', titleEn.trim());
      formData.append('excerpt_gu', excerptGu.trim());
      formData.append('excerpt_en', excerptEn.trim());
      formData.append('content_gu', contentGu);
      formData.append('content_en', contentEn || '');
      formData.append('cover_image_url', coverImageUrl || '');
      formData.append('cover_image_alt', coverImageAlt || '');
      formData.append('category_id', categoryId || '');
      formData.append('tags', tags || '');
      formData.append('status', targetStatus);
      formData.append('author_name_gu', authorNameGu.trim() || 'સંપાદક');
      formData.append('author_name_en', authorNameEn.trim());

      let result: PostActionResult;
      if (initialData?.id) {
        result = await updatePost(initialData.id, formData);
      } else {
        result = await createPost(formData);
      }

      if (!result.success) {
        setGeneralError(result.error || 'Failed to save post');
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
      } else {
        setStatus(targetStatus);
        setSuccessMessage(
          targetStatus === 'published'
            ? 'લેખ સફળતાપૂર્વક પ્રકાશિત થયો છે! (Post published successfully)'
            : 'ડ્રાફ્ટ સુરક્ષિત રીતે સાચવવામાં આવ્યો છે. (Draft saved successfully)'
        );

        setTimeout(() => {
          router.push('/admin/posts');
          router.refresh();
        }, 1200);
      }
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gold-primary/30">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="p-2 rounded-xl text-maroon-primary/70 hover:text-maroon-primary hover:bg-cream-surface border border-gold-primary/20 transition-colors"
            title="Cancel & return to posts"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-maroon-primary">
              {initialData ? 'લેખ સંપાદિત કરો (Edit Post)' : 'નવો લેખ લખો (Create New Post)'}
            </h1>
            <p className="text-xs text-maroon-primary/60 mt-0.5">
              સ્થિતિ (Status):{' '}
              <span className="font-semibold uppercase tracking-wider">
                {status === 'published' ? 'પ્રકાશિત (Published)' : 'ડ્રાફ્ટ (Draft)'}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons Group (Requirement 7: Save Draft, Publish, Unpublish, Preview, Cancel) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Cancel */}
          <Link
            href="/admin/posts"
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-maroon-primary/80 bg-cream-surface hover:bg-cream-surface/80 border border-gold-primary/30 transition-colors"
          >
            રદ કરો (Cancel)
          </Link>

          {/* Preview */}
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-maroon-primary bg-cream-surface hover:bg-cream-surface/80 border border-gold-primary/40 transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-gold-primary" />
            પૂર્વાવલોકન (Preview)
          </button>

          {/* Save Draft */}
          <button
            type="button"
            onClick={() => handleSubmitWithStatus('draft')}
            disabled={isPending}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-maroon-primary bg-gold-primary/20 hover:bg-gold-primary/30 border border-gold-primary/50 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-maroon-primary" />}
            ડ્રાફ્ટ સાચવો (Save Draft)
          </button>

          {/* Publish / Unpublish */}
          {status === 'published' ? (
            <button
              type="button"
              onClick={() => handleSubmitWithStatus('draft')}
              disabled={isPending}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <FileDown className="w-4 h-4" />
              અપ્રકાશિત કરો (Unpublish)
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSubmitWithStatus('published')}
              disabled={isPending}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-cream-base bg-maroon-primary hover:bg-maroon-dark border border-gold-primary/40 shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-gold-light" />}
              પ્રકાશિત કરો (Publish)
            </button>
          )}
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

      {/* Two-Column Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Titles, Excerpt, Content via Bilingual Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-cream-surface/70 rounded-2xl border border-gold-primary/30 p-6 shadow-xs">
            <BilingualTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              guLabel="ગુજરાતી સામગ્રી (Primary)"
              enLabel="English Content (Optional)"
            />

            {/* GUJARATI TAB */}
            {activeTab === 'gu' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-maroon-primary mb-1.5">
                    ગુજરાતી શીર્ષક (Gujarati Title) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={titleGu}
                    onChange={(e) => setTitleGu(e.target.value)}
                    placeholder="દા.ત. શ્રીજી બાવાની અસીમ કૃપા અને ભક્તિભાવ..."
                    className="w-full text-base font-serif font-bold px-4 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary placeholder:text-maroon-primary/40 focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
                  />
                  {fieldErrors.title_gu && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.title_gu[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-maroon-primary mb-1.5">
                    સંક્ષિપ્ત સારાંશ (Gujarati Excerpt) <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={excerptGu}
                    onChange={(e) => setExcerptGu(e.target.value)}
                    placeholder="આ લેખનો સંક્ષિપ્ત પરિચય (હોમપેજ અને બ્લોગ લિસ્ટિંગ માટે)..."
                    className="w-full text-xs px-4 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary placeholder:text-maroon-primary/40 focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
                  />
                  {fieldErrors.excerpt_gu && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.excerpt_gu[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-maroon-primary mb-1.5">
                    સંપૂર્ણ લખાણ સામગ્રી (Full Content) <span className="text-red-600">*</span>
                  </label>
                  <RichTextEditor
                    content={contentGu}
                    onChange={setContentGu}
                    placeholder="અહીં ગુજરાતીમાં લેખનું વિગતવાર લખાણ લખો..."
                    minHeight="350px"
                    postId={initialData?.id}
                  />
                  {fieldErrors.content_gu && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.content_gu[0]}</p>
                  )}
                </div>
              </div>
            )}

            {/* ENGLISH TAB */}
            {activeTab === 'en' && (
              <div className="space-y-5">
                {/* Auto-Translate Action Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gold-primary/10 border border-gold-primary/30">
                  <div>
                    <h4 className="text-xs font-bold text-maroon-primary flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                      AI Auto-Translate (ગુજરાતીમાંથી અંગ્રેજી)
                    </h4>
                    <p className="text-[11px] text-maroon-primary/70 mt-0.5">
                      ગુજરાતી સામગ્રીમાંથી આપમેળે અંગ્રેજી ડ્રાફ્ટ તૈયાર કરો. સાચવતા પહેલા સમીક્ષા કરો.
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
                    placeholder="e.g. The Divine Grace of Shreeji Baba..."
                    className="w-full text-base font-medium px-4 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary placeholder:text-maroon-primary/40 focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-maroon-primary mb-1.5">
                    English Excerpt (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={excerptEn}
                    onChange={(e) => setExcerptEn(e.target.value)}
                    placeholder="Brief description for English readers..."
                    className="w-full text-xs px-4 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary placeholder:text-maroon-primary/40 focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-maroon-primary mb-1.5">
                    English Content (Optional)
                  </label>
                  <RichTextEditor
                    content={contentEn}
                    onChange={setContentEn}
                    placeholder="Write detailed post content in English..."
                    minHeight="350px"
                    postId={initialData?.id}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Metadata & Image Settings */}
        <div className="space-y-6">
          {/* Post Slug Settings (Requirement 9) */}
          <div className="bg-cream-surface/70 rounded-2xl border border-gold-primary/30 p-5 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-sm text-maroon-primary border-b border-gold-primary/20 pb-2">
              URL અને સ્લગ (Slug & Permalinks)
            </h3>

            <div>
              <label className="block text-xs font-semibold text-maroon-primary mb-1">
                પોસ્ટ સ્લગ (Post Slug) <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center rounded-xl bg-cream-base border border-gold-primary/40 overflow-hidden focus-within:ring-2 focus-within:ring-gold-primary/50">
                <span className="px-3 py-2 text-xs text-maroon-primary/50 bg-cream-surface border-r border-gold-primary/30 select-none">
                  /blog/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="bhakti-no-anubhav"
                  className="w-full text-xs px-3 py-2 bg-transparent text-maroon-primary focus:outline-none font-mono"
                />
              </div>
              <p className="text-[11px] text-maroon-primary/60 mt-1">
                આ સ્લગ પોસ્ટના URL લિંક માટે વપરાશે.
              </p>
              {fieldErrors.slug && (
                <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.slug[0]}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-maroon-primary mb-1">
                કેટેગરી (Category)
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
              >
                <option value="">કોઈ કેટેગરી નથી (None)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_gu} ({c.name_en})
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-maroon-primary mb-1">
                ટેગ્સ (Tags — Comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="ભક્તિ, પુષ્ટિમાર્ગ, સત્સંગ"
                className="w-full text-xs px-3 py-2 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary placeholder:text-maroon-primary/40 focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
              />
            </div>

            {/* Author byline */}
            <div>
              <label className="block text-xs font-semibold text-maroon-primary mb-1">
                લેખકનું નામ — ગુજરાતી (Author Name)
              </label>
              <input
                type="text"
                value={authorNameGu}
                onChange={(e) => setAuthorNameGu(e.target.value)}
                placeholder="સંપાદક"
                className="w-full text-xs px-3 py-2 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary placeholder:text-maroon-primary/40 focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
              />
              {fieldErrors.author_name_gu && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.author_name_gu[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-maroon-primary mb-1">
                Author Name (English)
              </label>
              <input
                type="text"
                value={authorNameEn}
                onChange={(e) => setAuthorNameEn(e.target.value)}
                placeholder="Editor"
                className="w-full text-xs px-3 py-2 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary placeholder:text-maroon-primary/40 focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
              />
            </div>
          </div>

          {/* Cover Image Settings (Requirement 7 & 8) */}
          <div className="bg-cream-surface/70 rounded-2xl border border-gold-primary/30 p-5 shadow-xs">
            <ImageUploader
              label="કવર ઇમેજ (Cover Image)"
              imageUrl={coverImageUrl}
              altText={coverImageAlt}
              requiredAlt={true}
              postId={initialData?.id}
              onImageChange={(url, alt) => {
                setCoverImageUrl(url);
                setCoverImageAlt(alt);
              }}
              onImageRemove={() => {
                setCoverImageUrl('');
                setCoverImageAlt('');
              }}
              error={fieldErrors.cover_image_alt?.[0]}
            />
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-cream-base rounded-3xl border border-gold-primary/50 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-gold-primary/30 flex items-center justify-between bg-cream-surface">
              <div>
                <h3 className="font-serif font-bold text-maroon-primary text-base">
                  પૂર્વાવલોકન (Post Preview)
                </h3>
                <p className="text-xs text-maroon-primary/60">
                  આ લેખ વાચકોને આ પ્રમાણે દેખાશે
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="p-1.5 rounded-xl text-maroon-primary/60 hover:text-maroon-primary hover:bg-cream-base"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {coverImageUrl && (
                <div className="rounded-2xl overflow-hidden aspect-video max-h-72 w-full border border-gold-primary/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImageUrl}
                    alt={coverImageAlt || 'Preview cover'}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h1 className="font-serif font-bold text-2xl sm:text-3xl text-maroon-primary leading-tight">
                  {titleGu || 'શીર્ષક અહીં દેખાશે...'}
                </h1>
                {titleEn && (
                  <h2 className="text-base text-maroon-primary/70 mt-1 font-sans">
                    {titleEn}
                  </h2>
                )}
              </div>

              {excerptGu && (
                <p className="text-sm font-serif italic text-maroon-primary/80 border-l-2 border-gold-primary pl-4 py-1">
                  {excerptGu}
                </p>
              )}

              <div
                className="prose prose-stone max-w-none text-maroon-primary leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(contentGu || '<p>કોઈ લખાણ નથી...</p>'),
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
