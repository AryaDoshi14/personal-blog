'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Building,
  Phone,
  Shield,
  User,
  LayoutTemplate,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { SiteSettings } from '@/types';
import { updateSiteSettings, type SettingsActionResult } from '@/app/actions/settings';
import ImageUploader from './ImageUploader';

interface SettingsFormProps {
  initialSettings: SiteSettings;
}

type TabKey = 'main-hero' | 'header' | 'tradition-author' | 'footer-contact' | 'guide';

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<TabKey>('main-hero');
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

  const tabs: { id: TabKey; labelGu: string; labelEn: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'main-hero', labelGu: 'મુખ્ય પાનું / હીરો', labelEn: 'Main Page / Hero', icon: Sparkles },
    { id: 'header', labelGu: 'હેડર અને લોગો', labelEn: 'Header & Logo', icon: LayoutTemplate },
    { id: 'tradition-author', labelGu: 'પરંપરા અને લેખક', labelEn: 'Tradition & Author', icon: Building },
    { id: 'footer-contact', labelGu: 'ફૂટર અને સોશિયલ', labelEn: 'Footer & Contact', icon: Phone },
    { id: 'guide', labelGu: 'સાઇટ માળખું', labelEn: 'Page Structure Guide', icon: Compass },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gold-primary/30">
        <div>
          <h1 className="font-serif font-bold text-2xl text-maroon-primary">
            સાઇટ સામગ્રી અને સેટિંગ્સ (Site Content & Settings)
          </h1>
          <p className="text-xs text-maroon-primary/70 mt-0.5">
            હેડર, ફૂટર, મુખ્ય પાનાના લખાણો અને ફોટો અહીંથી સરળતાથી બદલો
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold text-cream-base bg-maroon-primary hover:bg-maroon-dark border border-gold-primary/40 shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer self-start sm:self-auto hover:shadow-md active:scale-95"
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

      {/* Tabs Bar */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-cream-surface/80 rounded-2xl border border-gold-primary/25 shadow-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-maroon-primary text-cream-base shadow-sm font-semibold'
                  : 'text-maroon-primary/80 hover:bg-white/60 hover:text-maroon-primary'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-gold-light' : 'text-gold-primary'}`} />
              <span>{tab.labelGu}</span>
              <span className={`text-[10px] hidden sm:inline ${isActive ? 'text-gold-light/90' : 'opacity-60'}`}>
                ({tab.labelEn})
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MAIN PAGE / HERO */}
      {activeTab === 'main-hero' && (
        <div className="space-y-6">
          <div className="bg-cream-surface/70 rounded-2xl border border-gold-primary/30 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-gold-primary/20 pb-3 text-maroon-primary">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-gold-primary" />
                <h2 className="font-serif font-bold text-base">મુખ્ય પાનું હીરો વિભાગ (Main Page Hero Section)</h2>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-gold-primary/15 text-maroon-primary font-serif">
                મુખ્ય પાના પર સૌથી ઉપર દેખાય છે
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-maroon-primary mb-1">
                  મુખ્ય મથાળું (Hero Heading - Gujarati) <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.hero_heading_gu}
                  onChange={(e) => handleChange('hero_heading_gu', e.target.value)}
                  placeholder="જય શ્રી કૃષ્ણ"
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
                  placeholder="Jai Shree Krishna"
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

              <div className="sm:col-span-2 pt-2">
                <ImageUploader
                  label="મુખ્ય પાનાનો હીરો ફોટો (Main Page Hero Photo)"
                  sublabel="શ્રીનાથજી દર્શન અથવા મુખ્ય છબી (JPG, PNG or WebP)"
                  imageUrl={formData.hero_image_url}
                  altText="Hero Shrinathji"
                  requiredAlt={false}
                  onImageChange={(url) => handleChange('hero_image_url', url)}
                  onImageRemove={() => handleChange('hero_image_url', '')}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HEADER & LOGO */}
      {activeTab === 'header' && (
        <div className="space-y-6">
          <div className="bg-cream-surface/70 rounded-2xl border border-gold-primary/30 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-gold-primary/20 pb-3 text-maroon-primary">
              <div className="flex items-center gap-2.5">
                <LayoutTemplate className="w-5 h-5 text-gold-primary" />
                <h2 className="font-serif font-bold text-base">હેડર અને લોગો સેટિંગ્સ (Header & Branding)</h2>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-gold-primary/15 text-maroon-primary font-serif">
                બધા પૃષ્ઠોના ટોચના નેવિગેશન બારમાં દેખાય છે
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <ImageUploader
                  label="હેડર ફોટો / લોગો પ્રતીક (Header Logo / Photo)"
                  sublabel="નેવિગેશન બારમાં દેખાતો લોગો (PNG, SVG, JPG or WebP)"
                  imageUrl={formData.header_logo_url || '/images/defaults/logo-mandala.svg'}
                  altText="Header Logo"
                  requiredAlt={false}
                  onImageChange={(url) => handleChange('header_logo_url', url)}
                  onImageRemove={() => handleChange('header_logo_url', '/images/defaults/logo-mandala.svg')}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-maroon-primary mb-1">
                  સાઇટ / બ્લોગનું નામ (Site Name - Gujarati) <span className="text-red-600">*</span>
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
                  સાઇટ ટેગલાઇન (Site Tagline - Gujarati) <span className="text-red-600">*</span>
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
        </div>
      )}

      {/* TAB 3: TRADITION & AUTHOR */}
      {activeTab === 'tradition-author' && (
        <div className="space-y-6">
          {/* Tradition Section */}
          <div className="bg-cream-surface/70 rounded-2xl border border-gold-primary/30 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gold-primary/20 pb-3 text-maroon-primary">
              <div className="flex items-center gap-2.5">
                <Building className="w-5 h-5 text-gold-primary" />
                <h2 className="font-serif font-bold text-base">પરંપરા વિભાગ (Tradition Section)</h2>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-gold-primary/15 text-maroon-primary font-serif">
                મુખ્ય પાનું અને પરંપરા પાનું
              </span>
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
                  label="પરંપરા વિભાગ ફોટો (Tradition Photo)"
                  imageUrl={formData.tradition_image_url}
                  altText="Tradition Haveli"
                  requiredAlt={false}
                  onImageChange={(url) => handleChange('tradition_image_url', url)}
                  onImageRemove={() => handleChange('tradition_image_url', '')}
                />
              </div>
            </div>
          </div>

          {/* Author Section */}
          <div className="bg-cream-surface/70 rounded-2xl border border-gold-primary/30 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gold-primary/20 pb-3 text-maroon-primary">
              <div className="flex items-center gap-2.5">
                <User className="w-5 h-5 text-gold-primary" />
                <h2 className="font-serif font-bold text-base">લેખક / સંપાદક પરિચય (Author Details)</h2>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-gold-primary/15 text-maroon-primary font-serif">
                લેખો અને બ્લોગ વિભાગમાં દર્શાવાય છે
              </span>
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
                  sublabel="JPG, PNG or WebP (portrait works best)"
                  imageUrl={formData.author_photo_url}
                  altText={formData.author_name_en || formData.author_name_gu || 'Author'}
                  requiredAlt={false}
                  onImageChange={(url) => handleChange('author_photo_url', url)}
                  onImageRemove={() => handleChange('author_photo_url', '')}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FOOTER & SOCIAL */}
      {activeTab === 'footer-contact' && (
        <div className="space-y-6">
          {/* Contact & Social */}
          <div className="bg-cream-surface/70 rounded-2xl border border-gold-primary/30 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gold-primary/20 pb-3 text-maroon-primary">
              <div className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 text-gold-primary" />
                <h2 className="font-serif font-bold text-base">સંપર્ક અને સોશિયલ લિંક્સ (Contact & Social)</h2>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-gold-primary/15 text-maroon-primary font-serif">
                ફૂટર અને સંપર્ક પૃષ્ઠ
              </span>
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
                  placeholder="contact@example.com"
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
                  placeholder="+91 98765 43210"
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
                  placeholder="https://facebook.com/..."
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
                  placeholder="https://instagram.com/..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-base border border-gold-primary/40 text-maroon-primary focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
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
        </div>
      )}

      {/* TAB 5: SITE STRUCTURE GUIDE */}
      {activeTab === 'guide' && (
        <div className="bg-cream-surface/70 rounded-2xl border border-gold-primary/30 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 border-b border-gold-primary/20 pb-3 text-maroon-primary">
            <Compass className="w-5 h-5 text-gold-primary" />
            <h2 className="font-serif font-bold text-base">વેબસાઇટ માળખું અને ફેરફાર માર્ગદર્શિકા (Visual Site Guide)</h2>
          </div>

          <p className="text-xs text-maroon-primary/80 leading-relaxed font-serif-gu">
            નીચે આપેલો નકશો દર્શાવે છે કે કયો વિભાગ સાઇટના કયા ભાગને નિયંત્રિત કરે છે. ઝડપી સંપાદન માટે સંબંધિત બટન પર ક્લિક કરો:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Header Block */}
            <div className="p-4 rounded-xl border border-gold-primary/40 bg-white/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#501518] font-serif-gu">1. હેડર અને નેવિગેશન બાર</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('header')}
                  className="text-[11px] font-semibold text-[#8C6D2D] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  બદલો <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[11px] text-[#614D43] leading-relaxed">
                • <strong>હેડર ફોટો / લોગો</strong>: {formData.header_logo_url || 'Default Logo'}<br />
                • <strong>સાઇટનું નામ</strong>: {formData.site_name_gu} / {formData.site_name_en}
              </p>
            </div>

            {/* Hero Block */}
            <div className="p-4 rounded-xl border border-gold-primary/40 bg-white/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#501518] font-serif-gu">2. હોમપેજ હીરો વિભાગ</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('main-hero')}
                  className="text-[11px] font-semibold text-[#8C6D2D] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  બદલો <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[11px] text-[#614D43] leading-relaxed">
                • <strong>મુખ્ય મથાળું</strong>: {formData.hero_heading_gu}<br />
                • <strong>સંસ્કૃત શ્લોક</strong>: {formData.hero_sanskrit_line_gu}<br />
                • <strong>હીરો દર્શન ફોટો</strong>: {formData.hero_image_url ? 'કસ્ટમ ફોટો સેટ છે' : 'ડિફૉલ્ટ શ્રીનાથજી દર્શન'}
              </p>
            </div>

            {/* Tradition Block */}
            <div className="p-4 rounded-xl border border-gold-primary/40 bg-white/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#501518] font-serif-gu">3. પરંપરા અને લેખક વિભાગ</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('tradition-author')}
                  className="text-[11px] font-semibold text-[#8C6D2D] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  બદલો <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[11px] text-[#614D43] leading-relaxed">
                • <strong>પરંપરા શીર્ષક</strong>: {formData.tradition_title_gu}<br />
                • <strong>લેખકનું નામ</strong>: {formData.author_name_gu}<br />
                • <strong>પરંપરા ફોટો</strong>: {formData.tradition_image_url ? 'કસ્ટમ ફોટો સેટ છે' : 'ડિફૉલ્ટ હવેલી ફોટો'}
              </p>
            </div>

            {/* Footer Block */}
            <div className="p-4 rounded-xl border border-gold-primary/40 bg-white/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#501518] font-serif-gu">4. ફૂટર અને સોશિયલ લિંક્સ</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('footer-contact')}
                  className="text-[11px] font-semibold text-[#8C6D2D] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  બદલો <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[11px] text-[#614D43] leading-relaxed">
                • <strong>ઇમેઇલ</strong>: {formData.contact_email || 'Set email'}<br />
                • <strong>ટેલિફોન</strong>: {formData.contact_phone || 'Set phone'}<br />
                • <strong>કૉપિરાઇટ</strong>: {formData.footer_copyright_gu}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-gold-primary/20">
        <p className="text-xs text-maroon-primary/60 font-serif-gu">
          * ફેરફારો સાચવ્યા પછી સમગ્ર વેબસાઇટ આપમેળે રીફ્રેશ થશે.
        </p>

        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3 rounded-xl text-xs font-serif font-bold text-cream-base bg-maroon-primary hover:bg-maroon-dark border border-gold-primary/50 shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer hover:shadow-lg active:scale-95"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-gold-light" />}
          બધા સેટિંગ્સ સાચવો (Save All Changes)
        </button>
      </div>
    </form>
  );
}
