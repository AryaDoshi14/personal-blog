'use server';

import { contactFormSchema } from '@/lib/validations/settings';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function handleContactFormSubmit(formData: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  website?: string;
}): Promise<{ success: boolean; error?: string }> {
  // Honeypot check
  if (formData.website && formData.website.trim().length > 0) {
    // Silently drop bot submission
    return { success: true };
  }

  const validationResult = contactFormSchema.safeParse(formData);
  if (!validationResult.success) {
    const errorMsg = validationResult.error.issues[0]?.message || 'Invalid form data';
    return { success: false, error: errorMsg };
  }

  const { name, email, phone, subject, message } = validationResult.data;

  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return { success: true }; // Local test fallback
    }

    const { error } = await supabase.from('messages').insert({
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to send message',
    };
  }
}
