'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/admin-guard';
import { siteSettingsSchema } from '@/lib/validations/settings';

export type SettingsActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function updateSiteSettings(formData: FormData): Promise<SettingsActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError || !supabase) {
    return { success: false, error: authError || 'Admin authorization required' };
  }

  const rawData: Record<string, unknown> = {
    site_name_gu: formData.get('site_name_gu'),
    site_name_en: formData.get('site_name_en'),
    site_tagline_gu: formData.get('site_tagline_gu'),
    site_tagline_en: formData.get('site_tagline_en'),
    header_logo_url: formData.get('header_logo_url'),
    hero_heading_gu: formData.get('hero_heading_gu'),
    hero_heading_en: formData.get('hero_heading_en'),
    hero_intro_gu: formData.get('hero_intro_gu'),
    hero_intro_en: formData.get('hero_intro_en'),
    hero_sanskrit_line_gu: formData.get('hero_sanskrit_line_gu'),
    hero_sanskrit_line_en: formData.get('hero_sanskrit_line_en'),
    hero_image_url: formData.get('hero_image_url'),
    tradition_title_gu: formData.get('tradition_title_gu'),
    tradition_title_en: formData.get('tradition_title_en'),
    tradition_text_gu: formData.get('tradition_text_gu'),
    tradition_text_en: formData.get('tradition_text_en'),
    tradition_image_url: formData.get('tradition_image_url'),
    author_photo_url: formData.get('author_photo_url'),
    author_name_gu: formData.get('author_name_gu'),
    author_name_en: formData.get('author_name_en'),
    author_bio_gu: formData.get('author_bio_gu'),
    author_bio_en: formData.get('author_bio_en'),
    contact_email: formData.get('contact_email'),
    contact_phone: formData.get('contact_phone'),
    social_facebook: formData.get('social_facebook'),
    social_instagram: formData.get('social_instagram'),
    social_youtube: formData.get('social_youtube'),
    footer_copyright_gu: formData.get('footer_copyright_gu'),
    footer_copyright_en: formData.get('footer_copyright_en'),
  };

  const validationResult = siteSettingsSchema.safeParse(rawData);
  if (!validationResult.success) {
    const fieldErrors: Record<string, string[]> = {};
    const flatErrors = validationResult.error.flatten().fieldErrors;
    for (const [key, val] of Object.entries(flatErrors)) {
      if (val) fieldErrors[key] = val;
    }
    return {
      success: false,
      error: 'Please fix the errors in the settings form.',
      fieldErrors,
    };
  }

  const data = validationResult.data;

  // Map keys to DB rows (key, value_gu, value_en)
  const rows = [
    { key: 'site_name', value_gu: data.site_name_gu, value_en: data.site_name_en || data.site_name_gu },
    { key: 'site_tagline', value_gu: data.site_tagline_gu, value_en: data.site_tagline_en || data.site_tagline_gu },
    { key: 'header_logo_url', value_gu: data.header_logo_url || '', value_en: data.header_logo_url || '' },
    { key: 'hero_heading', value_gu: data.hero_heading_gu, value_en: data.hero_heading_en || data.hero_heading_gu },
    { key: 'hero_intro', value_gu: data.hero_intro_gu, value_en: data.hero_intro_en || data.hero_intro_gu },
    { key: 'hero_sanskrit_line', value_gu: data.hero_sanskrit_line_gu || '', value_en: data.hero_sanskrit_line_en || '' },
    { key: 'hero_image_url', value_gu: data.hero_image_url || '', value_en: data.hero_image_url || '' },
    { key: 'tradition_title', value_gu: data.tradition_title_gu, value_en: data.tradition_title_en || data.tradition_title_gu },
    { key: 'tradition_text', value_gu: data.tradition_text_gu, value_en: data.tradition_text_en || data.tradition_text_gu },
    { key: 'tradition_image_url', value_gu: data.tradition_image_url || '', value_en: data.tradition_image_url || '' },
    { key: 'author_photo_url', value_gu: data.author_photo_url || '', value_en: data.author_photo_url || '' },
    { key: 'author_name', value_gu: data.author_name_gu, value_en: data.author_name_en || data.author_name_gu },
    { key: 'author_bio', value_gu: data.author_bio_gu || '', value_en: data.author_bio_en || data.author_bio_gu || '' },
    { key: 'contact_email', value_gu: data.contact_email || '', value_en: data.contact_email || '' },
    { key: 'contact_phone', value_gu: data.contact_phone || '', value_en: data.contact_phone || '' },
    { key: 'social_facebook', value_gu: data.social_facebook || '', value_en: data.social_facebook || '' },
    { key: 'social_instagram', value_gu: data.social_instagram || '', value_en: data.social_instagram || '' },
    { key: 'social_youtube', value_gu: data.social_youtube || '', value_en: data.social_youtube || '' },
    { key: 'footer_copyright', value_gu: data.footer_copyright_gu || '', value_en: data.footer_copyright_en || '' },
  ];

  for (const row of rows) {
    const { error: upsertError } = await supabase
      .from('site_settings')
      .upsert(
        {
          key: row.key,
          value_gu: row.value_gu,
          value_en: row.value_en,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

    if (upsertError) {
      console.error(`Failed to update setting ${row.key}:`, upsertError);
      return { success: false, error: `Failed to update ${row.key}: ${upsertError.message}` };
    }
  }

  revalidatePath('/', 'layout');
  revalidatePath('/gu');
  revalidatePath('/en');
  revalidatePath('/gu/tradition');
  revalidatePath('/en/tradition');
  revalidatePath('/gu/contact');
  revalidatePath('/en/contact');
  revalidatePath('/gu/blog');
  revalidatePath('/en/blog');
  revalidatePath('/admin');
  revalidatePath('/admin/settings');

  return { success: true };
}
