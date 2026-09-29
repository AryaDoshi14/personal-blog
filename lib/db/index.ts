import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/supabase/admin-guard';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_POSTS,
  DEFAULT_PRAYERS,
  DEFAULT_SITE_SETTINGS,
} from '@/lib/data/defaults';
import { Category, Comment, Post, Prayer, SiteSettings } from '@/types';

// ==============================================================================
// SITE SETTINGS
// ==============================================================================
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return DEFAULT_SITE_SETTINGS;

    const { data, error } = await supabase.from('site_settings').select('key, value_gu, value_en');
    if (error) {
      console.error('Error in getSiteSettings:', error);
      return DEFAULT_SITE_SETTINGS;
    }
    if (!data || data.length === 0) {
      return DEFAULT_SITE_SETTINGS;
    }

    const settingsMap: Record<string, { gu: string; en: string | null }> = {};
    for (const row of data) {
      settingsMap[row.key] = {
        gu: row.value_gu ?? '',
        en: row.value_en ?? null,
      };
    }

    // Required fields: fallback if missing from DB or empty string
    // Optional fields: use ?? so admin can intentionally clear the field (only fallback if key not in DB)
    const getReqGu = (key: string, def: string) => settingsMap[key]?.gu || def;
    const getReqEn = (key: string, def: string) => settingsMap[key]?.en || settingsMap[key]?.gu || def;
    const getOptGu = (key: string, def: string) =>
      settingsMap[key] !== undefined ? settingsMap[key].gu : def;
    const getOptEn = (key: string, def: string) =>
      settingsMap[key] !== undefined ? (settingsMap[key].en ?? '') : def;

    return {
      site_name_gu: getReqGu('site_name', DEFAULT_SITE_SETTINGS.site_name_gu),
      site_name_en: getReqEn('site_name', DEFAULT_SITE_SETTINGS.site_name_en),
      site_tagline_gu: getReqGu('site_tagline', DEFAULT_SITE_SETTINGS.site_tagline_gu),
      site_tagline_en: getOptEn('site_tagline', DEFAULT_SITE_SETTINGS.site_tagline_en),
      header_logo_url: getOptGu('header_logo_url', DEFAULT_SITE_SETTINGS.header_logo_url || '/images/defaults/logo-mandala.svg'),
      hero_heading_gu: getReqGu('hero_heading', DEFAULT_SITE_SETTINGS.hero_heading_gu),
      hero_heading_en: getOptEn('hero_heading', DEFAULT_SITE_SETTINGS.hero_heading_en),
      hero_intro_gu: getReqGu('hero_intro', DEFAULT_SITE_SETTINGS.hero_intro_gu),
      hero_intro_en: getOptEn('hero_intro', DEFAULT_SITE_SETTINGS.hero_intro_en),
      hero_sanskrit_line_gu: getOptGu('hero_sanskrit_line', DEFAULT_SITE_SETTINGS.hero_sanskrit_line_gu),
      hero_sanskrit_line_en: getOptEn('hero_sanskrit_line', DEFAULT_SITE_SETTINGS.hero_sanskrit_line_en),
      hero_image_url: getOptGu('hero_image_url', DEFAULT_SITE_SETTINGS.hero_image_url),
      tradition_title_gu: getReqGu('tradition_title', DEFAULT_SITE_SETTINGS.tradition_title_gu),
      tradition_title_en: getOptEn('tradition_title', DEFAULT_SITE_SETTINGS.tradition_title_en),
      tradition_text_gu: getReqGu('tradition_text', DEFAULT_SITE_SETTINGS.tradition_text_gu),
      tradition_text_en: getOptEn('tradition_text', DEFAULT_SITE_SETTINGS.tradition_text_en),
      tradition_image_url: getOptGu('tradition_image_url', DEFAULT_SITE_SETTINGS.tradition_image_url),
      author_photo_url: getOptGu('author_photo_url', DEFAULT_SITE_SETTINGS.author_photo_url),
      author_name_gu: getReqGu('author_name', DEFAULT_SITE_SETTINGS.author_name_gu),
      author_name_en: getOptEn('author_name', DEFAULT_SITE_SETTINGS.author_name_en),
      author_bio_gu: getOptGu('author_bio', DEFAULT_SITE_SETTINGS.author_bio_gu),
      author_bio_en: getOptEn('author_bio', DEFAULT_SITE_SETTINGS.author_bio_en),
      contact_email: getOptGu('contact_email', DEFAULT_SITE_SETTINGS.contact_email),
      contact_phone: getOptGu('contact_phone', DEFAULT_SITE_SETTINGS.contact_phone),
      social_facebook: getOptGu('social_facebook', DEFAULT_SITE_SETTINGS.social_facebook),
      social_instagram: getOptGu('social_instagram', DEFAULT_SITE_SETTINGS.social_instagram),
      social_youtube: getOptGu('social_youtube', DEFAULT_SITE_SETTINGS.social_youtube),
      footer_copyright_gu: getOptGu('footer_copyright', DEFAULT_SITE_SETTINGS.footer_copyright_gu),
      footer_copyright_en: getOptEn('footer_copyright', DEFAULT_SITE_SETTINGS.footer_copyright_en),
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

    if (error) {
      console.error('Error in getCategories:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return DEFAULT_CATEGORIES;
    }

    return data as Category[];
  } catch (err) {
    console.error('Error in getCategories:', err);
    return [];
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

    if (error) {
      console.error('Error in getPrayers:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return DEFAULT_PRAYERS;
    }

    return data as Prayer[];
  } catch (err) {
    console.error('Error in getPrayers:', err);
    return [];
  }
}

export async function getPrayerBySlug(slug: string): Promise<Prayer | null> {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return DEFAULT_PRAYERS.find((p) => p.slug === slug) || null;
    }

    const { data, error } = await supabase
      .from('prayers')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Error in getPrayerBySlug:', error);
      return null;
    }

    if (!data) {
      // Check if DB table is completely empty
      const { count } = await supabase
        .from('prayers')
        .select('*', { count: 'exact', head: true });
      if (count === 0) {
        return DEFAULT_PRAYERS.find((p) => p.slug === slug) || null;
      }
      return null;
    }

    return data as Prayer;
  } catch (err) {
    console.error('Error in getPrayerBySlug:', err);
    return null;
  }
}

// ==============================================================================
// POSTS / BLOGS
// ==============================================================================
function cleanSearchTerm(term: string): string {
  // Cap length to 100 characters and strip characters that break PostgREST .or() syntax
  return term
    .slice(0, 100)
    .replace(/[,()"\\]/g, ' ')
    .replace(/[%_]/g, '\\$&')
    .trim();
}

export async function getPublishedPosts(options?: {
  categoryId?: string;
  limit?: number;
  search?: string;
}): Promise<Post[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const rawSearch = options?.search?.trim();

    if (!supabase) {
      // Fallback when Supabase is not configured
      let posts = [...DEFAULT_POSTS];
      if (options?.categoryId) {
        posts = posts.filter((p) => p.category_id === options.categoryId);
      }
      if (rawSearch) {
        const q = rawSearch.toLowerCase();
        posts = posts.filter(
          (p) =>
            p.title_gu.toLowerCase().includes(q) ||
            (p.title_en || '').toLowerCase().includes(q) ||
            p.excerpt_gu.toLowerCase().includes(q) ||
            (p.excerpt_en || '').toLowerCase().includes(q) ||
            p.author_name_gu.toLowerCase().includes(q) ||
            (p.author_name_en || '').toLowerCase().includes(q) ||
            p.tags?.some((t) => t.toLowerCase().includes(q))
        );
      }
      if (options?.limit) {
        posts = posts.slice(0, options.limit);
      }
      return posts;
    }

    let query = supabase
      .from('posts')
      .select('*, category:categories(*)')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (options?.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }

    if (rawSearch) {
      const q = cleanSearchTerm(rawSearch);
      if (q) {
        query = query.or(
          `title_gu.ilike.%${q}%,title_en.ilike.%${q}%,excerpt_gu.ilike.%${q}%,excerpt_en.ilike.%${q}%,author_name_gu.ilike.%${q}%,author_name_en.ilike.%${q}%`
        );
      }
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error in getPublishedPosts:', error);
      return [];
    }

    if (!data || data.length === 0) {
      // If a search or category filter was applied, return empty result
      if (rawSearch || options?.categoryId) {
        return [];
      }
      // Check if DB table is genuinely empty (no published posts seeded yet)
      const { count } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });
      if (count === 0) {
        let posts = [...DEFAULT_POSTS];
        if (options?.limit) {
          posts = posts.slice(0, options.limit);
        }
        return posts;
      }
      return [];
    }

    return data as Post[];
  } catch (err) {
    console.error('Error in getPublishedPosts:', err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return DEFAULT_POSTS.find((p) => p.slug === slug) || null;
    }

    const { data, error } = await supabase
      .from('posts')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) {
      console.error('Error in getPostBySlug:', error);
      return null;
    }

    if (!data) {
      // Check if DB table is genuinely empty
      const { count } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });
      if (count === 0) {
        return DEFAULT_POSTS.find((p) => p.slug === slug) || null;
      }
      return null;
    }

    return data as Post;
  } catch (err) {
    console.error('Error in getPostBySlug:', err);
    return null;
  }
}

// Dead code removed: submitContactMessage was a duplicate of app/actions/contact.ts.
// Use handleContactFormSubmit from @/app/actions/contact instead.


// ==============================================================================
// COMMENTS
// ==============================================================================
export async function getApprovedComments(postId: string): Promise<Comment[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return [];

    // Attempt RPC call (SECURITY DEFINER, selects full_name and avatar_url only - never email/role)
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_approved_comments', {
      p_post_id: postId,
    });

    if (!rpcError && rpcData) {
      return rpcData as Comment[];
    }

    // Direct query fallback: never select email or role
    const { data: comments, error } = await supabase
      .from('comments')
      .select('id, post_id, user_id, content, status, created_at, updated_at')
      .eq('post_id', postId)
      .eq('status', 'approved')
      .order('created_at', { ascending: true });

    if (error || !comments) {
      if (error) console.error('Error in getApprovedComments:', error);
      return [];
    }

    // Fetch user public profiles (id, full_name, avatar_url only)
    const userIds = Array.from(new Set(comments.map((c) => c.user_id)));
    let profilesMap: Record<string, { id: string; full_name?: string | null; avatar_url?: string | null }> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('public_profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);
      if (profiles) {
        profilesMap = Object.fromEntries(profiles.map((p) => [p.id, p]));
      }
    }

    return comments.map((c) => ({
      ...c,
      user: profilesMap[c.user_id]
        ? {
            id: profilesMap[c.user_id].id,
            role: 'viewer' as const,
            full_name: profilesMap[c.user_id].full_name,
            avatar_url: profilesMap[c.user_id].avatar_url,
            created_at: '',
            updated_at: '',
          }
        : null,
    })) as Comment[];
  } catch (err) {
    console.error('Error in getApprovedComments:', err);
    return [];
  }
}

export async function getAllCommentsForAdmin(): Promise<Comment[]> {
  // Security guard: must be called from an admin-authenticated context.
  // Even though admin pages should be protected by middleware, this defence-in-depth
  // check ensures that a misconfigured matcher cannot expose commenter emails.
  const { error: authError } = await requireAdmin();
  if (authError) {
    console.error('getAllCommentsForAdmin: unauthorised access attempt –', authError);
    return [];
  }

  try {
    const admin = createAdminClient();
    const client = admin || (await createServerSupabaseClient());
    if (!client) return [];

    const { data, error } = await client
      .from('comments')
      .select(
        '*, user:profiles(id, role, email, full_name, avatar_url, created_at, updated_at), post:posts(id, slug, title_gu, title_en)'
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error in getAllCommentsForAdmin:', error);
      return [];
    }

    return (data || []) as Comment[];
  } catch (err) {
    console.error('Error in getAllCommentsForAdmin:', err);
    return [];
  }
}
