'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadMedia } from '@/app/actions/media';

interface ImageUploaderProps {
  label: string;
  sublabel?: string;
  imageUrl?: string | null;
  altText?: string | null;
  requiredAlt?: boolean;
  onImageChange: (url: string, altText: string) => void;
  onImageRemove?: () => void;
  error?: string;
}

export default function ImageUploader({
  label,
  sublabel = 'JPG, PNG, WebP or SVG up to 5MB',
  imageUrl,
  altText = '',
  requiredAlt = true,
  onImageChange,
  onImageRemove,
  error,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentAlt, setCurrentAlt] = useState(altText || '');
  const [currentUrl, setCurrentUrl] = useState(imageUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setUploadError(null);

    // Validate Alt text
    const effectiveAlt = currentAlt.trim() || file.name.replace(/\.[^/.]+$/, '');
    if (requiredAlt && !effectiveAlt) {
      setUploadError('કૃપા કરીને ઇમેજ અપલોડ કરતા પહેલા Alt ટેક્સ્ટ દાખલ કરો.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt_text', effectiveAlt);

      const result = await uploadMedia(formData);
      if (!result.success || !result.url) {
        setUploadError(result.error || 'Upload failed');
      } else {
        setCurrentUrl(result.url);
        setCurrentAlt(effectiveAlt);
        onImageChange(result.url, effectiveAlt);
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Error uploading file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAltChange = (newAlt: string) => {
    setCurrentAlt(newAlt);
    if (currentUrl) {
      onImageChange(currentUrl, newAlt);
    }
  };

  const handleRemove = () => {
    setCurrentUrl('');
    setCurrentAlt('');
    if (onImageRemove) onImageRemove();
    else onImageChange('', '');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-maroon-primary">
          {label}
        </label>
        <span className="text-xs text-maroon-primary/60">{sublabel}</span>
      </div>

      {currentUrl ? (
        <div className="border border-gold-primary/30 rounded-2xl p-4 bg-cream-surface/60 space-y-3">
          <div className="relative aspect-video max-h-56 w-full overflow-hidden rounded-xl bg-black/5 border border-gold-primary/20 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUrl}
              alt={currentAlt || 'Cover preview'}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600/90 text-white hover:bg-red-700 shadow-md transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-maroon-primary mb-1">
              Image Alt Text (વર્ણન) {requiredAlt && <span className="text-red-600">*</span>}
            </label>
            <input
              type="text"
              value={currentAlt}
              onChange={(e) => handleAltChange(e.target.value)}
              placeholder="Describe this image for screen readers and SEO..."
              className="w-full text-xs px-3 py-2 rounded-lg bg-cream-base border border-gold-primary/30 text-maroon-primary focus:outline-none focus:ring-1 focus:ring-gold-primary"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Alt text input field before upload if required */}
          <div>
            <label className="block text-xs font-medium text-maroon-primary/80 mb-1">
              Image Alt Text (અપલોડ કરતા પહેલા લખો) {requiredAlt && <span className="text-red-600">*</span>}
            </label>
            <input
              type="text"
              value={currentAlt}
              onChange={(e) => setCurrentAlt(e.target.value)}
              placeholder="e.g. Shrinathji temple sanctum with fresh garlands"
              className="w-full text-xs px-3 py-2 rounded-lg bg-cream-base border border-gold-primary/30 text-maroon-primary focus:outline-none focus:ring-1 focus:ring-gold-primary"
            />
          </div>

          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed border-gold-primary/40 hover:border-gold-primary rounded-2xl p-6 text-center cursor-pointer transition-all bg-cream-surface/30 hover:bg-cream-surface/60 ${
              isUploading ? 'opacity-60 pointer-events-none' : ''
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-cream-surface flex items-center justify-center text-maroon-primary border border-gold-primary/30">
                {isUploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-gold-primary" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-maroon-primary">
                  {isUploading ? 'અપલોડ થઈ રહ્યું છે...' : 'ઇમેજ પસંદ કરવા માટે અહીં ક્લિક કરો'}
                </p>
                <p className="text-xs text-maroon-primary/60 mt-0.5">
                  અથવા અહીં ડ્રેગ અને ડ્રોપ કરો (Max 5MB)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-red-600 font-medium">{uploadError}</p>
      )}
      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}
