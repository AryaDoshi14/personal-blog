'use server';

import { contactFormSchema } from '@/lib/validations/settings';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit } from '@/lib/supabase/rate-limit';

export async function handleContactFormSubmit(formData: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  website?: string;
}): Promise<{ success: boolean; error?: string }> {
  // Honeypot: silently drop bot submissions
  if (formData.website && formData.website.trim().length > 0) {
    return { success: true };
  }

  const validationResult = contactFormSchema.safeParse(formData);
  if (!validationResult.success) {
    const errorMsg = validationResult.error.issues[0]?.message || 'Invalid form data';
    return { success: false, error: errorMsg };
  }

  const { name, email, phone, subject, message } = validationResult.data;

  // Rate-limit: max 5 contact submissions per email per hour
  const allowed = await checkRateLimit(`contact:${email}`, 5, 3600);
  if (!allowed) {
    return { success: false, error: 'Too many submissions. Please try again later.' };
  }

  try {
    // Use service-role client: the anon INSERT policy on messages is revoked.
    // All validation and honeypot checks happen above, so this is safe.
    const admin = createAdminClient();
    if (!admin) {
      // Graceful local-dev fallback (no service role key configured)
      return { success: true };
    }

    const { error } = await admin.from('messages').insert({
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
    });

    if (error) {
      console.error('Contact form DB error:', error.message);
      // Hide raw DB errors from the caller
      return { success: false, error: 'Failed to send message. Please try again.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Contact form unexpected error:', err);
    return { success: false, error: 'Failed to send message. Please try again.' };
  }
}

