'use client';

import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  X,
} from 'lucide-react';
import { uploadMedia } from '@/app/actions/media';
import { compressImageToWebP } from '@/lib/image-compress';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  postId?: string | null;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'લખવાનું શરૂ કરો...',
  minHeight = '300px',
  postId,
}: RichTextEditorProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        blockquote: false,
        horizontalRule: false,
      }),
      Blockquote,
      HorizontalRule,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-maroon-primary underline decoration-gold-primary hover:text-gold-primary transition-colors',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl border border-gold-primary/30 max-w-full my-4 shadow-sm',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-stone max-w-none focus:outline-none p-4 text-maroon-primary font-sans leading-relaxed`,
        style: `min-height: ${minHeight};`,
      },
    },
  });

  if (!editor) {
    return (
      <div className="border border-gold-primary/30 rounded-2xl p-6 bg-cream-surface/30 min-h-[200px] flex items-center justify-center text-maroon-primary/60 text-sm">
        સંપાદક લોડ થઈ રહ્યો છે... (Loading editor...)
      </div>
    );
  }

  const handleOpenLinkModal = () => {
    const previousUrl = editor.getAttributes('link').href;
    setLinkUrl(previousUrl || '');
    setLinkModalOpen(true);
  };

  const handleSetLink = () => {
    if (linkUrl.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl.trim(), target: '_blank' })
        .run();
    }
    setLinkModalOpen(false);
    setLinkUrl('');
  };

  const handleInsertImage = async () => {
    setImageError(null);
    if (!imageAlt.trim()) {
      setImageError('ઇમેજ Alt ટેક્સ્ટ (વર્ણન) આવશ્યક છે. (Alt text is required)');
      return;
    }

    if (imageFile) {
      setIsUploading(true);
      try {
        const compressed = await compressImageToWebP(imageFile);
        const formData = new FormData();
        formData.append('file', compressed);
        formData.append('alt_text', imageAlt.trim());
        if (postId) formData.append('post_id', postId);
        const res = await uploadMedia(formData);
        if (!res.success || !res.url) {
          setImageError(res.error || 'Failed to upload image');
          setIsUploading(false);
          return;
        }
        editor.chain().focus().setImage({ src: res.url, alt: imageAlt.trim() }).run();
        setImageModalOpen(false);
        setImageUrl('');
        setImageAlt('');
        setImageFile(null);
      } catch (err) {
        setImageError(err instanceof Error ? err.message : 'Error uploading');
      } finally {
        setIsUploading(false);
      }
    } else if (imageUrl.trim()) {
      editor.chain().focus().setImage({ src: imageUrl.trim(), alt: imageAlt.trim() }).run();
      setImageModalOpen(false);
      setImageUrl('');
      setImageAlt('');
    } else {
      setImageError('કૃપા કરીને ઇમેજ ફાઇલ અપલોડ કરો અથવા વેબ URL દાખલ કરો.');
    }
  };

  return (
    <div className="border border-gold-primary/40 rounded-2xl overflow-hidden bg-cream-base shadow-xs">
      {/* Toolbar */}
      <div className="bg-cream-surface/80 border-b border-gold-primary/30 p-2 flex flex-wrap items-center gap-1">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('bold')
              ? 'bg-maroon-primary text-cream-base'
              : 'text-maroon-primary/80 hover:bg-cream-surface hover:text-maroon-primary'
          }`}
          title="Bold (ઘાટા અક્ષર)"
        >
          <Bold className="w-4 h-4" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('italic')
              ? 'bg-maroon-primary text-cream-base'
              : 'text-maroon-primary/80 hover:bg-cream-surface hover:text-maroon-primary'
          }`}
          title="Italic (ત્રાંસા અક્ષર)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-gold-primary/30 mx-1" />

        {/* H2 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-maroon-primary text-cream-base'
              : 'text-maroon-primary/80 hover:bg-cream-surface hover:text-maroon-primary'
          }`}
          title="Heading 2 (મુખ્ય મથાળું)"
        >
          H2
        </button>

        {/* H3 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-maroon-primary text-cream-base'
              : 'text-maroon-primary/80 hover:bg-cream-surface hover:text-maroon-primary'
          }`}
          title="Heading 3 (ગૌણ મથાળું)"
        >
          H3
        </button>

        <div className="w-px h-5 bg-gold-primary/30 mx-1" />

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-maroon-primary text-cream-base'
              : 'text-maroon-primary/80 hover:bg-cream-surface hover:text-maroon-primary'
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-maroon-primary text-cream-base'
              : 'text-maroon-primary/80 hover:bg-cream-surface hover:text-maroon-primary'
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-maroon-primary text-cream-base'
              : 'text-maroon-primary/80 hover:bg-cream-surface hover:text-maroon-primary'
          }`}
          title="Quote / સુવિચાર (Blockquote)"
        >
          <Quote className="w-4 h-4" />
        </button>

        {/* Horizontal Rule */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 rounded-lg text-sm text-maroon-primary/80 hover:bg-cream-surface hover:text-maroon-primary transition-colors"
          title="Divider Line (વિભાજક રેખા)"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-gold-primary/30 mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={handleOpenLinkModal}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('link')
              ? 'bg-maroon-primary text-cream-base'
              : 'text-maroon-primary/80 hover:bg-cream-surface hover:text-maroon-primary'
          }`}
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        {/* Image */}
        <button
          type="button"
          onClick={() => setImageModalOpen(true)}
          className="p-2 rounded-lg text-sm text-maroon-primary/80 hover:bg-cream-surface hover:text-maroon-primary transition-colors"
          title="Insert Image with Alt Text (ઇમેજ ઉમેરો)"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-gold-primary/30 mx-1" />

        {/* Undo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded-lg text-sm text-maroon-primary/60 hover:text-maroon-primary disabled:opacity-40 transition-colors"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>

        {/* Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded-lg text-sm text-maroon-primary/60 hover:text-maroon-primary disabled:opacity-40 transition-colors"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />

      {/* Insert Image Modal */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-cream-base rounded-2xl border border-gold-primary/40 shadow-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-gold-primary/20 pb-3">
              <h3 className="font-serif font-bold text-maroon-primary">ઇમેજ ઉમેરો (Insert Image)</h3>
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="text-maroon-primary/50 hover:text-maroon-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-maroon-primary mb-1">
                  ઇમેજ ફાઇલ પસંદ કરો (Upload File)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setImageFile(f);
                    if (f && !imageAlt) {
                      setImageAlt(f.name.replace(/\.[^/.]+$/, ''));
                    }
                  }}
                  className="w-full text-xs text-maroon-primary file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-gold-primary/30 file:bg-cream-surface file:text-maroon-primary file:text-xs"
                />
              </div>

              <div className="text-center text-xs text-maroon-primary/50">— અથવા (or URL) —</div>

              <div>
                <label className="block text-xs font-semibold text-maroon-primary mb-1">
                  ઇમેજ વેબ URL (Image URL)
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full text-xs px-3 py-2 rounded-lg bg-cream-surface/60 border border-gold-primary/30 text-maroon-primary focus:outline-none focus:ring-1 focus:ring-gold-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-maroon-primary mb-1">
                  Alt Text (વર્ણન - આવશ્યક છે) <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Describe image for SEO & accessibility..."
                  className="w-full text-xs px-3 py-2 rounded-lg bg-cream-surface/60 border border-gold-primary/30 text-maroon-primary focus:outline-none focus:ring-1 focus:ring-gold-primary"
                />
              </div>

              {imageError && (
                <p className="text-xs text-red-600 font-medium">{imageError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gold-primary/20">
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-maroon-primary/80 bg-cream-surface rounded-lg border border-gold-primary/30"
              >
                રદ કરો
              </button>
              <button
                type="button"
                onClick={handleInsertImage}
                disabled={isUploading}
                className="px-5 py-2 text-xs font-semibold text-cream-base bg-maroon-primary hover:bg-maroon-dark rounded-lg shadow-sm disabled:opacity-50"
              >
                {isUploading ? 'અપલોડ થઈ રહ્યું છે...' : 'ઇમેજ ઉમેરો'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Modal */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-cream-base rounded-2xl border border-gold-primary/40 shadow-2xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between border-b border-gold-primary/20 pb-3">
              <h3 className="font-serif font-bold text-maroon-primary">લિંક ઉમેરો (Link URL)</h3>
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="text-maroon-primary/50 hover:text-maroon-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-maroon-primary mb-1">
                URL
              </label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs px-3 py-2 rounded-lg bg-cream-surface/60 border border-gold-primary/30 text-maroon-primary focus:outline-none focus:ring-1 focus:ring-gold-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gold-primary/20">
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="px-3 py-1.5 text-xs text-maroon-primary/80 bg-cream-surface rounded-lg"
              >
                રદ કરો
              </button>
              <button
                type="button"
                onClick={handleSetLink}
                className="px-4 py-1.5 text-xs font-semibold text-cream-base bg-maroon-primary rounded-lg shadow-sm"
              >
                લાગુ કરો (Apply)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
