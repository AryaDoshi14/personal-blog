'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, AlertCircle, CheckCircle, Sparkles, Building, Phone, Share2, Shield, User } from 'lucide-react';
import { SiteSettings } from '@/types';
import { updateSiteSettings, type SettingsActionResult } from '@/app/actions/settings';
import ImageUploader from './ImageUploader';

interface SettingsFormProps {
  initialSettings: SiteSettings;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<SiteSettings>(initialSettings);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (key: keyof SiteSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});
    setSuccessMessage(null);

    startTransition(async () => {
      const data = new FormData();
      for (const [key, value] of Object.entries(formData)) {
        data.append(key, value || '');
      }

      const result: SettingsActionResult = await updateSiteSettings(data);
      if (!result.success) {
        setGeneralError(result.error || 'Failed to update settings');
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
      } else {
        setSuccessMessage('સાઇટ સેટિંગ્સ સફળતાપૂર્વક અપડેટ કરવામાં આવી છે! (Settings updated successfully)');
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gold-primary/30">
        <div>
          <h1 className="font-serif font-bold text-2xl text-maroon-primary">
            સાઇટ સેટિંગ્સ (Site Settings)
          </h1>
          <p className="text-xs text-maroon-primary/60 mt-0.5">
            સાઇટના શીર્ષક, હીરો વિભાગ, પરંપરા વર્ણન અને સંપર્ક વિગતો બદલો
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold text-cream-base bg-maroon-primary hover:bg-maroon-dark border border-gold-primary/40 shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-gold-light" />}
          સેટિંગ્સ સાચવો (Save Settings)
        </button>
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

      {/* Section 1: General & Brand */}
      <div className="bg-cream-surface/70 rounded-2xl border border-gold-primary/30 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gold-primary/20 pb-3 text-maroon-primary">
          <Sparkles className="w-5 h-5 text-gold-primary" />
          <h2 className="font-serif font-bold text-base">સામાન્ય બ્રાન્ડિંગ (Branding & Identity)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              સાઇટનું નામ (Site Name - Gujarati) <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.site_name_gu}
              onChange={(e) => handleChange('site_name_gu', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              Site Name (English) <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.site_name_en}
              onChange={(e) => handleChange('site_name_en', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              ટેગલાઇન (Site Tagline - Gujarati) <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.site_tagline_gu}
              onChange={(e) => handleChange('site_tagline_gu', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              Site Tagline (English)
            </label>
            <input
              type="text"
              value={formData.site_tagline_en}
              onChange={(e) => handleChange('site_tagline_en', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Hero Section */}
      <div className="bg-cream-surface/70 rounded-2xl border border-gold-primary/30 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gold-primary/20 pb-3 text-maroon-primary">
          <Sparkles className="w-5 h-5 text-gold-primary" />
          <h2 className="font-serif font-bold text-base">હોમપેજ હીરો વિભાગ (Hero Section)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              હીરો મુખ્ય મથાળું (Hero Heading - Gujarati) <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.hero_heading_gu}
              onChange={(e) => handleChange('hero_heading_gu', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              Hero Heading (English)
            </label>
            <input
              type="text"
              value={formData.hero_heading_en}
              onChange={(e) => handleChange('hero_heading_en', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              સંસ્કૃત શ્લોક લાઇન (Sanskrit Mantra - Gujarati)
            </label>
            <input
              type="text"
              value={formData.hero_sanskrit_line_gu}
              onChange={(e) => handleChange('hero_sanskrit_line_gu', e.target.value)}
              placeholder="|| શ્રી કૃષ્ણ શરણં મમ: ||"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              Sanskrit Mantra Line (English)
            </label>
            <input
              type="text"
              value={formData.hero_sanskrit_line_en}
              onChange={(e) => handleChange('hero_sanskrit_line_en', e.target.value)}
              placeholder="|| Shree Krishna Sharanam Mama: ||"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              પરિચય લખાણ (Hero Intro Text - Gujarati) <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.hero_intro_gu}
              onChange={(e) => handleChange('hero_intro_gu', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              Hero Intro Text (English)
            </label>
            <textarea
              rows={3}
              value={formData.hero_intro_en}
              onChange={(e) => handleChange('hero_intro_en', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>

          <div className="sm:col-span-2">
            <ImageUploader
              label="હીરો સેક્શન ઇમેજ (Hero Image)"
              imageUrl={formData.hero_image_url}
              altText="Hero Shrinathji"
              requiredAlt={false}
              onImageChange={(url) => handleChange('hero_image_url', url)}
              onImageRemove={() => handleChange('hero_image_url', '')}
            />
          </div>
        </div>
      </div>

      {/* Section 3: Tradition Section */}
      <div className="bg-cream-surface/70 rounded-2xl border border-gold-primary/30 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gold-primary/20 pb-3 text-maroon-primary">
          <Building className="w-5 h-5 text-gold-primary" />
          <h2 className="font-serif font-bold text-base">પરંપરા વિભાગ (Tradition Section)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              વિભાગ મથાળું (Tradition Title - Gujarati) <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.tradition_title_gu}
              onChange={(e) => handleChange('tradition_title_gu', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              Tradition Title (English)
            </label>
            <input
              type="text"
              value={formData.tradition_title_en}
              onChange={(e) => handleChange('tradition_title_en', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              પરંપરા લખાણ (Tradition Text - Gujarati) <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={4}
              value={formData.tradition_text_gu}
              onChange={(e) => handleChange('tradition_text_gu', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              Tradition Text (English)
            </label>
            <textarea
              rows={4}
              value={formData.tradition_text_en}
              onChange={(e) => handleChange('tradition_text_en', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>

          <div className="sm:col-span-2">
            <ImageUploader
              label="પરંપરા વિભાગ ઇમેજ (Tradition Image)"
              imageUrl={formData.tradition_image_url}
              altText="Tradition Haveli"
              requiredAlt={false}
              onImageChange={(url) => handleChange('tradition_image_url', url)}
              onImageRemove={() => handleChange('tradition_image_url', '')}
            />
          </div>
        </div>
      </div>

      {/* Section: About the Author */}
      <div className="bg-cream-surface/70 rounded-2xl border border-gold-primary/30 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gold-primary/20 pb-3 text-maroon-primary">
          <User className="w-5 h-5 text-gold-primary" />
          <h2 className="font-serif font-bold text-base">લેખક વિશે (About the Author)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              લેખકનું નામ (Author Name - Gujarati) <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.author_name_gu}
              onChange={(e) => handleChange('author_name_gu', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
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
              value={formData.author_name_en}
              onChange={(e) => handleChange('author_name_en', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              લેખક પરિચય (Author Bio - Gujarati)
            </label>
            <textarea
              rows={3}
              value={formData.author_bio_gu}
              onChange={(e) => handleChange('author_bio_gu', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              Author Bio (English)
            </label>
            <textarea
              rows={3}
              value={formData.author_bio_en}
              onChange={(e) => handleChange('author_bio_en', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>

          <div className="sm:col-span-2">
            <ImageUploader
              label="લેખકનો ફોટો (Author Photo)"
              sublabel="JPG, PNG or WebP up to 5MB (portrait works best)"
              imageUrl={formData.author_photo_url}
              altText={formData.author_name_en || formData.author_name_gu || 'Author'}
              requiredAlt={false}
              onImageChange={(url) => handleChange('author_photo_url', url)}
              onImageRemove={() => handleChange('author_photo_url', '')}
            />
          </div>
        </div>
      </div>

      {/* Section 4: Contact & Social */}
      <div className="bg-cream-surface/70 rounded-2xl border border-gold-primary/30 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gold-primary/20 pb-3 text-maroon-primary">
          <Phone className="w-5 h-5 text-gold-primary" />
          <h2 className="font-serif font-bold text-base">સંપર્ક અને સોશિયલ મીડિયા (Contact & Social)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              સંપર્ક ઇમેઇલ (Contact Email)
            </label>
            <input
              type="email"
              value={formData.contact_email}
              onChange={(e) => handleChange('contact_email', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              ફોન નંબર (Contact Phone)
            </label>
            <input
              type="text"
              value={formData.contact_phone}
              onChange={(e) => handleChange('contact_phone', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              Facebook URL
            </label>
            <input
              type="url"
              value={formData.social_facebook}
              onChange={(e) => handleChange('social_facebook', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              Instagram URL
            </label>
            <input
              type="url"
              value={formData.social_instagram}
              onChange={(e) => handleChange('social_instagram', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              YouTube URL
            </label>
            <input
              type="url"
              value={formData.social_youtube}
              onChange={(e) => handleChange('social_youtube', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>
        </div>
      </div>

      {/* Section 5: Footer Copyright */}
      <div className="bg-cream-surface/70 rounded-2xl border border-gold-primary/30 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gold-primary/20 pb-3 text-maroon-primary">
          <Shield className="w-5 h-5 text-gold-primary" />
          <h2 className="font-serif font-bold text-base">ફૂટર કૉપિરાઇટ (Footer Copyright)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              Copyright (Gujarati)
            </label>
            <input
              type="text"
              value={formData.footer_copyright_gu}
              onChange={(e) => handleChange('footer_copyright_gu', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              Copyright (English)
            </label>
            <input
              type="text"
              value={formData.footer_copyright_en}
              onChange={(e) => handleChange('footer_copyright_en', e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
            />
          </div>
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3 rounded-xl text-sm font-serif font-bold text-cream-base bg-maroon-primary hover:bg-maroon-dark border border-gold-primary/50 shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-gold-light" />}
          બધા સેટિંગ્સ સાચવો (Save All Changes)
        </button>
      </div>
    </form>
  );
}
