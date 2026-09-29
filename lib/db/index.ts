import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_POSTS,
  DEFAULT_PRAYERS,
  DEFAULT_SITE_SETTINGS,
} from '@/lib/data/defaults';
import { Category, Comment, ContactMessage, Post, Prayer, SiteSettings } from '@/types';

// ==============================================================================
// SITE SETTINGS
// ==============================================================================
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return DEFAULT_SITE_SETTINGS;

    const { data, error } = await supabase.from('site_settings').select('key, value_gu, value_en');
    if (error || !data || data.length === 0) {
      return DEFAULT_SITE_SETTINGS;
    }

    const settingsMap: Record<string, { gu: string; en: string }> = {};
    for (const row of data) {
      settingsMap[row.key] = {
        gu: row.value_gu || '',
        en: row.value_en || row.value_gu || '',
      };
    }

    return {
      site_name_gu: settingsMap['site_name']?.gu || DEFAULT_SITE_SETTINGS.site_name_gu,
      site_name_en: settingsMap['site_name']?.en || DEFAULT_SITE_SETTINGS.site_name_en,
      site_tagline_gu: settingsMap['site_tagline']?.gu || DEFAULT_SITE_SETTINGS.site_tagline_gu,
      site_tagline_en: settingsMap['site_tagline']?.en || DEFAULT_SITE_SETTINGS.site_tagline_en,
      hero_heading_gu: settingsMap['hero_heading']?.gu || DEFAULT_SITE_SETTINGS.hero_heading_gu,
      hero_heading_en: settingsMap['hero_heading']?.en || DEFAULT_SITE_SETTINGS.hero_heading_en,
      hero_intro_gu: settingsMap['hero_intro']?.gu || DEFAULT_SITE_SETTINGS.hero_intro_gu,
      hero_intro_en: settingsMap['hero_intro']?.en || DEFAULT_SITE_SETTINGS.hero_intro_en,
      hero_sanskrit_line_gu: settingsMap['hero_sanskrit_line']?.gu || DEFAULT_SITE_SETTINGS.hero_sanskrit_line_gu,
      hero_sanskrit_line_en: settingsMap['hero_sanskrit_line']?.en || DEFAULT_SITE_SETTINGS.hero_sanskrit_line_en,
      hero_image_url: settingsMap['hero_image_url']?.gu || DEFAULT_SITE_SETTINGS.hero_image_url,
      tradition_title_gu: settingsMap['tradition_title']?.gu || DEFAULT_SITE_SETTINGS.tradition_title_gu,
      tradition_title_en: settingsMap['tradition_title']?.en || DEFAULT_SITE_SETTINGS.tradition_title_en,
      tradition_text_gu: settingsMap['tradition_text']?.gu || DEFAULT_SITE_SETTINGS.tradition_text_gu,
      tradition_text_en: settingsMap['tradition_text']?.en || DEFAULT_SITE_SETTINGS.tradition_text_en,
      tradition_image_url: settingsMap['tradition_image_url']?.gu || DEFAULT_SITE_SETTINGS.tradition_image_url,
      author_photo_url: settingsMap['author_photo_url']?.gu || DEFAULT_SITE_SETTINGS.author_photo_url,
      author_name_gu: settingsMap['author_name']?.gu || DEFAULT_SITE_SETTINGS.author_name_gu,
      author_name_en: settingsMap['author_name']?.en || DEFAULT_SITE_SETTINGS.author_name_en,
      author_bio_gu: settingsMap['author_bio']?.gu || DEFAULT_SITE_SETTINGS.author_bio_gu,
      author_bio_en: settingsMap['author_bio']?.en || DEFAULT_SITE_SETTINGS.author_bio_en,
      contact_email: settingsMap['contact_email']?.gu || DEFAULT_SITE_SETTINGS.contact_email,
      contact_phone: settingsMap['contact_phone']?.gu || DEFAULT_SITE_SETTINGS.contact_phone,
      social_facebook: settingsMap['social_facebook']?.gu || DEFAULT_SITE_SETTINGS.social_facebook,
      social_instagram: settingsMap['social_instagram']?.gu || DEFAULT_SITE_SETTINGS.social_instagram,
      social_youtube: settingsMap['social_youtube']?.gu || DEFAULT_SITE_SETTINGS.social_youtube,
      footer_copyright_gu: settingsMap['footer_copyright']?.gu || DEFAULT_SITE_SETTINGS.footer_copyright_gu,
      footer_copyright_en: settingsMap['footer_copyright']?.en || DEFAULT_SITE_SETTINGS.footer_copyright_en,
    };
  } catch (err) {
    console.error('Error in getSiteSettings:', err);
    return DEFAULT_SITE_SETTINGS;
  }
}

// ==============================================================================
// CATEGORIES
// ==============================================================================
export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return DEFAULT_CATEGORIES;

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_CATEGORIES;
    }

    return data as Category[];
  } catch (err) {
    console.error('Error in getCategories:', err);
    return DEFAULT_CATEGORIES;
  }
}

// ==============================================================================
// PRAYERS
// ==============================================================================
export async function getPrayers(): Promise<Prayer[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return DEFAULT_PRAYERS;

    const { data, error } = await supabase
      .from('prayers')
      .select('*')
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_PRAYERS;
    }

    return data as Prayer[];
  } catch (err) {
    console.error('Error in getPrayers:', err);
    return DEFAULT_PRAYERS;
  }
}

export async function getPrayerBySlug(slug: string): Promise<Prayer | null> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('prayers')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        return data as Prayer;
      }
    }

    return DEFAULT_PRAYERS.find((p) => p.slug === slug) || null;
  } catch (err) {
    console.error('Error in getPrayerBySlug:', err);
    return DEFAULT_PRAYERS.find((p) => p.slug === slug) || null;
  }
}

// ==============================================================================
// POSTS / BLOGS
// ==============================================================================
function escapeIlike(term: string): string {
  return term.replace(/[%_\\]/g, '\\$&');
}

export async function getPublishedPosts(options?: {
  categoryId?: string;
  limit?: number;
  search?: string;
}): Promise<Post[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const searchTerm = options?.search?.trim();

    if (supabase) {
      let query = supabase
        .from('posts')
        .select('*, category:categories(*)')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (options?.categoryId) {
        query = query.eq('category_id', options.categoryId);
      }

      if (searchTerm) {
        const q = escapeIlike(searchTerm);
        query = query.or(
          `title_gu.ilike.%${q}%,title_en.ilike.%${q}%,author_name_gu.ilike.%${q}%,author_name_en.ilike.%${q}%`
        );
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (!error && data) {
        // Preserve defaults fallback only when DB is empty and no search was applied
        if (searchTerm || data.length > 0) {
          return data as Post[];
        }
      }
    }

    // Fallback to default posts
    let posts = [...DEFAULT_POSTS];
    if (options?.categoryId) {
      posts = posts.filter((p) => p.category_id === options.categoryId);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title_gu.toLowerCase().includes(q) ||
          (p.title_en || '').toLowerCase().includes(q) ||
          p.author_name_gu.toLowerCase().includes(q) ||
          (p.author_name_en || '').toLowerCase().includes(q)
      );
    }
    if (options?.limit) {
      posts = posts.slice(0, options.limit);
    }
    return posts;
  } catch (err) {
    console.error('Error in getPublishedPosts:', err);
    return DEFAULT_POSTS;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('posts')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      console.log('[DEBUG getPostBySlug] DB result - data:', Boolean(data), 'error:', error?.message || null);
      if (!error && data) {
        return data as Post;
      }
    }

    const fallback = DEFAULT_POSTS.find((p) => p.slug === slug) || null;
    console.log('[DEBUG getPostBySlug] Fallback found:', Boolean(fallback), 'slug:', slug);
    return fallback;
  } catch (err) {
    console.error('Error in getPostBySlug:', err);
    return DEFAULT_POSTS.find((p) => p.slug === slug) || null;
  }
}

// ==============================================================================
// MESSAGES (Contact Form Submission)
// ==============================================================================
export async function submitContactMessage(message: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      // In local mode without Supabase connection, return success for form testing
      return { success: true };
    }

    const { error } = await supabase.from('messages').insert({
      name: message.name,
      email: message.email,
      phone: message.phone || null,
      subject: message.subject || null,
      message: message.message,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: errorMsg };
  }
}

// ==============================================================================
// COMMENTS
// ==============================================================================
export async function getApprovedComments(postId: string): Promise<Comment[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('comments')
      .select('*, user:profiles(id, role, email, full_name, avatar_url, created_at, updated_at)')
      .eq('post_id', postId)
      .eq('status', 'approved')
      .order('created_at', { ascending: true });

    if (error || !data) return [];
    return data as Comment[];
  } catch (err) {
    console.error('Error in getApprovedComments:', err);
    return [];
  }
}

export async function getAllCommentsForAdmin(): Promise<Comment[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('comments')
      .select(
        '*, user:profiles(id, role, email, full_name, avatar_url, created_at, updated_at), post:posts(id, slug, title_gu, title_en)'
      )
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as Comment[];
  } catch (err) {
    console.error('Error in getAllCommentsForAdmin:', err);
    return [];
  }
}
