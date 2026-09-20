// ==============================================================================
// Core Domain Types for Shreeji Bawa Blog
// ==============================================================================

export type Language = 'gu' | 'en';

export interface Category {
  id: string;
  slug: string;
  name_gu: string;
  name_en: string;
  description_gu?: string | null;
  description_en?: string | null;
  sort_order: number;
  created_at: string;
}

export interface Post {
  id: string;
  slug: string;
  title_gu: string;
  title_en?: string | null;
  excerpt_gu: string;
  excerpt_en?: string | null;
  content_gu: string;
  content_en?: string | null;
  cover_image_url?: string | null;
  cover_image_alt?: string | null;
  category_id?: string | null;
  category?: Category | null;
  status: 'draft' | 'published';
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  tags: string[];
}

export interface Prayer {
  id: string;
  slug: string;
  title_gu: string;
  title_en?: string | null;
  subtitle_gu?: string | null;
  subtitle_en?: string | null;
  content_gu: string;
  content_en?: string | null;
  icon_type: 'flute' | 'lotus' | 'peacock';
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  site_name_gu: string;
  site_name_en: string;
  site_tagline_gu: string;
  site_tagline_en: string;
  hero_heading_gu: string;
  hero_heading_en: string;
  hero_intro_gu: string;
  hero_intro_en: string;
  hero_sanskrit_line_gu: string;
  hero_sanskrit_line_en: string;
  hero_image_url: string;
  tradition_title_gu: string;
  tradition_title_en: string;
  tradition_text_gu: string;
  tradition_text_en: string;
  tradition_image_url: string;
  contact_email: string;
  contact_phone: string;
  social_facebook: string;
  social_instagram: string;
  social_youtube: string;
  footer_copyright_gu: string;
  footer_copyright_en: string;
}

export interface Profile {
  id: string;
  role: 'admin' | 'viewer';
  email?: string | null;
  full_name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}
