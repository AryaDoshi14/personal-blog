'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/admin-guard';
import { prayerFormSchema } from '@/lib/validations/prayers';

export type PrayerActionResult = {
  success: boolean;
  id?: string;
  slug?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

async function isPrayerSlugUnique(
  supabase: any,
  slug: string,
  excludeId?: string
): Promise<boolean> {
  let query = supabase.from('prayers').select('id').eq('slug', slug);
  if (excludeId) {
    query = query.neq('id', excludeId);
  }
  const { data } = await query.maybeSingle();
  return !data;
}

export async function createPrayer(formData: FormData): Promise<PrayerActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError || !supabase) {
    return { success: false, error: authError || 'Admin authorization required' };
  }

  const rawData: Record<string, any> = {
    slug: formData.get('slug'),
    title_gu: formData.get('title_gu'),
    title_en: formData.get('title_en'),
    subtitle_gu: formData.get('subtitle_gu'),
    subtitle_en: formData.get('subtitle_en'),
    content_gu: formData.get('content_gu'),
    content_en: formData.get('content_en'),
    icon_type: formData.get('icon_type') || 'flute',
    order_index: Number(formData.get('order_index') || 0),
  };

  const validationResult = prayerFormSchema.safeParse(rawData);
  if (!validationResult.success) {
    const fieldErrors: Record<string, string[]> = {};
    const flatErrors = validationResult.error.flatten().fieldErrors;
    for (const [key, val] of Object.entries(flatErrors)) {
      if (val) fieldErrors[key] = val;
    }
    return {
      success: false,
      error: 'Please fix the errors in the form.',
      fieldErrors,
    };
  }

  const data = validationResult.data;

  const unique = await isPrayerSlugUnique(supabase, data.slug);
  if (!unique) {
    return {
      success: false,
      error: `A prayer with slug "${data.slug}" already exists. Please choose a different slug.`,
      fieldErrors: { slug: ['This slug is already in use.'] },
    };
  }

  const { data: newPrayer, error: insertError } = await supabase
    .from('prayers')
    .insert({
      slug: data.slug,
      title_gu: data.title_gu,
      title_en: data.title_en,
      subtitle_gu: data.subtitle_gu,
      subtitle_en: data.subtitle_en,
      content_gu: data.content_gu,
      content_en: data.content_en,
      icon_type: data.icon_type,
      order_index: data.order_index,
    })
    .select('id, slug')
    .single();

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  revalidatePath('/');
  revalidatePath('/gu');
  revalidatePath('/en');
  revalidatePath('/gu/prayers');
  revalidatePath('/en/prayers');
  revalidatePath(`/gu/prayers/${newPrayer.slug}`);
  revalidatePath(`/en/prayers/${newPrayer.slug}`);
  revalidatePath('/admin');
  revalidatePath('/admin/prayers');

  return { success: true, id: newPrayer.id, slug: newPrayer.slug };
}

export async function updatePrayer(id: string, formData: FormData): Promise<PrayerActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError || !supabase) {
    return { success: false, error: authError || 'Admin authorization required' };
  }

  const rawData: Record<string, any> = {
    slug: formData.get('slug'),
    title_gu: formData.get('title_gu'),
    title_en: formData.get('title_en'),
    subtitle_gu: formData.get('subtitle_gu'),
    subtitle_en: formData.get('subtitle_en'),
    content_gu: formData.get('content_gu'),
    content_en: formData.get('content_en'),
    icon_type: formData.get('icon_type') || 'flute',
    order_index: Number(formData.get('order_index') || 0),
  };

  const validationResult = prayerFormSchema.safeParse(rawData);
  if (!validationResult.success) {
    const fieldErrors: Record<string, string[]> = {};
    const flatErrors = validationResult.error.flatten().fieldErrors;
    for (const [key, val] of Object.entries(flatErrors)) {
      if (val) fieldErrors[key] = val;
    }
    return {
      success: false,
      error: 'Please fix the errors in the form.',
      fieldErrors,
    };
  }

  const data = validationResult.data;

  const unique = await isPrayerSlugUnique(supabase, data.slug, id);
  if (!unique) {
    return {
      success: false,
      error: `A prayer with slug "${data.slug}" already exists. Please choose a different slug.`,
      fieldErrors: { slug: ['This slug is already in use by another prayer.'] },
    };
  }

  const { data: currentPrayer } = await supabase
    .from('prayers')
    .select('slug')
    .eq('id', id)
    .single();

  const { error: updateError } = await supabase
    .from('prayers')
    .update({
      slug: data.slug,
      title_gu: data.title_gu,
      title_en: data.title_en,
      subtitle_gu: data.subtitle_gu,
      subtitle_en: data.subtitle_en,
      content_gu: data.content_gu,
      content_en: data.content_en,
      icon_type: data.icon_type,
      order_index: data.order_index,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath('/');
  revalidatePath('/gu');
  revalidatePath('/en');
  revalidatePath('/gu/prayers');
  revalidatePath('/en/prayers');
  if (currentPrayer?.slug) {
    revalidatePath(`/gu/prayers/${currentPrayer.slug}`);
    revalidatePath(`/en/prayers/${currentPrayer.slug}`);
  }
  revalidatePath(`/gu/prayers/${data.slug}`);
  revalidatePath(`/en/prayers/${data.slug}`);
  revalidatePath('/admin');
  revalidatePath('/admin/prayers');
  revalidatePath(`/admin/prayers/${id}/edit`);

  return { success: true, id, slug: data.slug };
}

export async function deletePrayer(id: string): Promise<{ success: boolean; error?: string }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError || !supabase) {
    return { success: false, error: authError || 'Admin authorization required' };
  }

  const { data: prayer } = await supabase
    .from('prayers')
    .select('slug')
    .eq('id', id)
    .single();

  const { error: deleteError } = await supabase.from('prayers').delete().eq('id', id);
  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  revalidatePath('/');
  revalidatePath('/gu');
  revalidatePath('/en');
  revalidatePath('/gu/prayers');
  revalidatePath('/en/prayers');
  if (prayer?.slug) {
    revalidatePath(`/gu/prayers/${prayer.slug}`);
    revalidatePath(`/en/prayers/${prayer.slug}`);
  }
  revalidatePath('/admin');
  revalidatePath('/admin/prayers');

  return { success: true };
}

export async function reorderPrayers(
  orderedIds: string[]
): Promise<{ success: boolean; error?: string }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError || !supabase) {
    return { success: false, error: authError || 'Admin authorization required' };
  }

  for (let index = 0; index < orderedIds.length; index++) {
    const id = orderedIds[index];
    const { error } = await supabase
      .from('prayers')
      .update({ order_index: index + 1, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error(`Failed to reorder prayer ${id}:`, error);
    }
  }

  revalidatePath('/');
  revalidatePath('/gu');
  revalidatePath('/en');
  revalidatePath('/admin/prayers');

  return { success: true };
}
